from sqlalchemy.orm import Session
from database import SessionLocal
import models
import time
import asyncio

from .detection import run_detection_agent
from .threat_intelligence import run_intelligence_agent
from .reasoning import run_reasoning_agent
from .response import run_response_agent
from .ocr_agent import analyze_image
from .memory import check_threat_memory
import json
from routers.websocket import broadcast_sync

def log_agent_action(db: Session, investigation_id: int, agent_name: str, action: str, details: str):
    log = models.AgentLog(
        investigation_id=investigation_id,
        agent_name=agent_name,
        action=action,
        details=details
    )
    db.add(log)
    db.commit()

    # Broadcast to WebSocket
    broadcast_sync({
        "type": "telemetry",
        "log": f"> [{agent_name}] {action}: {details}"
    })

def run_investigation_pipeline(investigation_id: int):
    # This runs in background
    db = SessionLocal()
    inv = db.query(models.Investigation).filter(models.Investigation.id == investigation_id).first()
    
    if not inv:
        db.close()
        return

    try:
        inv.status = "running"
        db.commit()

        # Preprocessing Layer (OCR) if image
        if inv.type == "image":
            log_agent_action(db, inv.id, "OCR Agent", "Started", "Extracting text and scanning for scam visual indicators...")
            ocr_data = analyze_image(inv.target)
            log_agent_action(db, inv.id, "OCR Agent", "Completed", "Extracted text from image.")
            # Swap target with extracted text for subsequent text analysis
            actual_target = ocr_data.get("extracted_text", inv.target)
            inv.target = actual_target
            db.commit()

        # 1. Detection Agent
        log_agent_action(db, inv.id, "Detection Agent", "Started", "Analyzing target content...")
        detection_data = run_detection_agent(inv.target, inv.type)
        log_agent_action(db, inv.id, "Detection Agent", "Completed", f"Classified as {detection_data.get('threat_type', 'Unknown')} with score {detection_data.get('risk_score', 0)}")

        # Update partial results
        results = models.ThreatResult(
            investigation_id=inv.id,
            threat_type=detection_data.get('threat_type', 'Unknown'),
            risk_score=detection_data.get('risk_score', 0),
            severity=detection_data.get('severity', 'Unknown'),
            intelligence_data={},
            reasoning=""
        )
        db.add(results)
        db.commit()

        # 2. Threat Intelligence Agent
        log_agent_action(db, inv.id, "Threat Intelligence Agent", "Started", "Gathering external intelligence (VirusTotal, WHOIS)...")
        intel_data = run_intelligence_agent(inv.target, inv.type, detection_data)
        log_agent_action(db, inv.id, "Threat Intelligence Agent", "Completed", "Gathered intelligence data.")

        # Update results
        results.intelligence_data = intel_data
        db.commit()

        # 2.5 Threat Memory Engine (Check for repeated campaigns)
        log_agent_action(db, inv.id, "Threat Memory Engine", "Started", "Cross-referencing global threat memory...")
        memory_data = check_threat_memory(db, inv.target)
        if memory_data["is_repeat"]:
            log_agent_action(db, inv.id, "Threat Memory Engine", "Alert", memory_data["memory_alert"])
            # Escalate risk score and severity for repeated attacks
            detection_data['severity'] = memory_data['escalated_severity']
            detection_data['risk_score'] = min(100, detection_data.get('risk_score', 0) + 20)
            results.severity = memory_data['escalated_severity']
            results.risk_score = detection_data['risk_score']
            db.commit()
        else:
            log_agent_action(db, inv.id, "Threat Memory Engine", "Completed", "No historical matches found. Unique threat.")

        # 3. Reasoning Agent
        log_agent_action(db, inv.id, "Reasoning Agent", "Started", "Reasoning about threat vectors and tactics...")
        reasoning = run_reasoning_agent(inv.target, inv.type, detection_data, intel_data)
        log_agent_action(db, inv.id, "Reasoning Agent", "Completed", "Generated reasoning explanation.")

        # Update results
        results.reasoning = reasoning
        db.commit()

        # 4. Response Agent
        log_agent_action(db, inv.id, "Response Agent", "Started", "Generating incident response plan...")
        response_data = run_response_agent(inv.target, inv.type, detection_data, intel_data, reasoning)
        log_agent_action(db, inv.id, "Response Agent", "Completed", "Incident response report generated.")

        report = models.Report(
            investigation_id=inv.id,
            summary=response_data.get('summary', ''),
            remediation_actions=response_data.get('remediation_actions', [])
        )
        db.add(report)
        db.commit()

        # Fire Webhook / Notification event
        if detection_data.get('severity') in ['High', 'Critical']:
            alert = models.Notification(
                type="threat_detected",
                message=json.dumps({"investigation_id": inv.id, "threat": detection_data.get('threat_type')}),
                severity=detection_data.get('severity')
            )
            db.add(alert)
        
        # Dashboard update webhook event
        dash_alert = models.Notification(type="dashboard_update", message="Investigation Completed", severity="Info")
        db.add(dash_alert)

        # Finalize
        inv.status = "completed"
        log_agent_action(db, inv.id, "System", "Completed", "Investigation finished successfully. Webhooks fired.")
        db.commit()

        # Broadcast final threat feed event
        broadcast_sync({
            "type": "threat_update",
            "threat": {
                "id": str(inv.id),
                "type": detection_data.get('threat_type', 'Unknown'),
                "source": "Webhook Event",
                "target": inv.target[:30] + "...",
                "severity": detection_data.get('severity', 'Unknown'),
                "action": "Blocked" if detection_data.get('severity') in ['High', 'Critical'] else "Flagged"
            }
        })

    except Exception as e:
        inv.status = "failed"
        log_agent_action(db, inv.id, "System", "Failed", f"Error during pipeline execution: {str(e)}")
        db.commit()
    finally:
        db.close()
