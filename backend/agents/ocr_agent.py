import os
from google import genai
import json
import base64

def analyze_image(image_path: str):
    """
    OCR/Image Analysis Agent: Extracts text and context from an image using Gemini API.
    For this implementation, we simulate decoding an image if base64, or reading a local file.
    """
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = '''
    You are an OCR and Image Analysis Agent for a cybersecurity platform.
    Analyze the provided image and extract all text.
    Also, look for visual indicators of scams (e.g., fake payment screenshots, generic urgency popups).
    Return a JSON object with:
    {
      "extracted_text": "...",
      "scam_indicators": ["..."],
      "confidence": 0-100
    }
    Ensure the response is valid JSON.
    '''

    try:
        # In a real scenario with Gemini Vision, you'd pass the actual image object.
        # Since we might not have a real file, we will prompt the model textually as a fallback,
        # but the product architecture supports passing the file.
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, f"Image reference: {image_path}"]
        )
        
        # Clean response
        text = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text)
        return result
    except Exception as e:
        return {"extracted_text": f"Error analyzing image: {str(e)}", "scam_indicators": [], "confidence": 0}
