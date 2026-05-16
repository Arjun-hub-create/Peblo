const OpenAI = require('openai');
const { APIError, toFile } = require('openai');

function getProviderConfig() {
  const key = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim();
  if (!key) throw new Error('OPENAI_API_KEY is not set in server/.env');

  const isOpenRouter =
    key.startsWith('sk-or-') ||
    (process.env.OPENAI_BASE_URL || '').includes('openrouter.ai');

  const baseURL =
    process.env.OPENAI_BASE_URL ||
    (isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined);

  const defaultModel = isOpenRouter
    ? 'openai/gpt-4o-mini'
    : 'gpt-4o-mini';

  const model = (process.env.OPENAI_MODEL || defaultModel).trim();

  const client = new OpenAI({
    apiKey: key,
    ...(baseURL && { baseURL }),
    ...(isOpenRouter && {
      defaultHeaders: {
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'Peblo Neural Workspace',
      },
    }),
  });

  return { client, model, isOpenRouter };
}

function toUserError(error) {
  if (error instanceof APIError) {
    const body = error.error;
    if (body && typeof body === 'object' && body.message) return body.message;
    if (error.message) return error.message;
  }
  return error.message || 'AI request failed';
}

async function chat(messages, maxTokens) {
  const { client, model } = getProviderConfig();
  try {
    const response = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages,
    });
    const text = response.choices?.[0]?.message?.content;
    if (!text || !String(text).trim()) {
      throw new Error('AI returned an empty response. Try again.');
    }
    return String(text).trim();
  } catch (err) {
    if (err instanceof APIError) {
      throw new Error(toUserError(err));
    }
    throw err;
  }
}

const generateSummary = async (content, title) =>
  chat(
    [
      { role: 'system', content: 'You are Peblo, an intelligent AI assistant. Generate concise, insightful summaries that capture the essence of notes. Be clear, intelligent, and brief.' },
      { role: 'user', content: `Summarize this note titled "${title}":\n\n${content}` },
    ],
    300,
  );

const extractActionItems = async (content) => {
  const raw = await chat(
    [
      { role: 'system', content: 'Extract clear, actionable task items from notes. Return a JSON array of strings. Each item should start with a verb. Return ONLY the JSON array, no other text.' },
      { role: 'user', content: `Extract action items from:\n\n${content}` },
    ],
    400,
  );
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [raw];
  }
};

const suggestTitle = async (content) => {
  const raw = await chat(
    [
      { role: 'system', content: 'Generate a concise, compelling title for a note. Return ONLY the title text, nothing else. Maximum 8 words.' },
      { role: 'user', content: `Generate a title for:\n\n${content}` },
    ],
    60,
  );
  return raw.replace(/^["']|["']$/g, '');
};

const suggestTags = async (content, title) => {
  const raw = await chat(
    [
      { role: 'system', content: 'Suggest 3-6 relevant lowercase tags for a note. Return ONLY a JSON array of strings.' },
      { role: 'user', content: `Suggest tags for note titled "${title}":\n\n${content}` },
    ],
    100,
  );
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

const voiceQuery = async (query, noteContent, noteTitle) => {
  const body = (noteContent && String(noteContent).trim())
    ? `Note titled "${noteTitle}":\n\n${noteContent}`
    : `The user has a note titled "${noteTitle}" but the note body is still empty. Answer their question using general knowledge. You may briefly suggest what they could add to the note if it fits.`;

  return chat(
    [
      {
        role: 'system',
        content: 'You are Peblo, a helpful AI in a note-taking app. Answer clearly and concisely. When the note has content, ground your answer in that note when relevant; otherwise help from general knowledge.',
      },
      { role: 'user', content: `${body}\n\nUser question: ${query}` },
    ],
    500,
  );
};

function mimeToFormat(mimetype = '') {
  const m = mimetype.toLowerCase();
  if (m.includes('webm')) return 'webm';
  if (m.includes('mp4') || m.includes('m4a')) return 'm4a';
  if (m.includes('ogg')) return 'ogg';
  if (m.includes('wav')) return 'wav';
  if (m.includes('mp3') || m.includes('mpeg')) return 'mp3';
  if (m.includes('flac')) return 'flac';
  return 'webm';
}

async function transcribeWithOpenRouter(buffer, format) {
  const key = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim();
  const res = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'https://peblo-gilt.vercel.app',
      'X-Title': 'Peblo Neural Workspace',
    },
    body: JSON.stringify({
      model: process.env.WHISPER_MODEL || 'openai/whisper-large-v3',
      input_audio: {
        data: buffer.toString('base64'),
        format,
      },
      language: 'en',
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `Transcription failed (${res.status})`;
    throw new Error(msg);
  }
  const text = (data.text || data.transcription || '').trim();
  if (!text) throw new Error('No speech detected in the recording.');
  return text;
}

const transcribeAudio = async (buffer, mimetype = 'audio/webm') => {
  if (!buffer?.length) throw new Error('Empty audio recording.');
  const format = mimeToFormat(mimetype);
  const { client, isOpenRouter } = getProviderConfig();

  if (isOpenRouter) {
    return transcribeWithOpenRouter(buffer, format);
  }

  const ext = format === 'm4a' ? 'm4a' : format;
  const file = await toFile(buffer, `recording.${ext}`, { type: mimetype || `audio/${ext}` });

  try {
    const result = await client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });
    const text = result.text?.trim();
    if (!text) throw new Error('No speech detected in the recording.');
    return text;
  } catch (err) {
    if (err instanceof APIError) throw new Error(toUserError(err));
    throw err;
  }
};

module.exports = {
  generateSummary,
  extractActionItems,
  suggestTitle,
  suggestTags,
  voiceQuery,
  transcribeAudio,
};
