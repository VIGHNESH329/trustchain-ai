from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class InvestigationBase(BaseModel):
    target: str
    type: str

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationResponse(InvestigationBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AgentLogResponse(BaseModel):
    id: int
    agent_name: str
    action: str
    details: str
    created_at: datetime

    class Config:
        from_attributes = True

class ThreatResultResponse(BaseModel):
    id: int
    threat_type: str
    risk_score: int
    severity: str
    intelligence_data: Optional[Dict[str, Any]]
    reasoning: str

    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    id: int
    summary: str
    remediation_actions: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class FullInvestigationResponse(InvestigationResponse):
    logs: List[AgentLogResponse] = []
    results: Optional[ThreatResultResponse] = None
    report: Optional[ReportResponse] = None

class DashboardStatsResponse(BaseModel):
    total_investigations: int
    completed: int
    failed: int
    high_risk: int

class WebhookNewMessage(BaseModel):
    source: str
    content: str
    metadata: Optional[Dict[str, Any]] = None

class WebhookUrlScan(BaseModel):
    url: str
    source: str = "browser_extension"

class WebhookEventResponse(BaseModel):
    id: int
    event_type: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    type: str
    message: str
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
