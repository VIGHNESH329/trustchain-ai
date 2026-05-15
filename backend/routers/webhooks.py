from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
import json

import models, schemas
from database import get_db
from agents.orchestrator import run_investigation_pipeline

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/new-message", response_model=schemas.WebhookEventResponse)
def handle_new_message(payload: schemas.WebhookNewMessage, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Create an event record
    db_event = models.WebhookEvent(
        event_type="new_message",
        source=payload.source,
        payload=payload.model_dump()
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Convert webhook event into an investigation automatically
    db_investigation = models.Investigation(
        target=payload.content,
        type="text",
        status="pending"
    )
    db.add(db_investigation)
    db.commit()
    db.refresh(db_investigation)

    # Log start
    log = models.AgentLog(investigation_id=db_investigation.id, agent_name="System", action="Webhook Triggered", details=f"New message from {payload.source} initiated autonomous investigation.")
    db.add(log)
    db.commit()

    # Trigger async investigation
    background_tasks.add_task(run_investigation_pipeline, db_investigation.id)

    db_event.status = "processed"
    db.commit()

    return db_event

@router.post("/url-scan", response_model=schemas.WebhookEventResponse)
def handle_url_scan(payload: schemas.WebhookUrlScan, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Create an event record
    db_event = models.WebhookEvent(
        event_type="url_scan",
        source=payload.source,
        payload=payload.model_dump()
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Convert webhook event into an investigation automatically
    db_investigation = models.Investigation(
        target=payload.url,
        type="url",
        status="pending"
    )
    db.add(db_investigation)
    db.commit()
    db.refresh(db_investigation)

    # Log start
    log = models.AgentLog(investigation_id=db_investigation.id, agent_name="System", action="Webhook Triggered", details=f"URL scan requested by browser extension.")
    db.add(log)
    db.commit()

    # Trigger async investigation
    background_tasks.add_task(run_investigation_pipeline, db_investigation.id)

    db_event.status = "processed"
    db.commit()

    return db_event

@router.post("/threat-detected")
def handle_threat_detected(payload: dict, db: Session = Depends(get_db)):
    # External webhook for when the backend wants to broadcast a threat alert
    # or receive an alert from another internal service.
    # In a full app, this connects to a WebSocket manager for live UI updates.
    notification = models.Notification(
        type="threat_detected",
        message=json.dumps(payload),
        severity="High"
    )
    db.add(notification)
    db.commit()
    return {"status": "success", "message": "Threat alert broadcasted"}

@router.post("/dashboard-update")
def handle_dashboard_update(payload: dict):
    # This endpoint receives pings to update dashboard stats
    # Can integrate with Pusher/WebSockets
    return {"status": "success", "message": "Dashboard notified"}

@router.post("/guardian-alert")
def handle_guardian_alert(payload: dict, db: Session = Depends(get_db)):
    # Emergency warning webhook
    notification = models.Notification(
        type="guardian_alert",
        message=f"Emergency Alert: {json.dumps(payload)}",
        severity="Critical"
    )
    db.add(notification)
    db.commit()
    return {"status": "success", "message": "Guardian alerted"}

@router.post("/soc-alert")
def handle_soc_alert(payload: dict, db: Session = Depends(get_db)):
    # B2B enterprise webhook for SIEM integration
    notification = models.Notification(
        type="soc_alert",
        message=json.dumps(payload),
        severity="Medium"
    )
    db.add(notification)
    db.commit()
    return {"status": "success", "message": "SOC alert logged"}
