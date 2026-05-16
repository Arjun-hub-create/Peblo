const Note = require('../models/Note');

const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
      .select('-userId').lean();
    if (!note) return res.status(404).json({ message: 'Shared note not found or no longer public.' });
    res.json({ note });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shared note.' });
  }
};

module.exports = { getSharedNote };
