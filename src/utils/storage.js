import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';

// ── Storage Keys ────────────────────────────────────────────
const SUBJECTS_KEY = '@revisely_subjects';
const CARDS_KEY = '@revisely_cards';
const STATS_KEY = '@revisely_stats';

// ── Default stats shape ─────────────────────────────────────
const DEFAULT_STATS = {
  streak: 0,
  totalReviews: 0,
  lastReviewDate: null,
};

// ── Subjects ────────────────────────────────────────────────

/**
 * Load saved subjects from AsyncStorage.
 * @returns {Array|null} The subjects array, or null on error / if nothing stored.
 */
export async function loadSubjects() {
  try {
    const json = await AsyncStorage.getItem(SUBJECTS_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (error) {
    console.warn('[storage] Failed to load subjects:', error);
    return null;
  }
}

/**
 * Persist subjects array to AsyncStorage.
 * @param {Array} subjects
 * @returns {boolean} true on success, false on error.
 */
export async function saveSubjects(subjects) {
  try {
    await AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    return true;
  } catch (error) {
    console.warn('[storage] Failed to save subjects:', error);
    return false;
  }
}

// ── Cards ───────────────────────────────────────────────────

/**
 * Load saved cards from AsyncStorage.
 * @returns {Array|null} The cards array, or null on error / if nothing stored.
 */
export async function loadCards() {
  try {
    const json = await AsyncStorage.getItem(CARDS_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (error) {
    console.warn('[storage] Failed to load cards:', error);
    return null;
  }
}

export async function saveCards(cards) {
  try {
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    refreshWidget();
    return true;
  } catch (error) {
    console.warn('[storage] Failed to save cards:', error);
    return false;
  }
}

/**
 * Update the widget to reflect the latest cards.
 */
export async function refreshWidget() {
  try {
    const cardsRaw = await AsyncStorage.getItem(CARDS_KEY);
    const subjectsRaw = await AsyncStorage.getItem(SUBJECTS_KEY);
    const prefsRaw = await AsyncStorage.getItem('@revisely_widget_prefs');
    
    const cards = cardsRaw ? JSON.parse(cardsRaw).filter(c => !c.mastered) : [];
    const subjects = subjectsRaw ? JSON.parse(subjectsRaw) : [];
    const prefs = prefsRaw ? JSON.parse(prefsRaw) : { cardIndex: 0, isFlipped: false };
    
    const THEME_COLORS = { purple: '#8b5cf6', green: '#10b981', blue: '#3b82f6', pink: '#ec4899', amber: '#f59e0b' };
    const { FlashcardWidget } = require('../widget/FlashcardWidget');
    const React = require('react');
    
    await requestWidgetUpdate({
      widgetName: 'FlashcardWidget',
      renderWidget: () => {
        if (cards.length === 0) {
          return React.createElement(FlashcardWidget, {
            deckName: 'Revisely', cardTitle: 'No cards yet',
            cardText: 'Add some flashcards to get started!',
            accentColor: '#8b5cf6', cardIndex: 0, totalCards: 0, isFlipped: false
          });
        }
        const idx = Math.min(prefs.cardIndex || 0, cards.length - 1);
        const card = cards[idx];
        const sub = subjects.find(s => s.id === card.subjectId);
        return React.createElement(FlashcardWidget, {
          deckName: sub ? sub.name : 'Revisely',
          cardTitle: card.title || 'Untitled',
          cardText: prefs.isFlipped ? (card.back || 'No answer') : (card.front || 'No question'),
          accentColor: THEME_COLORS[(sub && sub.theme) || card.theme] || '#8b5cf6',
          cardIndex: idx, totalCards: cards.length, isFlipped: !!prefs.isFlipped
        });
      },
      widgetNotFound: () => {},
    });
  } catch (e) {
    // Widget update is best-effort
    console.warn('[storage] Failed to refresh widget:', e);
  }
}

// ── Stats ───────────────────────────────────────────────────

/**
 * Load review stats from AsyncStorage.
 * Returns the stored stats merged with defaults so new fields are always present.
 * @returns {Object} The stats object (never null — falls back to DEFAULT_STATS).
 */
export async function loadStats() {
  try {
    const json = await AsyncStorage.getItem(STATS_KEY);
    if (json != null) {
      return { ...DEFAULT_STATS, ...JSON.parse(json) };
    }
    return { ...DEFAULT_STATS };
  } catch (error) {
    console.warn('[storage] Failed to load stats:', error);
    return { ...DEFAULT_STATS };
  }
}

/**
 * Persist stats object to AsyncStorage.
 * @param {Object} stats
 * @returns {boolean} true on success, false on error.
 */
export async function saveStats(stats) {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.warn('[storage] Failed to save stats:', error);
    return false;
  }
}

// ── Utilities ───────────────────────────────────────────────

/**
 * Clear all Revisely data from AsyncStorage.
 * Useful for a "reset app" feature.
 * @returns {boolean} true on success, false on error.
 */
export async function clearAll() {
  try {
    await AsyncStorage.multiRemove([SUBJECTS_KEY, CARDS_KEY, STATS_KEY]);
    return true;
  } catch (error) {
    console.warn('[storage] Failed to clear storage:', error);
    return false;
  }
}
