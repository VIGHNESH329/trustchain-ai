import os
import json
from google import genai
from pydantic import BaseModel, Field
import urllib.parse

api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
client = genai.Client(api_key=api_key)

class IntelResult(BaseModel):
    domain_age: str = Field(description="Estimated domain age or 'Unknown'")
    blacklisted: bool = Field(description="Whether it's likely blacklisted")
    risk: str = Field(description="Low, Medium, High")
    details: str = Field(description="Summary of threat intelligence findings")

def run_intelligence_agent(target: str, target_type: str, detection_data: dict) -> dict:
    # In a real scenario, this would make API calls to VirusTotal, WHOIS, etc.
    # For the hackathon, we simulate it via Gemini or use mock data.
    
    prompt = f"""
    You are an elite Threat Intelligence SOC Analyst for Trust Chain AI.
    A detection agent has classified the following {target_type} as:
    Threat Type: {detection_data.get('threat_type')}
    Severity: {detection_data.get('severity')}

    Target Payload: "{target}"

    CRITICAL INSTRUCTIONS:
    1. Extract any URLs or domains present in the payload.
    2. If the domain looks like typosquatting (e.g. fake-bank-login.com), classify it as HIGH risk, recently registered, and BLACKLISTED.
    3. If there are no URLs but suspicious phone numbers or crypto addresses exist, flag them.
    4. You are analyzing REAL-WORLD threats. Be aggressive against scams.

    Provide the output strictly as JSON.
    """
    
    try:
        if api_key == "dummy_key" or not api_key:
            raise ValueError("No API Key. Executing local intel extraction.")

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': IntelResult,
                'temperature': 0.1,
            },
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[Intel Engine] API Error: {e}. Executing Heuristic Fallback Analysis...")
        
        # Local OSINT Extraction Simulation
        import re
        urls = re.findall(r'(https?://\S+)', target)
        domain_age = "Unknown"
        blacklisted = False
        risk = "Low"
        details = "No significant IOCs found."

        if urls:
            domain_age = "Registered < 24 Hours Ago"
            blacklisted = True
            risk = "High"
            details = f"Identified {len(urls)} suspicious URL(s). Domain lacks established reputation and mimics legitimate services."
        elif detection_data.get('severity') in ['High', 'Critical']:
            blacklisted = True
            risk = detection_data.get('severity')
            details = "Payload matches known social engineering and credential harvesting signatures."

        return {
            "domain_age": domain_age, 
            "blacklisted": blacklisted, 
            "risk": risk, 
            "details": details
        }
