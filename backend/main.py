from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from dotenv import load_dotenv

load_dotenv()

import models, schemas
from database import engine, get_db
from agents.orchestrator import run_investigation_pipeline
from routers import webhooks, websocket

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trust Chain AI API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router)
app.include_router(websocket.router)

@app.get("/")
def read_root():
    return {"message": "Trust Chain AI Backend is running"}

@app.post("/investigate", response_model=schemas.InvestigationResponse)
def start_investigation(
    investigation: schemas.InvestigationCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # Create investigation record
    db_investigation = models.Investigation(target=investigation.target, type=investigation.type, status="pending")
    db.add(db_investigation)
    db.commit()
    db.refresh(db_investigation)

    # Log start
    log = models.AgentLog(investigation_id=db_investigation.id, agent_name="System", action="Started", details="Investigation initialized in pending state.")
    db.add(log)
    db.commit()

    # Start background task
    background_tasks.add_task(run_investigation_pipeline, db_investigation.id)

    return db_investigation

@app.get("/investigation/{id}", response_model=schemas.FullInvestigationResponse)
def get_investigation(id: int, db: Session = Depends(get_db)):
    db_inv = db.query(models.Investigation).filter(models.Investigation.id == id).first()
    if not db_inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    
    # Process json strings into objects for the schema if needed
    # (SQLAlchemy JSON columns should handle this natively, but just in case)
    return db_inv

@app.get("/report/{id}", response_model=schemas.ReportResponse)
def get_report(id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.investigation_id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.get("/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(models.Investigation).count()
    completed = db.query(models.Investigation).filter(models.Investigation.status == "completed").count()
    failed = db.query(models.Investigation).filter(models.Investigation.status == "failed").count()
    
    # Calculate high risk
    high_risk = db.query(models.ThreatResult).filter(models.ThreatResult.severity == "High").count()
    
    return {
        "total_investigations": total,
        "completed": completed,
        "failed": failed,
        "high_risk": high_risk
    }

@app.get("/agent/logs/{id}", response_model=list[schemas.AgentLogResponse])
def get_agent_logs(id: int, db: Session = Depends(get_db)):
    logs = db.query(models.AgentLog).filter(models.AgentLog.investigation_id == id).order_by(models.AgentLog.created_at.asc()).all()
    return logs

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
