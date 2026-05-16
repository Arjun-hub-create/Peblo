const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotes, createNote, updateNote, deleteNote, shareNote, getStats } = require('../controllers/notesController');
const { generateSummary, suggestTitle, voiceQuery, transcribe } = require('../controllers/aiController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.use(auth);

router.post('/transcribe', upload.single('audio'), transcribe);
router.get('/stats', getStats);
router.get('/', getNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/share', shareNote);
router.post('/:id/generate-summary', generateSummary);
router.post('/:id/suggest-title', suggestTitle);
router.post('/:id/voice-query', voiceQuery);

module.exports = router;
