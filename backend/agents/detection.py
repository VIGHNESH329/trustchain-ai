import os
import json
from google import genai
from pydantic import BaseModel, Field

# Ensure API key is loaded
api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
client = genai.Client(api_key=api_key)

class DetectionResult(BaseModel):
    threat_type: str = Field(description="e.g., Phishing, Malware, Fraud, Safe")
    risk_score: int = Field(description="Score from 0 to 100")
    severity: str = Field(description="Low, Medium, High, Critical")

def run_detection_agent(target: str, target_type: str) -> dict:
    prompt = f"""
    You are an elite Autonomous SOC Detection AI for Trust Chain AI.
    Your objective is to analyze the following {target_type} payload and determine its threat level.

    Target payload: "{target}"

    CRITICAL RULES:
    1. If the message uses urgency tactics (e.g., "URGENT", "immediately"), it is HIGH or CRITICAL.
    2. If it contains suspicious unverified URLs mimicking institutions (e.g., banks, payments), it is CRITICAL.
    3. Look for credential theft, fake OTP, and impersonation.
    4. Safe casual conversations are LOW risk.

    Provide the output strictly as JSON.
    """
    
    try:
        if api_key == "dummy_key" or not api_key:
            raise ValueError("No Gemini API key provided. Falling back to Heuristic Engine.")

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': DetectionResult,
                'temperature': 0.1,
            },
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[Detection Engine] API Error: {e}. Executing Heuristic Fallback Analysis...")
        
        # Local Heuristic Threat Scoring Engine (Fallback)
        lower_target = target.lower()
        score = 0
        threat_type = "Safe"
        severity = "Low"

        # Phishing / Scam Indicators
        if "urgent" in lower_target or "immediately" in lower_target or "act now" in lower_target:
            score += 40
            threat_type = "Social Engineering"
        if "bank" in lower_target or "account" in lower_target or "locked" in lower_target or "verify" in lower_target:
            score += 40
            threat_type = "Phishing/Banking Scam"
        if "http://" in lower_target or "https://" in lower_target:
            score += 20
        if "password" in lower_target or "otp" in lower_target or "code" in lower_target:
            score += 30

        if score >= 80:
            severity = "Critical"
        elif score >= 50:
            severity = "High"
        elif score >= 30:
            severity = "Medium"

        # Ensure obvious phishing is caught
        if threat_type == "Safe" and score > 0:
            threat_type = "Suspicious Content"

        return {"threat_type": threat_type, "risk_score": min(score, 100), "severity": severity}
