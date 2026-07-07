import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, getSubjectColors } from '../theme/colors';
import { loadCards, saveCards, loadSubjects } from '../utils/storage';
import { defaultCards, defaultSubjects } from '../data/defaultCards';

const themeOptions = [
  { key: 'purple', label: 'Purple' },
  { key: 'green', label: 'Green' },
  { key: 'blue', label: 'Blue' },
  { key: 'pink', label: 'Pink' },
  { key: 'amber', label: 'Amber' },
];

export default function CardEditorScreen({ route, navigation }) {
  const cardId = route.params?.cardId || null;

  const [subjects, setSubjects] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [subjectId, setSubjectId] = useState('chem');
  const [title, setTitle] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [theme, setTheme] = useState('purple');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let loadedCards = await loadCards();
    let loadedSubjects = await loadSubjects();
    if (!loadedCards || loadedCards.length === 0) loadedCards = [...defaultCards];
    if (!loadedSubjects || loadedSubjects.length === 0) loadedSubjects = [...defaultSubjects];
    setAllCards(loadedCards);
    setSubjects(loadedSubjects);

    // If editing, prefill
    if (cardId) {
      const card = loadedCards.find(c => c.id === cardId);
      if (card) {
        setSubjectId(card.subjectId);
        setTitle(card.title);
        setFront(card.front);
        setBack(card.back);
        setTheme(card.theme);
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !front.trim() || !back.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields before saving.');
      return;
    }

    let updated;
    if (cardId) {
      // Update existing card
      updated = allCards.map(c =>
        c.id === cardId
          ? { ...c, subjectId, title: title.trim(), front: front.trim(), back: back.trim(), theme, mastered: false }
          : c
      );
    } else {
      // Create new card
      const newCard = {
        id: 'card-' + Date.now(),
        subjectId,
        title: title.trim(),
        front: front.trim(),
        back: back.trim(),
        theme,
        mastered: false,
        reviewCount: 0,
      };
      updated = [...allCards, newCard];
    }

    await saveCards(updated);
    navigation.goBack();
  };

  const isEditing = !!cardId;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Card' : 'Create Card'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Subject Picker */}
        <Text style={styles.label}>Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPicker}>
          {subjects.map(sub => {
            const subColors = getSubjectColors(sub.theme);
            const isActive = subjectId === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subjectChip,
                  isActive && { borderColor: subColors.primary, backgroundColor: subColors.primary + '20' },
                ]}
                onPress={() => {
                  setSubjectId(sub.id);
                  setTheme(sub.theme);
                }}
              >
                <View style={[styles.subjectDot, { backgroundColor: subColors.primary }]} />
                <Text style={[styles.subjectChipText, isActive && { color: subColors.light }]}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title */}
        <Text style={styles.label}>Title / Concept Name</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Quadratic Formula"
          placeholderTextColor={colors.textMuted}
        />

        {/* Front Content */}
        <Text style={styles.label}>Front Content (formulas, key points)</Text>
        <TextInput
          style={[styles.input, styles.multiline, { fontFamily: 'monospace' }]}
          value={front}
          onChangeText={setFront}
          placeholder={'e.g.\nFor ax² + bx + c = 0\nx = [-b ± √(b²-4ac)] / 2a'}
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        {/* Back Content */}
        <Text style={styles.label}>Back Explanation</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={back}
          onChangeText={setBack}
          placeholder="Detailed tip, mnemonic, or derivation..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Theme Color Picker */}
        <Text style={styles.label}>Card Accent Color</Text>
        <View style={styles.themeRow}>
          {themeOptions.map(opt => {
            const optColors = getSubjectColors(opt.key);
            const isActive = theme === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.themeDot,
                  { backgroundColor: optColors.primary },
                  isActive && styles.themeDotActive,
                ]}
                onPress={() => setTheme(opt.key)}
              >
                {isActive && <Ionicons name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{isEditing ? 'Update Card' : 'Save Card'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  subjectPicker: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 8,
    gap: 6,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subjectChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    marginHorizontal: 20,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 14,
    lineHeight: 22,
  },
  themeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  themeDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeDotActive: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtn: {
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: colors.purple.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.purple.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
