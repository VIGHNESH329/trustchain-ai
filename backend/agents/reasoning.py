import os
from google import genai

api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
client = genai.Client(api_key=api_key)

def run_reasoning_agent(target: str, target_type: str, detection_data: dict, intel_data: dict) -> str:
    prompt = f"""
    You are an expert AI Cybersecurity Reasoning Agent.
    
    Target ({target_type}): "{target}"
    
    Detection Data:
    - Type: {detection_data.get('threat_type')}
    - Risk Score: {detection_data.get('risk_score')}
    - Severity: {detection_data.get('severity')}
    
    Intelligence Data:
    - Domain Age: {intel_data.get('domain_age')}
    - Blacklisted: {intel_data.get('blacklisted')}
    - Risk Level: {intel_data.get('risk')}
    - Details: {intel_data.get('details')}
    
    Explain WHY this threat is dangerous. Identify social engineering tactics, urgency/fear language, or technical indicators.
    Produce a clear, human-readable reasoning paragraph (3-4 sentences).
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Reasoning Agent Error: {e}")
        return "Unable to provide reasoning due to an error."
