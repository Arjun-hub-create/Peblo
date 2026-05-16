# 🧠 Peblo Neural Workspace

> **"Every Curious Mind is Born to Thrive"**

An immersive AI-powered thought universe where notes become living intelligent memory fragments floating through a cinematic digital cosmos.

---

## ✨ Features

- **Cinematic Landing Page** — Animated starfield, floating AI orb, glassmorphism, ambient music toggle
- **AI Note Analysis** — GPT-4.1-mini powered summaries, action item extraction, tag suggestions
- **Voice Input** — Speak your notes using the Web Speech API with live waveform animation
- **AI Voice Responses** — Listen to AI summaries via SpeechSynthesis, with animated orb
- **Conversational AI** — Ask questions about any note via text or voice
- **Smart Tag & Title Suggestions** — AI-generated metadata
- **Public Sharing** — Beautiful shareable note pages, no login required
- **Analytics Dashboard** — Weekly activity charts, top tags, recent notes
- **Full Auth System** — JWT, bcrypt, persistent sessions
- **Cosmic UI** — Glassmorphism, neural particles, floating blobs, gradient meshes

---

## 🛠 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion     |
| State     | Zustand                                         |
| Routing   | React Router DOM v6                             |
| Icons     | Lucide React                                    |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB + Mongoose                              |
| Auth      | JWT + bcryptjs                                  |
| AI        | OpenAI GPT-4.1-mini                             |
| Voice     | Web Speech API (SpeechRecognition + Synthesis)  |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd peblo-neural-workspace

# Install backend deps
cd server
npm install

# Install frontend deps
cd ../client
npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy and fill in your values:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_strong_random_secret_here
OPENAI_API_KEY=sk-...your-key...
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy and fill in:
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📡 API Documentation

### Auth Endpoints

| Method | Endpoint         | Description         | Auth |
|--------|-----------------|---------------------|------|
| POST   | `/api/auth/signup` | Register new user  | No   |
| POST   | `/api/auth/login`  | Login user         | No   |
| GET    | `/api/auth/me`     | Get current user   | Yes  |

### Notes Endpoints

| Method | Endpoint                         | Description                    | Auth |
|--------|----------------------------------|--------------------------------|------|
| GET    | `/api/notes`                     | Get all notes (supports query) | Yes  |
| POST   | `/api/notes`                     | Create note                    | Yes  |
| PATCH  | `/api/notes/:id`                 | Update note                    | Yes  |
| DELETE | `/api/notes/:id`                 | Delete note                    | Yes  |
| POST   | `/api/notes/:id/share`           | Generate share link            | Yes  |
| POST   | `/api/notes/:id/generate-summary`| AI analysis                    | Yes  |
| POST   | `/api/notes/:id/suggest-title`   | AI title suggestion            | Yes  |
| POST   | `/api/notes/:id/voice-query`     | AI voice/text query            | Yes  |
| GET    | `/api/notes/stats`               | Dashboard statistics           | Yes  |

### Shared Endpoints

| Method | Endpoint              | Description         | Auth |
|--------|-----------------------|---------------------|------|
| GET    | `/api/shared/:shareId`| View public note    | No   |

---

## 🏗 Architecture

```
peblo-neural-workspace/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── ai/            # AI Panel component
│       │   ├── layout/        # Sidebar
│       │   ├── notes/         # NoteCard, NoteEditor
│       │   ├── ui/            # AIOrb, CosmicBackground, LoadingScreen
│       │   └── voice/         # VoiceInput modal
│       ├── pages/             # Landing, Login, Signup, Workspace, Dashboard, SharedNote
│       ├── services/          # Axios API client
│       ├── store/             # Zustand stores (auth, notes)
│       └── styles/            # Global CSS
│
└── server/                    # Node.js + Express backend
    ├── config/                # MongoDB connection
    ├── controllers/           # Auth, Notes, AI, Shared
    ├── middleware/            # JWT auth middleware
    ├── models/                # User, Note (Mongoose)
    ├── routes/                # Express routers
    └── services/              # OpenAI AI service
```

---

## 🎨 Design System

- **Background:** `#0B1020` → `#111827`
- **Accent Violet:** `#7C3AED`
- **Accent Cyan:** `#22D3EE`
- **Accent Pink:** `#F472B6`
- **Style:** Glassmorphism, glowing gradients, neural particles, cosmic atmosphere

---

## 📸 Key Screens

1. **Landing** — Cinematic hero with floating AI orb, ambient music toggle, feature grid
2. **Auth** — Glassmorphism cards with animated backgrounds
3. **Workspace** — Three-panel layout: sidebar + notes list + editor + AI panel
4. **Dashboard** — Animated bar charts, tag analytics, recent notes
5. **Shared Page** — Clean public note view with AI summary display

---

## 🔒 Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens expire in 7 days
- All AI calls go through backend — OpenAI key never exposed to frontend
- Protected routes via middleware
- Environment variables for all secrets

---

## 🗣 Voice Features

- **Voice Input:** Click the mic FAB in the workspace → speak → transcript added to note
- **Listen Summary:** After AI analysis, click the speaker icon in the AI panel
- **Voice Query:** Use the mic in the AI panel "Ask AI" section to speak your question

> Voice features require Chrome or Edge for best compatibility (Web Speech API)

---

*Built with ❤️ for the Peblo Full Stack Developer Challenge*
