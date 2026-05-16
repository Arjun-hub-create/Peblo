import { create } from 'zustand';
import api from '../services/api';

const useNotesStore = create((set, get) => ({
  notes: [],
  activeNote: null,
  isLoading: false,
  isSaving: false,
  searchQuery: '',
  selectedTag: '',
  selectedCategory: '',
  showArchived: false,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedTag: (t) => set({ selectedTag: t }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setShowArchived: (v) => set({ showArchived: v }),
  setActiveNote: (note) => set({ activeNote: note }),

  fetchNotes: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { searchQuery, selectedTag, selectedCategory, showArchived } = get();
      const query = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag && { tag: selectedTag }),
        ...(selectedCategory && { category: selectedCategory }),
        archived: showArchived,
        ...params
      };
      const res = await api.get('/notes', { params: query });
      set({ notes: res.data.notes, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  createNote: async (data = {}) => {
    const res = await api.post('/notes', data);
    const newNote = res.data.note;
    set((s) => ({ notes: [newNote, ...s.notes], activeNote: newNote }));
    return newNote;
  },

  updateNote: async (id, data) => {
    set({ isSaving: true });
    try {
      const res = await api.patch(`/notes/${id}`, data);
      const updated = res.data.note;
      set((s) => ({
        notes: s.notes.map((n) => (n._id === id ? updated : n)),
        activeNote: s.activeNote?._id === id ? updated : s.activeNote,
        isSaving: false,
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  deleteNote: async (id) => {
    // Optimistic
    set((s) => ({
      notes: s.notes.filter((n) => n._id !== id),
      activeNote: s.activeNote?._id === id ? null : s.activeNote,
    }));
    await api.delete(`/notes/${id}`);
  },

  generateSummary: async (id) => {
    const res = await api.post(`/notes/${id}/generate-summary`);
    const updated = res.data.note;
    set((s) => ({
      notes: s.notes.map((n) => (n._id === id ? updated : n)),
      activeNote: s.activeNote?._id === id ? updated : s.activeNote,
    }));
    return res.data;
  },

  suggestTitle: async (id) => {
    const res = await api.post(`/notes/${id}/suggest-title`);
    return res.data.title;
  },

  voiceQuery: async (id, query) => {
    const res = await api.post(`/notes/${id}/voice-query`, { query });
    return res.data.answer;
  },

  shareNote: async (id) => {
    const res = await api.post(`/notes/${id}/share`);
    const { shareId } = res.data;
    set((s) => ({
      notes: s.notes.map((n) => (n._id === id ? { ...n, shareId, isPublic: true } : n)),
      activeNote: s.activeNote?._id === id ? { ...s.activeNote, shareId, isPublic: true } : s.activeNote,
    }));
    return shareId;
  },

  fetchStats: async () => {
    const res = await api.get('/notes/stats');
    return res.data;
  },
}));

export default useNotesStore;
