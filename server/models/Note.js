const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: 'Untitled Note',
    maxlength: 200
  },
  content: {
    type: String,
    default: '',
    maxlength: 50000
  },
  summary: {
    type: String,
    default: null
  },
  actionItems: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  archived: {
    type: Boolean,
    default: false
  },
  // Omit field until shared — do not default null or unique sparse breaks (many nulls = dup key).
  shareId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiUsageCount: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'default'
  }
}, {
  timestamps: true
});

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, tags: 1 });
noteSchema.index({ title: 'text', content: 'text' });

noteSchema.methods.generateShareId = function () {
  this.shareId = uuidv4();
  this.isPublic = true;
  return this.shareId;
};

module.exports = mongoose.model('Note', noteSchema);
