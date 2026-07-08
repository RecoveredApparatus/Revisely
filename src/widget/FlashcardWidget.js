import React from 'react';
import { FlexWidget, TextWidget, ListWidget } from 'react-native-android-widget';

/**
 * FlashcardWidget — Premium Android home screen widget with "illusion" effects.
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
  
  const currentIndex = cardIndex ?? 0;
  const total = totalCards ?? 0;
  
  const counter = `${currentIndex + 1} of ${total}`;
  const sideLabel = isFlipped ? '✦ ANSWER' : '✧ QUESTION';

  // Illusion of animation: Change layout based on flip state
  const gradientOrientation = isFlipped ? 'BOTTOM_TOP' : 'TOP_BOTTOM';
  const cardBgColor = isFlipped ? '#151824' : '#0d0f17';
  
  // Progress bar logic
  const progressRatio = total > 0 ? (currentIndex + 1) / total : 0;
  
  // Dots indicator logic
  const dots = [];
  if (total > 0) {
    if (currentIndex > 0) dots.push('○'); // prev dot
    dots.push('●'); // current dot
    if (currentIndex < total - 1) dots.push('○'); // next dot
  } else {
    dots.push('●');
  }

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
          orientation: gradientOrientation,
        },
        borderWidth: 1,
        borderColor: '#2a2e42',
      }}
      clickAction="OPEN_APP"
    >
      {/* ── Top accent strip (if NOT flipped) ── */}
      {!isFlipped && (
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 4,
            backgroundColor: accent,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
      )}

      {/* ── Progress bar ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 2,
          backgroundColor: '#00000040',
        }}
      >
        <FlexWidget
          style={{
            flex: progressRatio || 0.01,
            height: 2,
            backgroundColor: accent,
          }}
        />
        <FlexWidget style={{ flex: Math.max(0, 1 - progressRatio), height: 2 }} />
      </FlexWidget>

      {/* ── Header: deck name + counter ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'wrap_content',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 18,
          paddingTop: 12,
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
          marginBottom: 8,
          backgroundColor: cardBgColor,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#2a2e42',
          paddingHorizontal: 14,
          paddingVertical: 12,
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
        
        <FlexWidget
          style={{
            width: 'match_parent',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <TextWidget
             text={dots.join('  ')}
             style={{
               fontSize: 8,
               color: '#64748b',
               textAlign: 'center',
             }}
          />
        </FlexWidget>
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
          paddingBottom: 10,
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
            text="◀"
            style={{
              fontSize: 16,
              color: '#cbd5e1',
            }}
          />
        </FlexWidget>

        {/* Flip */}
        <FlexWidget
          style={{
            flex: 2,
            height: 44,
            backgroundColor: accent,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="FLIP_CARD"
        >
          <TextWidget
            text={isFlipped ? '↩ Unflip' : '↪ Flip'}
            style={{
              fontSize: 14,
              fontWeight: '800',
              color: '#ffffff',
            }}
          />
        </FlexWidget>

        {/* Done / Master */}
        <FlexWidget
          style={{
            flex: 1,
            height: 44,
            backgroundColor: '#10b981',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          clickAction="MASTER_CARD"
        >
          <TextWidget
            text="✔"
            style={{
              fontSize: 16,
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
            text="▶"
            style={{
              fontSize: 16,
              color: '#cbd5e1',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* ── Bottom accent strip (if flipped) ── */}
      {isFlipped && (
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 4,
            backgroundColor: accent,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
      )}
      
      {/* ── Open App Hint ── */}
      <FlexWidget
        style={{
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 6,
        }}
      >
        <TextWidget
          text="Tap anywhere to open app"
          style={{
            fontSize: 9,
            color: '#475569',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
