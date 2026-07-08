import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardWidget } from './FlashcardWidget';

// ── Theme colour look-up ────────────────────────────────────────────────────
const THEME_COLORS = {
  purple: '#8b5cf6',
  green: '#10b981',
  blue: '#3b82f6',
  pink: '#ec4899',
  amber: '#f59e0b',
};

const PREFS_KEY = '@revisely_widget_prefs';
const CARDS_KEY = '@revisely_cards';
const SUBJECTS_KEY = '@revisely_subjects';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Load widget preferences, returning sensible defaults. */
async function loadPrefs() {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cardIndex: typeof parsed.cardIndex === 'number' ? parsed.cardIndex : 0,
        subjectFilter: parsed.subjectFilter || null,
        isFlipped: !!parsed.isFlipped,
      };
    }
  } catch (_) {
    /* fall through to defaults */
  }
  return { cardIndex: 0, subjectFilter: null, isFlipped: false };
}

/** Persist widget preferences. */
async function savePrefs(prefs) {
  try {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (_) {
    /* best-effort */
  }
}

/** Load cards from storage, filtered to un-mastered (+ optional subject). */
async function loadCards(subjectFilter) {
  try {
    const raw = await AsyncStorage.getItem(CARDS_KEY);
    if (raw) {
      let cards = JSON.parse(raw);
      // Keep only un-mastered cards
      cards = cards.filter((c) => !c.mastered);
      // Apply subject filter if one is set
      if (subjectFilter) {
        cards = cards.filter((c) => c.subjectId === subjectFilter);
      }
      return cards;
    }
  } catch (_) {
    /* fall through */
  }
  return [];
}

/** Load subjects map (id → subject object). */
async function loadSubjects() {
  try {
    const raw = await AsyncStorage.getItem(SUBJECTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      const map = {};
      list.forEach((s) => {
        map[s.id] = s;
      });
      return map;
    }
  } catch (_) {
    /* fall through */
  }
  return {};
}

// ── Widget builder ──────────────────────────────────────────────────────────

/**
 * Build the JSX tree for the widget given the current data + prefs.
 * Returns a <FlashcardWidget /> element ready for renderWidget().
 */
function buildWidget(cards, subjects, prefs) {
  // No cards available — show a friendly fallback
  if (!cards || cards.length === 0) {
    return (
      <FlashcardWidget
        deckName="Revisely"
        cardTitle="No cards yet"
        cardText="Add some flashcards in the app to get started!"
        accentColor="#8b5cf6"
        cardIndex={0}
        totalCards={0}
        isFlipped={false}
      />
    );
  }

  // Clamp index so it's always valid
  const idx = Math.max(0, Math.min(prefs.cardIndex, cards.length - 1));
  const card = cards[idx];

  // Resolve subject info
  const subject = card.subjectId ? subjects[card.subjectId] : null;
  const deckName = subject ? subject.name : 'Revisely';
  const accentColor =
    THEME_COLORS[(subject && subject.theme) || card.theme] || '#8b5cf6';

  // Pick front or back depending on flip state
  const cardText = prefs.isFlipped
    ? card.back || 'No answer provided'
    : card.front || 'No question provided';

  return (
    <FlashcardWidget
      deckName={deckName}
      cardTitle={card.title || 'Untitled Card'}
      cardText={cardText}
      accentColor={accentColor}
      cardIndex={idx}
      totalCards={cards.length}
      isFlipped={prefs.isFlipped}
    />
  );
}

// ── Main task handler ───────────────────────────────────────────────────────

export async function widgetTaskHandler(props) {
  const { widgetAction, clickAction } = props;

  // Load data & prefs once (needed for every path)
  const prefs = await loadPrefs();
  const cards = await loadCards(prefs.subjectFilter);
  const subjects = await loadSubjects();

  switch (widgetAction) {
    // ── Initial render / periodic update / resize ──
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      // Clamp saved index to current card count
      if (cards.length > 0 && prefs.cardIndex >= cards.length) {
        prefs.cardIndex = 0;
        await savePrefs(prefs);
      }
      props.renderWidget(buildWidget(cards, subjects, prefs));
      break;
    }

    // ── Click interactions ──
    case 'WIDGET_CLICK': {
      switch (clickAction) {
        case 'NEXT_CARD': {
          if (cards.length > 0) {
            prefs.cardIndex = (prefs.cardIndex + 1) % cards.length;
            prefs.isFlipped = false; // reset flip when navigating
          }
          await savePrefs(prefs);
          props.renderWidget(buildWidget(cards, subjects, prefs));
          break;
        }

        case 'PREV_CARD': {
          if (cards.length > 0) {
            prefs.cardIndex =
              (prefs.cardIndex - 1 + cards.length) % cards.length;
            prefs.isFlipped = false; // reset flip when navigating
          }
          await savePrefs(prefs);
          props.renderWidget(buildWidget(cards, subjects, prefs));
          break;
        }

        case 'FLIP_CARD': {
          prefs.isFlipped = !prefs.isFlipped;
          await savePrefs(prefs);
          props.renderWidget(buildWidget(cards, subjects, prefs));
          break;
        }

        case 'OPEN_APP':
        default: {
          // Re-render current state; the library handles app launch for OPEN_APP
          props.renderWidget(buildWidget(cards, subjects, prefs));
          break;
        }
      }
      break;
    }

    // ── Cleanup (WIDGET_DELETED, etc.) – nothing to render ──
    default:
      break;
  }
}
