Peblo Neural Workspace
A full-stack AI-powered notes application built for the Peblo Full Stack Developer Challenge. The idea was to build something that feels like an actual product — not just a CRUD app with an AI button slapped on it.

What I Built
A collaborative notes workspace where you can write notes, get AI-generated summaries and action items, search and filter everything, share notes publicly, and see your productivity stats on a dashboard. The whole thing has a dark cosmic UI with animations that make it feel alive.

Tech Stack
Frontend — React + Vite, Tailwind CSS, Framer Motion for animations, Zustand for state, React Router for navigation
Backend — Node.js with Express, JWT authentication, bcrypt for passwords
Database — MongoDB with Mongoose
AI — OpenAI GPT-4.1-mini for summaries, action items, title suggestions, and conversational queries
Voice — Browser-native Web Speech API for voice input and speech synthesis

Features
Signup and login with JWT auth and persistent sessions
Create, edit, delete, and archive notes with auto-save
Tags and categories to organize everything
AI-generated summaries, action items, and title suggestions from note content
Ask the AI questions about any note via text or voice
Voice-to-text note input using the microphone
AI reads summaries aloud using speech synthesis
Instant search and tag-based filtering
Public share links — anyone can view without logging in
Analytics dashboard with weekly activity chart, top tags, and recent notes
Fully responsive, works on desktop and mobile

Getting Started
Clone the repo and install dependencies for both frontend and backend.
bash# Backend
cd server
npm install

# Frontend
cd client
npm install

Create a .env file inside the server/ folder using the .env.example as reference:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173

Create a .env file inside client/:
VITE_API_URL=/api

Then run both servers in separate terminals:
bash# Terminal 1 - Backend
cd server
npm run dev


# Terminal 2 - Frontend
cd client
npm run dev
Open http://localhost:5173 and you're good to go.
Project Structure
peblo-neural-workspace/
├── server/
│   ├── controllers/      # Route handlers for auth, notes, AI, sharing
│   ├── models/           # Mongoose schemas for User and Note
│   ├── routes/           # Express route definitions
│   ├── middleware/        # JWT authentication middleware
│   ├── services/         # OpenAI integration logic
│   └── config/           # Database connection
│
└── client/
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # Landing, Login, Signup, Workspace, Dashboard, SharedNote
        ├── store/        # Zustand state for auth and notes
        └── services/     # Axios API client
 

API Overview
MethodEndpointDescriptionPOST/api/auth/signupRegister a new userPOST/api/auth/loginLogin and get JWT tokenGET/api/notesFetch all notes with optional filtersPOST/api/notesCreate a new notePATCH/api/notes/:idUpdate a noteDELETE/api/notes/:idDelete a notePOST/api/notes/:id/generate-summaryRun AI analysis on a notePOST/api/notes/:id/suggest-titleGet an AI-suggested titlePOST/api/notes/:id/voice-queryAsk the AI a question about a notePOST/api/notes/:id/shareGenerate a public share linkGET/api/shared/:shareIdView a publicly shared noteGET/api/notes/statsGet dashboard statistics

How AI Works
All AI calls go through the backend. The frontend never touches the OpenAI API directly. When you click "AI Assist" on a note, the backend sends the note content to GPT-4.1-mini and gets back a summary, a list of action items, and suggested tags — all in one call. Title suggestion is a separate call. Voice queries let you ask anything about the note and get a spoken response back.

Notes on Voice
Voice input and speech synthesis use the browser's built-in Web Speech API so there's no third-party dependency. Works best in Chrome. If you're on a network that blocks the speech API, there's a manual text input fallback in the voice modal.

Environment Variables
VariableDescriptionMONGODB_URIYour MongoDB Atlas connection stringJWT_SECRETAny random secret string for signing tokensOPENAI_API_KEYYour OpenAI API keyPORTBackend port, defaults to 5000CLIENT_URLFrontend URL for CORS, defaults to http://localhost:5173

What I'd Add With More Time
Real-time collaboration using WebSockets
Markdown rendering in the editor
Drag and drop note reordering
Export notes as PDF
Mobile app version


Built by Arjun M for the Peblo Full Stack Developer Challenge.
