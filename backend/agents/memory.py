import sqlalchemy
from sqlalchemy.orm import Session
import models

def check_threat_memory(db: Session, target: str) -> dict:
    """
    Threat Memory Engine:
    Cross-references the current target against historical investigations.
    Detects repeated scam campaigns and recurring malicious domains.
    """
    # Look for previous investigations with the same target that were NOT marked as 'Safe'
    past_threats = db.query(models.Investigation).join(models.ThreatResult).filter(
        models.Investigation.target == target,
        models.ThreatResult.severity.in_(['High', 'Critical', 'Medium'])
    ).all()

    count = len(past_threats)
    
    if count > 0:
        # It's a repeated attack!
        return {
            "is_repeat": True,
            "campaign_hits": count,
            "memory_alert": f"WARNING: Target identified in {count} previous malicious campaigns.",
            "escalated_severity": "Critical" if count >= 2 else "High"
        }
    
    return {
        "is_repeat": False,
        "campaign_hits": 0,
        "memory_alert": "Target is new. No historical threat data found.",
        "escalated_severity": None
    }
