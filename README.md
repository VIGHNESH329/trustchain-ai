# Trust Chain AI - Autonomous Cybersecurity Incident Response Platform

Trust Chain AI is an enterprise-grade, full-stack cybersecurity web application that leverages multiple AI agents to autonomously intercept and investigate live telemetry threats (phishing URLs, suspicious emails, malicious Android SMS payloads).

## 🚀 Features
- **Mobile Threat Interception**: Built-in Android app hook for live SMS monitoring and cloud webhook ingestion.
- **Multi-Agent AI Architecture**: Utilizes specialized Detection, Threat Intelligence, Reasoning, and Response neural agents.
- **Autonomous Workflow**: End-to-end multi-agent processing with zero manual intervention required.
- **FastAPI Core**: Highly-performant Python backend with asynchronous agent orchestration and live WebSocket telemetry streaming.
- **Enterprise Security**: Clerk integrated identity and routing protection for SOC (Security Operations Center) analysts.
- **Next.js 15 Frontend**: Modern, cyberpunk-themed SOC Dashboard built on the App Router, Shadcn UI, and Framer Motion.
- **Persistent Cloud Storage**: Neon PostgreSQL database integration for secure, long-term historical incident archiving.

## 🛠️ Architecture
- **Agents**: Orchestrated entirely via Google's latest Gemini 2.5 (`gemini-2.5-flash`).
- **Database**: Cloud-hosted Neon PostgreSQL via SQLAlchemy.
- **Frontend Framework**: Next.js 15+ (React 19) with Turbopack.
- **Security**: @clerk/nextjs component-level and middleware protection.

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Gemini API Key
- Neon PostgreSQL Database URI
- Clerk Publishable & Secret Keys

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` folder:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_neon_postgres_uri
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
3. Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌐 Production Deployment
- **Frontend**: Successfully deployed on Vercel Edge Network.
- **Backend**: Successfully deployed on Render. Webhooks and WebSockets configured for `https://` and `wss://` secure protocols.
