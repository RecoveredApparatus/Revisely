import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

/**
 * FlashcardWidget — Android home screen widget UI.
 *
 * Props:
 *   deckName     – subject / deck name shown in the header
 *   cardTitle    – the card's title, displayed prominently
 *   cardText     – front or back text depending on flip state
 *   accentColor  – hex color from the subject's theme (e.g. '#8b5cf6')
 *   cardIndex    – 0-based index of the current card
 *   totalCards   – total number of cards in the filtered deck
 *   isFlipped    – whether the card is showing its back side
 */
export function FlashcardWidget({
  deckName,
  cardTitle,
  cardText,
  accentColor,
  cardIndex,
  totalCards,
  isFlipped,
}) {
  // Fallbacks — TextWidget requires a non-empty `text` string
  const safeAccent = accentColor || '#8b5cf6';
  const safeDeckName = deckName || 'Revisely';
  const safeTitle = cardTitle || 'No card';
  const safeText = cardText || 'Tap Flip to reveal';
  const counter = `${(cardIndex ?? 0) + 1}/${totalCards ?? 0}`;
  const sideLabel = isFlipped ? 'Answer' : 'Question';

  // Pre-computed semi-transparent dark overlay for button backgrounds.
  // Using a fixed dark translucent hex instead of computing from accent to
  // avoid any string concatenation on hex values (which the library forbids).
  const buttonBg = '#33ffffff'; // ~20 % white on dark bg
  const accentDimBg = '#26ffffff'; // slightly dimmer variant

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0f1118',
        borderRadius: 16,
        flexDirection: 'column',
        padding: 14,
        backgroundGradient: {
          from: '#0f1118',
          to: '#1a1d2b',
          orientation: 'TOP_BOTTOM',
        },
      }}
      clickAction="OPEN_APP"
    >
      {/* ── Header row: deck name + card counter ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <TextWidget
          text={safeDeckName}
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: safeAccent,
          }}
          maxLines={1}
          truncate="END"
        />
        <TextWidget
          text={counter}
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#94a3b8',
          }}
        />
      </FlexWidget>

      {/* ── Accent divider line ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 2,
          backgroundColor: safeAccent,
          borderRadius: 1,
          marginBottom: 10,
        }}
      />

      {/* ── Card title ── */}
      <TextWidget
        text={safeTitle}
        style={{
          fontSize: 17,
          fontWeight: '700',
          color: '#f1f5f9',
          marginBottom: 4,
        }}
        maxLines={2}
        truncate="END"
      />

      {/* ── Side label (Question / Answer) ── */}
      <TextWidget
        text={sideLabel}
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: safeAccent,
          marginBottom: 4,
        }}
      />

      {/* ── Card text (front or back) — fills remaining space ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginBottom: 10,
        }}
      >
        <TextWidget
          text={safeText}
          style={{
            fontSize: 14,
            color: '#cbd5e1',
            textAlign: 'left',
          }}
          maxLines={6}
          truncate="END"
        />
      </FlexWidget>

      {/* ── Bottom action bar: Prev / Flip / Next ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexGap: 8,
        }}
      >
        {/* Prev button */}
        <FlexWidget
          style={{
            flex: 1,
            height: 36,
            backgroundColor: accentDimBg,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="PREV_CARD"
        >
          <TextWidget
            text="← Prev"
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#e2e8f0',
            }}
          />
        </FlexWidget>

        {/* Flip button */}
        <FlexWidget
          style={{
            flex: 1,
            height: 36,
            backgroundColor: safeAccent,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="FLIP_CARD"
        >
          <TextWidget
            text="Flip"
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: '#ffffff',
            }}
          />
        </FlexWidget>

        {/* Next button */}
        <FlexWidget
          style={{
            flex: 1,
            height: 36,
            backgroundColor: buttonBg,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="NEXT_CARD"
        >
          <TextWidget
            text="Next →"
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#e2e8f0',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
