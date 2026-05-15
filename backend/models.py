from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(String, index=True)  # URL, email subject, or file name
    type = Column(String) # "url", "text", "file"
    status = Column(String, default="pending") # pending, running, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    logs = relationship("AgentLog", back_populates="investigation", cascade="all, delete-orphan")
    report = relationship("Report", back_populates="investigation", uselist=False, cascade="all, delete-orphan")
    results = relationship("ThreatResult", back_populates="investigation", uselist=False, cascade="all, delete-orphan")

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    agent_name = Column(String) # detection, intelligence, reasoning, response
    action = Column(String)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    investigation = relationship("Investigation", back_populates="logs")

class ThreatResult(Base):
    __tablename__ = "threat_results"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    threat_type = Column(String)
    risk_score = Column(Integer)
    severity = Column(String)
    intelligence_data = Column(JSON) # e.g. VT results, WHOIS
    reasoning = Column(Text)
    
    investigation = relationship("Investigation", back_populates="results")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    summary = Column(Text)
    remediation_actions = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    investigation = relationship("Investigation", back_populates="report")

class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True) # "new_message", "url_scan", etc.
    source = Column(String)
    payload = Column(JSON)
    status = Column(String, default="received") # received, processed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # "threat_detected", "guardian_alert", "soc_alert"
    message = Column(Text)
    severity = Column(String)
    status = Column(String, default="pending") # pending, sent, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
