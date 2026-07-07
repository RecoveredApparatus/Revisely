import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function FlashcardWidget({ title, front, subjectColor }) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0a0c14',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: subjectColor || '#8b5cf6',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextWidget
        text={title || 'Revisely'}
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: subjectColor || '#8b5cf6',
          marginBottom: 8,
        }}
      />
      <TextWidget
        text={front || 'Tap to learn something new!'}
        style={{
          fontSize: 14,
          color: '#f1f5f9',
          textAlign: 'center',
        }}
      />
    </FlexWidget>
  );
}
