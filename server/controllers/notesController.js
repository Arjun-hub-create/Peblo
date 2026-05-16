const Note = require('../models/Note');

const getNotes = async (req, res) => {
  try {
    const { search, tag, category, archived, sort = 'newest' } = req.query;
    const query = { userId: req.user._id };

    // archived filter
    if (archived === 'true') query.archived = true;
    else query.archived = false;

    if (tag) query.tags = tag.toLowerCase();
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { updatedAt: -1 };
    const notes = await Note.find(query).sort(sortOption).lean();
    return res.json({ notes });
  } catch (error) {
    console.error('GET /notes error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch notes: ' + error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, tags, category, color } = req.body;
    console.log('Creating note for user:', req.user._id);
    const note = await Note.create({
      title: title || 'Untitled Note',
      content: content || '',
      tags: Array.isArray(tags) ? tags : [],
      category: category || 'General',
      color: color || 'default',
      userId: req.user._id,
    });
    console.log('Note created:', note._id);
    return res.status(201).json({ note, message: 'Note created.' });
  } catch (error) {
    console.error('POST /notes error:', error.message, error.stack);
    return res.status(500).json({ message: 'Failed to create note: ' + error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const allowed = ['title', 'content', 'tags', 'category', 'color', 'archived', 'summary', 'actionItems', 'shareId', 'isPublic'];
    const patch = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) patch[k] = req.body[k]; });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...patch, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    return res.json({ note, message: 'Note updated.' });
  } catch (error) {
    console.error('PATCH /notes/:id error:', error.message);
    return res.status(500).json({ message: 'Failed to update note: ' + error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    return res.json({ message: 'Note deleted.' });
  } catch (error) {
    console.error('DELETE /notes/:id error:', error.message);
    return res.status(500).json({ message: 'Failed to delete note: ' + error.message });
  }
};

const shareNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!note.shareId) note.generateShareId();
    await note.save();
    return res.json({ shareId: note.shareId, message: 'Share link generated.' });
  } catch (error) {
    console.error('POST /notes/:id/share error:', error.message);
    return res.status(500).json({ message: 'Failed to share note: ' + error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, archived, aiUsed, tags] = await Promise.all([
      Note.countDocuments({ userId, archived: false }),
      Note.countDocuments({ userId, archived: true }),
      Note.countDocuments({ userId, aiUsageCount: { $gt: 0 } }),
      Note.aggregate([
        { $match: { userId } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const recentNotes = await Note.find({ userId, archived: false })
      .sort({ updatedAt: -1 }).limit(5).select('title updatedAt').lean();

    const weeklyActivity = await Note.aggregate([
      { $match: { userId, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
    ]);

    return res.json({ total, archived, aiUsed, topTags: tags, recentNotes, weeklyActivity });
  } catch (error) {
    console.error('GET /notes/stats error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch stats: ' + error.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote, shareNote, getStats };
