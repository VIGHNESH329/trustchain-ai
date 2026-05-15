# SentinelX AI - Autonomous Cybersecurity Incident Response Platform

SentinelX AI is a full-stack hackathon-grade web application that leverages multiple AI agents to autonomously investigate cybersecurity threats (phishing URLs, suspicious emails, text messages).

## Features
- **Multi-Agent Architecture**: Uses Detection, Threat Intelligence, Reasoning, and Response agents.
- **Autonomous Workflow**: End-to-end processing with no manual intervention.
- **FastAPI Backend**: Asynchronous orchestration and background tasks.
- **Next.js 14 Frontend**: Modern, cyber-themed dashboard using shadcn/ui and Framer Motion.

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (if not already done):
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` folder:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture
- **Agents**: Orchestrated using Google's Gemini API (`gemini-2.5-flash`).
- **Database**: SQLite (via SQLAlchemy). Easily swappable for Supabase/PostgreSQL.
- **UI**: Tailwind CSS with dark mode variables, shadcn/ui components.

## Deployment
- **Frontend**: Easily deployable on Vercel by importing the `frontend` folder.
- **Backend**: Deployable on Render. Ensure to set up the appropriate environment variables (`GEMINI_API_KEY`) and use PostgreSQL instead of SQLite in production.
