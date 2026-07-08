import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

/**
 * FlashcardWidget — Premium Android home screen widget.
 *
 * Props:
 *   deckName     – subject / deck name
 *   cardTitle    – the card's title
 *   cardText     – front or back text depending on flip state
 *   accentColor  – hex color from the subject's theme
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
  const accent = accentColor || '#8b5cf6';
  const deck = deckName || 'Revisely';
  const title = cardTitle || 'No card';
  const text = cardText || 'Tap Flip to reveal';
  const counter = `${(cardIndex ?? 0) + 1} of ${totalCards ?? 0}`;
  const sideLabel = isFlipped ? '✦ ANSWER' : '✧ QUESTION';

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 20,
        flexDirection: 'column',
        padding: 0,
        backgroundGradient: {
          from: '#12141f',
          to: '#1e2235',
          orientation: 'TOP_BOTTOM',
        },
        borderWidth: 1,
        borderColor: '#2a2e42',
      }}
    >
      {/* ── Top accent strip ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 4,
          backgroundColor: accent,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      />

      {/* ── Header: deck name + counter ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 6,
        }}
      >
        <TextWidget
          text={deck}
          style={{
            fontSize: 14,
            fontWeight: '800',
            color: accent,
            letterSpacing: 0.5,
          }}
          maxLines={1}
          truncate="END"
        />
        <FlexWidget
          style={{
            height: 'wrap_content',
            width: 'wrap_content',
            backgroundColor: '#ffffff12',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <TextWidget
            text={counter}
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#94a3b8',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* ── Card title ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          paddingHorizontal: 18,
          paddingBottom: 4,
        }}
      >
        <TextWidget
          text={title}
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#f8fafc',
          }}
          maxLines={2}
          truncate="END"
        />
      </FlexWidget>

      {/* ── Side label (QUESTION / ANSWER) ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          paddingHorizontal: 18,
          paddingBottom: 8,
        }}
      >
        <TextWidget
          text={sideLabel}
          style={{
            fontSize: 11,
            fontWeight: '800',
            color: accent,
            letterSpacing: 1.5,
          }}
        />
      </FlexWidget>

      {/* ── Card content area ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginHorizontal: 18,
          marginBottom: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: '#0d0f17',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#2a2e42',
        }}
      >
        <TextWidget
          text={text}
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#e2e8f0',
            textAlign: 'left',
          }}
          maxLines={8}
          truncate="END"
        />
      </FlexWidget>

      {/* ── Bottom action bar ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingBottom: 14,
          flexGap: 8,
        }}
      >
        {/* Prev */}
        <FlexWidget
          style={{
            flex: 1,
            height: 44,
            backgroundColor: '#1e2235',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#2a2e42',
          }}
          clickAction="PREV_CARD"
        >
          <TextWidget
            text="◀  Prev"
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#cbd5e1',
            }}
          />
        </FlexWidget>

        {/* Flip */}
        <FlexWidget
          style={{
            flex: 1,
            height: 44,
            backgroundColor: accent,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="FLIP_CARD"
        >
          <TextWidget
            text={isFlipped ? '↩  Unflip' : '↪  Flip'}
            style={{
              fontSize: 14,
              fontWeight: '800',
              color: '#ffffff',
            }}
          />
        </FlexWidget>

        {/* Next */}
        <FlexWidget
          style={{
            flex: 1,
            height: 44,
            backgroundColor: '#1e2235',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#2a2e42',
          }}
          clickAction="NEXT_CARD"
        >
          <TextWidget
            text="Next  ▶"
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#cbd5e1',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
