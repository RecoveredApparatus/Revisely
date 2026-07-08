import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
  Dimensions,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, getSubjectColors } from '../theme/colors';
import { loadCards, saveCards, loadSubjects, loadStats, saveStats } from '../utils/storage';
import { defaultCards, defaultSubjects } from '../data/defaultCards';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Flip animation
  const flipAnim = useRef(new Animated.Value(0)).current;
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Card slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load data on screen focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      let loadedCards = await loadCards();
      let loadedSubjects = await loadSubjects();

      if (!loadedCards || loadedCards.length === 0) {
        loadedCards = [...defaultCards];
        await saveCards(loadedCards);
      }
      if (!loadedSubjects || loadedSubjects.length === 0) {
        loadedSubjects = [...defaultSubjects];
      }

      setCards(loadedCards);
      setSubjects(loadedSubjects);
      setCurrentCardIndex(0);
      resetFlip();
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  // Get the active (unmastered) cards for current subject filter
  const getActiveCards = () => {
    let filtered = cards.filter((c) => !c.mastered);
    if (currentSubject !== 'all') {
      filtered = filtered.filter((c) => c.subjectId === currentSubject);
    }
    return filtered;
  };

  const activeCards = getActiveCards();
  const currentCard = activeCards[currentCardIndex] || null;

  const resetFlip = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const animateCardTransition = (callback) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 50);
  };

  const handleSkip = () => {
    if (activeCards.length === 0) return;
    animateCardTransition(() => {
      const nextIndex = (currentCardIndex + 1) % activeCards.length;
      setCurrentCardIndex(nextIndex);
      resetFlip();
    });
  };

  const handleMarkKnown = async () => {
    if (!currentCard) return;
    Vibration.vibrate(40);
    const updatedCards = cards.map((c) =>
      c.id === currentCard.id ? { ...c, mastered: true, reviewCount: (c.reviewCount || 0) + 1 } : c
    );
    setCards(updatedCards);
    await saveCards(updatedCards);

    // Update stats
    try {
      const stats = (await loadStats()) || { totalReviews: 0, streak: 0 };
      stats.totalReviews = (stats.totalReviews || 0) + 1;
      stats.lastReviewDate = new Date().toISOString().split('T')[0];
      await saveStats(stats);
    } catch (e) {}

    animateCardTransition(() => {
      const remaining = updatedCards.filter((c) => {
        if (c.mastered) return false;
        if (currentSubject !== 'all' && c.subjectId !== currentSubject) return false;
        return true;
      });
      if (remaining.length === 0) {
        setCurrentCardIndex(0);
      } else {
        setCurrentCardIndex(currentCardIndex >= remaining.length ? 0 : currentCardIndex);
      }
      resetFlip();
    });
  };

  const handleSubjectFilter = (subjectId) => {
    setCurrentSubject(subjectId);
    setCurrentCardIndex(0);
    resetFlip();
  };

  // Get per-subject stats
  const getSubjectStats = (subjectId) => {
    const subjectCards = cards.filter((c) => c.subjectId === subjectId);
    const mastered = subjectCards.filter((c) => c.mastered).length;
    return { mastered, total: subjectCards.length };
  };

  // Subject config for chips and stats
  const subjectConfigs = [
    { id: 'chem', name: 'Chemistry', theme: 'purple' },
    { id: 'maths', name: 'Maths', theme: 'green' },
    { id: 'phys', name: 'Physics', theme: 'blue' },
    { id: 'bio', name: 'Biology', theme: 'pink' },
  ];

  const cardThemeColors = currentCard
    ? getSubjectColors(currentCard.theme)
    : getSubjectColors('purple');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Revisely</Text>
          <Text style={styles.tagline}>Micro-Revision Studio</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={20} color={colors.purple.primary} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subject Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              currentSubject === 'all' && {
                borderColor: colors.purple.primary,
                backgroundColor: colors.purple.primary + '18',
              },
            ]}
            onPress={() => handleSubjectFilter('all')}
          >
            <View style={[styles.chipDot, { backgroundColor: colors.textSecondary }]} />
            <Text
              style={[
                styles.chipText,
                currentSubject === 'all' && { color: colors.purple.light },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {subjectConfigs.map((sub) => {
            const isActive = currentSubject === sub.id;
            const subColors = getSubjectColors(sub.theme);
            return (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.chip,
                  isActive && {
                    borderColor: subColors.primary,
                    backgroundColor: subColors.primary + '18',
                    shadowColor: subColors.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
                onPress={() => handleSubjectFilter(sub.id)}
              >
                <View style={[styles.chipDot, { backgroundColor: subColors.primary }]} />
                <Text
                  style={[
                    styles.chipText,
                    isActive && { color: subColors.light },
                  ]}
                >
                  {sub.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Flashcard Area */}
        {currentCard ? (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={handleFlip}
              style={styles.cardWrapper}
            >
              {/* Front Face */}
              <Animated.View
                style={[
                  styles.flashcard,
                  { borderLeftColor: cardThemeColors.primary, borderLeftWidth: 4 },
                  { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }] },
                  { backfaceVisibility: 'hidden' },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: cardThemeColors.primary + '25' }]}>
                    <View style={[styles.badgeDot, { backgroundColor: cardThemeColors.primary }]} />
                    <Text style={[styles.badgeText, { color: cardThemeColors.primary }]}>
                      {(subjects.find(s => s.id === currentCard.subjectId)?.name || currentCard.subjectId).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.cardIndex}>
                    {currentCardIndex + 1}/{activeCards.length}
                  </Text>
                </View>

                <Text style={styles.cardTitle}>{currentCard.title}</Text>
                <View style={styles.cardContentBox}>
                  <Text style={styles.cardFrontContent}>{currentCard.front}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.flipHint}>
                    <Ionicons name="sync-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.flipHintText}>Tap to flip</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.quickCheck, { backgroundColor: cardThemeColors.primary + '20' }]}
                    onPress={(e) => {
                      handleMarkKnown();
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color={cardThemeColors.primary} />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Back Face */}
              <Animated.View
                style={[
                  styles.flashcard,
                  styles.flashcardBack,
                  { borderLeftColor: cardThemeColors.primary, borderLeftWidth: 4 },
                  { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }] },
                  { backfaceVisibility: 'hidden' },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: cardThemeColors.primary + '25' }]}>
                    <Ionicons name="bulb-outline" size={14} color={cardThemeColors.primary} />
                    <Text style={[styles.badgeText, { color: cardThemeColors.primary }]}>
                      EXPLANATION
                    </Text>
                  </View>
                  <Text style={styles.cardIndex}>
                    {currentCardIndex + 1}/{activeCards.length}
                  </Text>
                </View>

                <Text style={styles.cardTitle}>{currentCard.title}</Text>
                <ScrollView style={styles.backContentScroll} nestedScrollEnabled>
                  <Text style={styles.cardBackContent}>{currentCard.back}</Text>
                </ScrollView>

                <View style={styles.cardFooter}>
                  <View style={styles.flipHint}>
                    <Ionicons name="sync-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.flipHintText}>Tap to flip back</Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={{ marginBottom: 12, opacity: 0.8 }}>
              <Text style={{ fontSize: 72 }}>🧠</Text>
            </View>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptySubtitle}>
              {currentSubject === 'all'
                ? "You've mastered every card in your deck."
                : `You've mastered everything in this subject.`}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {currentCard && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.markKnownButton, { backgroundColor: cardThemeColors.primary }]}
              onPress={handleMarkKnown}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.markKnownText}>Mark Known</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Subject Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {subjectConfigs.map((sub) => {
              const subColors = getSubjectColors(sub.theme);
              const stats = getSubjectStats(sub.id);
              const pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
              return (
                <View key={sub.id} style={styles.miniStatBox}>
                  <View style={[styles.miniStatBar, { backgroundColor: subColors.primary + '15' }]}>
                    <View
                      style={[
                        styles.miniStatFill,
                        {
                          backgroundColor: subColors.primary,
                          width: `${pct}%`,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.miniStatInfo}>
                    <View style={[styles.miniDot, { backgroundColor: subColors.primary }]} />
                    <Text style={styles.miniStatLabel}>{sub.name}</Text>
                  </View>
                  <Text style={[styles.miniStatValue, { color: subColors.primary }]}>
                    {stats.mastered}/{stats.total}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  // Subject Chips
  chipsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 10,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Flashcard
  cardWrapper: {
    marginHorizontal: 20,
    marginTop: 4,
    minHeight: 320,
  },
  flashcard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    minHeight: 320,
    justifyContent: 'space-between',
  },
  flashcardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardIndex: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    lineHeight: 26,
  },
  cardContentBox: {
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    flex: 1,
    marginBottom: 16,
  },
  cardFrontContent: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  backContentScroll: {
    flex: 1,
    marginBottom: 16,
  },
  cardBackContent: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flipHintText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  quickCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 4,
    minHeight: 280,
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  markKnownButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  markKnownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  miniStatBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  miniStatBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  miniStatFill: {
    height: '100%',
    borderRadius: 2,
  },
  miniStatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniStatLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
