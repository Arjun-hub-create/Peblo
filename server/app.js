require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const clientOrigin =
  process.env.CLIENT_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [clientOrigin, /\.vercel\.app$/]
      : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

let initPromise = null;

function mountRoutes() {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/notes', require('./routes/notes'));
  app.use('/api/shared', require('./routes/shared'));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date(),
      env: {
        mongo: !!process.env.MONGODB_URI,
        openai: !!process.env.OPENAI_API_KEY,
        jwt: !!process.env.JWT_SECRET,
      },
    });
  });

  app.use((req, res) => res.status(404).json({ message: `${req.method} ${req.path} not found` }));

  app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
  });
}

async function initApp() {
  if (!initPromise) {
    initPromise = connectDB().then(() => {
      mountRoutes();
      console.log('✅ Peblo API routes mounted');
    });
  }
  return initPromise;
}

app.use(async (req, res, next) => {
  try {
    await initApp();
    next();
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ message: 'Server initialization failed.' });
  }
});

module.exports = { app, initApp };
