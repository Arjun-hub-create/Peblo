const Note = require('../models/Note');
const aiService = require('../services/aiService');

const generateSummary = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!note.content || note.content.trim().length < 20) {
      return res.status(400).json({ message: 'Note content too short to summarize.' });
    }

    const summary = await aiService.generateSummary(note.content, note.title);
    const actionItems = await aiService.extractActionItems(note.content);
    const suggestedTags = await aiService.suggestTags(note.content, note.title);

    note.summary = summary;
    note.actionItems = actionItems;
    note.aiUsageCount += 1;
    if (suggestedTags.length > 0) {
      const combined = [...new Set([...note.tags, ...suggestedTags])];
      note.tags = combined.slice(0, 10);
    }
    await note.save();

    res.json({ summary, actionItems, suggestedTags, note, message: 'AI analysis complete.' });
  } catch (error) {
    console.error('AI summary error:', error.message || error);
    res.status(500).json({ message: error.message || 'AI generation failed.' });
  }
};

const suggestTitle = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({ message: 'Not enough content to suggest a title.' });
    }

    const title = await aiService.suggestTitle(note.content);
    res.json({ title });
  } catch (error) {
    console.error('AI suggest-title error:', error.message || error);
    res.status(500).json({ message: error.message || 'Failed to suggest title.' });
  }
};

const voiceQuery = async (req, res) => {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) return res.status(400).json({ message: 'Query is required.' });

    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    const answer = await aiService.voiceQuery(query, note.content, note.title);
    note.aiUsageCount += 1;
    await note.save();

    res.json({ answer, message: 'AI response ready.' });
  } catch (error) {
    console.error('AI voice-query error:', error.message || error);
    res.status(500).json({ message: error.message || 'AI query failed.' });
  }
};

const transcribe = async (req, res) => {
  try {
    let buffer;
    let mimetype = 'audio/webm';

    if (req.file?.buffer?.length) {
      buffer = req.file.buffer;
      mimetype = req.file.mimetype || mimetype;
    } else if (req.body?.audioBase64) {
      buffer = Buffer.from(req.body.audioBase64, 'base64');
      mimetype = req.body.mimeType || req.body.format || mimetype;
    } else {
      return res.status(400).json({ message: 'No audio received. Record again and speak for at least 2 seconds.' });
    }

    if (!buffer.length) {
      return res.status(400).json({ message: 'Empty recording. Speak louder and try again.' });
    }

    const text = await aiService.transcribeAudio(buffer, mimetype);
    res.json({ text });
  } catch (error) {
    console.error('Transcribe error:', error.message || error);
    res.status(500).json({ message: error.message || 'Voice transcription failed.' });
  }
};

module.exports = { generateSummary, suggestTitle, voiceQuery, transcribe };
