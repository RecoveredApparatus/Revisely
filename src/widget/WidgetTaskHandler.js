import React from 'react';
import { Widget } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardWidget } from './FlashcardWidget';

export async function widgetTaskHandler(props) {
  let title = 'Revisely';
  let front = 'Ready to review?';
  let subjectColor = '#8b5cf6'; // default purple

  try {
    const data = await AsyncStorage.getItem('@revisely_cards');
    if (data) {
      const cards = JSON.parse(data);
      // Get a random un-mastered card
      const activeCards = cards.filter(c => !c.mastered);
      if (activeCards.length > 0) {
        const randomCard = activeCards[Math.floor(Math.random() * activeCards.length)];
        title = randomCard.title;
        front = randomCard.front;
        
        // Simple mapping based on theme string
        const colors = {
          purple: '#8b5cf6',
          green: '#10b981',
          blue: '#3b82f6',
          pink: '#ec4899',
          amber: '#f59e0b',
        };
        subjectColor = colors[randomCard.theme] || '#8b5cf6';
      } else {
        front = 'All caught up! Great job!';
      }
    }
  } catch (e) {
    console.error('Failed to load cards for widget', e);
  }

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(
        <Widget>
          <FlashcardWidget title={title} front={front} subjectColor={subjectColor} />
        </Widget>
      );
      break;
    default:
      break;
  }
}
