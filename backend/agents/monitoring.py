import json

def parse_incoming_event(event_type: str, source: str, payload: dict):
    """
    Monitoring Agent: Continuously monitors streams and webhooks.
    Determines if the payload requires full investigation.
    """
    # Simple rule-based filtering before engaging LLM
    target_data = ""
    target_type = "text"
    
    if event_type == "new_message":
        target_data = payload.get("content", "")
        # Very basic check, if it contains http it might be a url
        if "http" in target_data:
            target_type = "url"
    elif event_type == "url_scan":
        target_data = payload.get("url", "")
        target_type = "url"
        
    return {
        "requires_investigation": bool(target_data),
        "target": target_data,
        "type": target_type,
        "priority": "High" if "urgent" in target_data.lower() else "Normal"
    }
