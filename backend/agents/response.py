import os
import json
from google import genai
from pydantic import BaseModel, Field
from typing import List

api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
client = genai.Client(api_key=api_key)

class ResponseResult(BaseModel):
    summary: str = Field(description="Executive summary of the incident")
    remediation_actions: List[str] = Field(description="List of recommended security actions")

def run_response_agent(target: str, target_type: str, detection_data: dict, intel_data: dict, reasoning: str) -> dict:
    prompt = f"""
    You are an expert AI Cybersecurity Incident Response Agent.
    
    Target ({target_type}): "{target}"
    Threat Type: {detection_data.get('threat_type')} (Severity: {detection_data.get('severity')})
    Intelligence: {intel_data.get('details')}
    Reasoning: {reasoning}
    
    Generate an incident response plan. 
    Provide an executive summary and a list of specific, actionable remediation steps (e.g., "Reset credentials", "Block sender domain", "Do not click the URL").
    
    Output as JSON.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': ResponseResult,
                'temperature': 0.2,
            },
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Response Agent Error: {e}")
        return {"summary": "Error generating response plan.", "remediation_actions": ["Contact security team"]}
