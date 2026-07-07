import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, getSubjectColors } from '../theme/colors';
import { loadCards, saveCards, loadSubjects } from '../utils/storage';
import { defaultCards, defaultSubjects } from '../data/defaultCards';

export default function DeckScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filterSubject, setFilterSubject] = useState('all');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    let loadedCards = await loadCards();
    let loadedSubjects = await loadSubjects();
    if (!loadedCards || loadedCards.length === 0) loadedCards = [...defaultCards];
    if (!loadedSubjects || loadedSubjects.length === 0) loadedSubjects = [...defaultSubjects];
    setCards(loadedCards);
    setSubjects(loadedSubjects);
  };

  const filteredCards = filterSubject === 'all'
    ? cards
    : cards.filter(c => c.subjectId === filterSubject);

  const masteredCount = filteredCards.filter(c => c.mastered).length;

  const toggleMastery = async (cardId) => {
    const updated = cards.map(c =>
      c.id === cardId ? { ...c, mastered: !c.mastered } : c
    );
    setCards(updated);
    await saveCards(updated);
  };

  const deleteCard = (cardId) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = cards.filter(c => c.id !== cardId);
          setCards(updated);
          await saveCards(updated);
        },
      },
    ]);
  };

  const subjectConfigs = [
    { id: 'chem', name: 'Chemistry', theme: 'purple' },
    { id: 'maths', name: 'Maths', theme: 'green' },
    { id: 'phys', name: 'Physics', theme: 'blue' },
    { id: 'bio', name: 'Biology', theme: 'pink' },
  ];

  const renderCard = ({ item }) => {
    const subColors = getSubjectColors(item.theme);
    const subject = subjects.find(s => s.id === item.subjectId);
    return (
      <TouchableOpacity
        style={styles.cardRow}
        onPress={() => navigation.navigate('CardEditor', { cardId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardRowLeft}>
          <View style={[styles.cardDot, { backgroundColor: subColors.primary }]} />
          <View style={styles.cardTextArea}>
            <Text style={styles.cardRowTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardRowSubject}>{subject?.name || item.subjectId}</Text>
          </View>
        </View>
        <View style={styles.cardRowRight}>
          <TouchableOpacity onPress={() => toggleMastery(item.id)} style={styles.masteryBtn}>
            <Ionicons
              name={item.mastered ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={item.mastered ? colors.success : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteCard(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Card Library</Text>
        <Text style={styles.headerSubtitle}>
          {masteredCount} of {filteredCards.length} mastered
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, filterSubject === 'all' && styles.chipActive]}
          onPress={() => setFilterSubject('all')}
        >
          <Text style={[styles.chipText, filterSubject === 'all' && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {subjectConfigs.map(sub => {
          const subColors = getSubjectColors(sub.theme);
          const isActive = filterSubject === sub.id;
          return (
            <TouchableOpacity
              key={sub.id}
              style={[
                styles.chip,
                isActive && { borderColor: subColors.primary, backgroundColor: subColors.primary + '18' },
              ]}
              onPress={() => setFilterSubject(sub.id)}
            >
              <View style={[styles.chipDot, { backgroundColor: subColors.primary }]} />
              <Text style={[styles.chipText, isActive && { color: subColors.light }]}>{sub.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Cards List */}
      <FlatList
        data={filteredCards}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No cards yet. Create one!</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CardEditor', {})}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 6,
  },
  chipActive: {
    borderColor: colors.purple.primary,
    backgroundColor: colors.purple.primary + '18',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.purple.light,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardTextArea: {
    flex: 1,
  },
  cardRowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardRowSubject: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  masteryBtn: {
    padding: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.purple.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});
