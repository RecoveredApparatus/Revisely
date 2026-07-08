import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'revisely_gemini_api_key';
const GEMINI_MODEL = 'gemini-2.5-flash';

export class GeminiService {
  static async getApiKey() {
    return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  }

  static async setApiKey(key) {
    if (!key) {
      await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
    } else {
      await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
    }
  }

  static async testConnection(keyToTest) {
    const key = keyToTest || await this.getApiKey();
    if (!key) throw new Error('No API key provided');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    
    if (!response.ok) {
      throw new Error('Invalid API Key or connection failed');
    }
    return true;
  }

  static async generateFlashcards(noteText) {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    
    const prompt = `You are an expert flashcard generator. Given the following note/text, generate concise study flashcards.
Requirements:
1. One question and one answer per flashcard.
2. Focus on definitions, concepts, formulas, and cause/effect.
3. Approximately one flashcard per important concept.
4. Output ONLY valid JSON matching this schema, with no markdown, no code blocks, and no extra text:
{
  "flashcards": [
    { "question": "...", "answer": "..." }
  ]
}

Note/Text:
${noteText}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 400 || response.status === 403) {
           throw new Error(errorData?.error?.message || 'Invalid API key or permission denied');
        }
        if (response.status === 429) {
           throw new Error('Quota exceeded. Please try again later.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!candidate) {
        throw new Error('Received empty response from AI');
      }

      let parsed;
      try {
        parsed = JSON.parse(candidate);
      } catch (e) {
        const cleaned = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }
      
      if (!parsed || !parsed.flashcards || !Array.isArray(parsed.flashcards)) {
        throw new Error('AI returned an invalid flashcard format');
      }

      return parsed.flashcards;

    } catch (err) {
      if (err.message === 'API_KEY_MISSING') throw err;
      throw new Error(err.message || 'Network request failed. Check your connection.');
    }
  }
}
