import AsyncStorage from '@react-native-async-storage/async-storage';

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

/**
 * Persist cards array to AsyncStorage.
 * @param {Array} cards
 * @returns {boolean} true on success, false on error.
 */
export async function saveCards(cards) {
  try {
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    return true;
  } catch (error) {
    console.warn('[storage] Failed to save cards:', error);
    return false;
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
