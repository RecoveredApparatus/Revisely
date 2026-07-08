import { GeminiService } from './GeminiService';
import { loadCards, saveCards } from '../../utils/storage';

export class FlashcardGenerator {
  static async generateAndSave(noteText, subjectId, theme) {
    if (!noteText || noteText.trim().length < 10) {
      throw new Error('Note is too short to generate flashcards.');
    }
    
    // Will throw 'API_KEY_MISSING' if not configured
    const generatedCards = await GeminiService.generateFlashcards(noteText);
    
    if (!generatedCards || generatedCards.length === 0) {
      throw new Error('No flashcards could be generated from this text.');
    }

    const existingCards = await loadCards() || [];
    
    const newCards = generatedCards.map(c => ({
      id: 'ai-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      subjectId: subjectId || 'all',
      title: c.question.length > 30 ? c.question.substring(0, 30) + '...' : c.question,
      front: c.question,
      back: c.answer,
      theme: theme || 'purple',
      mastered: false,
      reviewCount: 0
    }));

    const updatedCards = [...newCards, ...existingCards];
    
    // saveCards internally triggers the widget refresh via refreshWidget()
    await saveCards(updatedCards);
    
    return newCards.length;
  }
}
