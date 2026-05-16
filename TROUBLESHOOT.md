# 🔧 Troubleshooting Guide

## "Failed to create note" error

This means the **backend server is not running** or **MongoDB can't connect**.

### Step 1 — Check backend is running
Open a terminal and run:
```
cd peblo/server
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected: cluster0.tu5wf7t.mongodb.net
🚀  http://localhost:5000
```

If you see a MongoDB error, check Step 2.

---

### Step 2 — Check MongoDB whitelist (MOST COMMON ISSUE)

MongoDB Atlas blocks connections from unknown IPs by default.

**Fix:**
1. Go to https://cloud.mongodb.com
2. Click your cluster → **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access From Anywhere** (0.0.0.0/0)
5. Click Confirm
6. Restart your backend server

---

### Step 3 — Verify both servers are running

You need TWO terminals open at the same time:

**Terminal 1 (Backend):**
```bash
cd peblo/server
npm run dev
# Must show: ✅ MongoDB connected
```

**Terminal 2 (Frontend):**
```bash
cd peblo/client
npm run dev
# Open http://localhost:5173
```

---

### Step 4 — Test the backend directly

Visit this URL in your browser:
```
http://localhost:5000/api/health
```

If you see `{"status":"OK"}` — backend is working fine.
If the page doesn't load — backend is not running.

---

### Voice "network" error

Chrome's Speech Recognition needs internet access. If you get this:
- Make sure you're connected to the internet
- Use the **text box** in the voice modal as a fallback
- Try a different browser (Chrome works best)

---

## Windows Quick Start

Double-click `START_WINDOWS.bat` — it opens both servers automatically.
