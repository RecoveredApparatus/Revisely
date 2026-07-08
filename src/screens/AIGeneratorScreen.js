import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, getSubjectColors } from '../theme/colors';
import { FlashcardGenerator } from '../services/ai/FlashcardGenerator';
import { loadSubjects } from '../utils/storage';
import { GeminiService } from '../services/ai/GeminiService';

export default function AIGeneratorScreen({ navigation }) {
  const [noteText, setNoteText] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('all');
  const [theme, setTheme] = useState('purple');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const loaded = await loadSubjects() || [];
    setSubjects(loaded);
    if (loaded.length > 0) {
      setSubjectId(loaded[0].id);
      setTheme(loaded[0].theme);
    }
  };

  const handleGenerate = async () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please paste some text to generate flashcards.');
      return;
    }

    const key = await GeminiService.getApiKey();
    if (!key) {
      Alert.alert(
        'API Key Required', 
        'To use this optional feature, please configure your Gemini API key in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => navigation.navigate('Settings') }
        ]
      );
      return;
    }

    setIsGenerating(true);
    try {
      const count = await FlashcardGenerator.generateAndSave(noteText, subjectId, theme);
      Alert.alert('Success!', `Generated and saved ${count} flashcards.`, [
        { text: 'Awesome', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      if (e.message === 'API_KEY_MISSING') {
        navigation.navigate('Settings');
      } else {
        Alert.alert('Generation Failed', e.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={isGenerating}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Generator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Paste your study notes, lecture transcript, or textbook summary below. The AI will extract the key concepts and generate flashcards for you.
        </Text>

        <Text style={styles.label}>Subject for New Cards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPicker}>
          {subjects.map(sub => {
            const subColors = getSubjectColors(sub.theme);
            const isActive = subjectId === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subjectChip,
                  isActive && { borderColor: subColors.primary, backgroundColor: subColors.primary + '20' }
                ]}
                onPress={() => {
                  setSubjectId(sub.id);
                  setTheme(sub.theme);
                }}
                disabled={isGenerating}
              >
                <Text style={[styles.subjectChipText, isActive && { color: subColors.light }]}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Note Content</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Paste your notes here..."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          value={noteText}
          onChangeText={setNoteText}
          editable={!isGenerating}
        />

        <TouchableOpacity 
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]} 
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.generateBtnText}>Generate Flashcards</Text>
            </>
          )}
        </TouchableOpacity>
        
        {isGenerating && (
          <Text style={styles.generatingHint}>This might take a few seconds...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subjectPicker: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 10,
  },
  subjectChipText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  textInput: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 16,
    padding: 16,
    color: colors.textPrimary,
    fontSize: 15,
    height: 250,
    marginBottom: 24,
    lineHeight: 22,
  },
  generateBtn: {
    flexDirection: 'row',
    backgroundColor: colors.purple.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  generatingHint: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
  }
});
