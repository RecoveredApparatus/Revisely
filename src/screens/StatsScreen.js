import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, getSubjectColors } from '../theme/colors';
import { loadCards, loadStats, saveCards, saveStats } from '../utils/storage';
import { defaultCards, defaultSubjects } from '../data/defaultCards';
import { Alert } from 'react-native';

export default function StatsScreen() {
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({ streak: 3, totalReviews: 0, lastReviewDate: null });
  const animValues = useRef(defaultSubjects.map(() => new Animated.Value(0))).current;

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    let loadedCards = await loadCards();
    const loadedStats = await loadStats();
    if (!loadedCards || loadedCards.length === 0) loadedCards = [...defaultCards];
    setCards(loadedCards);
    if (loadedStats) setStats(loadedStats);

    // Animate progress bars
    defaultSubjects.forEach((sub, i) => {
      const total = loadedCards.filter(c => c.subjectId === sub.id).length;
      const mastered = loadedCards.filter(c => c.subjectId === sub.id && c.mastered).length;
      const pct = total > 0 ? mastered / total : 0;
      animValues[i].setValue(0);
      Animated.timing(animValues[i], {
        toValue: pct,
        duration: 800,
        delay: i * 150,
        useNativeDriver: false,
      }).start();
    });
  };

  const totalCards = cards.length;
  const masteredCards = cards.filter(c => c.mastered).length;

  const metricCards = [
    { icon: 'school', label: 'Total Cards', value: totalCards, color: colors.purple.primary },
    { icon: 'checkmark-circle', label: 'Mastered', value: masteredCards, color: colors.green.primary },
    { icon: 'flame', label: 'Day Streak', value: stats.streak || 0, color: '#f97316' },
    { icon: 'flash', label: 'Reviews', value: stats.totalReviews || 0, color: colors.blue.primary },
  ];

  const mathsTotal = cards.filter(c => c.subjectId === 'maths').length;
  const mathsMastered = cards.filter(c => c.subjectId === 'maths' && c.mastered).length;
  
  const chemTotal = cards.filter(c => c.subjectId === 'chem').length;
  const chemMastered = cards.filter(c => c.subjectId === 'chem' && c.mastered).length;

  const achievements = [
    {
      emoji: '🚀',
      title: 'Fast Start',
      desc: 'Loaded your first revision deck.',
      unlocked: totalCards > 0,
    },
    {
      emoji: '🔥',
      title: 'Streak Master',
      desc: 'Maintained a 3+ day learning streak.',
      unlocked: (stats.streak || 0) >= 3,
    },
    {
      emoji: '🏆',
      title: 'Formula Master',
      desc: '100% of Maths deck mastered.',
      unlocked: mathsTotal > 0 && mathsMastered === mathsTotal,
    },
    { emoji: '📚', title: 'Bookworm', desc: 'Created 20+ flashcards.', unlocked: totalCards >= 20 },
    { emoji: '⚡', title: 'Speed Learner', desc: 'Completed 50+ reviews.', unlocked: (stats.totalReviews || 0) >= 50 },
    { emoji: '🎯', title: 'Perfect Chemistry', desc: '100% of Chemistry mastered.', unlocked: chemTotal > 0 && chemMastered === chemTotal },
    { emoji: '💪', title: 'Half Way There', desc: 'Mastered 50% of all cards.', unlocked: totalCards > 0 && masteredCards >= totalCards / 2 },
  ];

  const handleReset = () => {
    Alert.alert('Reset Progress', 'Are you sure you want to reset all your progress? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          const resetCards = cards.map(c => ({ ...c, mastered: false, reviewCount: 0 }));
          const resetStats = { streak: 0, totalReviews: 0, lastReviewDate: null };
          await saveCards(resetCards);
          await saveStats(resetStats);
          loadData();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress & Stats</Text>
        <Text style={styles.headerSubtitle}>Track your micro-learning retention</Text>
      </View>

      {/* Metric Cards */}
      <View style={styles.metricsRow}>
        {metricCards.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: m.color + '15' }]}>
              <Ionicons name={m.icon} size={20} color={m.color} />
            </View>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Retention by Subject */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Retention by Subject</Text>
        {defaultSubjects.map((sub, i) => {
          const subColors = getSubjectColors(sub.theme);
          const total = cards.filter(c => c.subjectId === sub.id).length;
          const mastered = cards.filter(c => c.subjectId === sub.id && c.mastered).length;
          const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
          const animWidth = animValues[i].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });
          return (
            <View key={sub.id} style={styles.progressItem}>
              <View style={styles.progressLabelRow}>
                <View style={styles.progressLabelLeft}>
                  <View style={[styles.progDot, { backgroundColor: subColors.primary }]} />
                  <Text style={styles.progressLabel}>{sub.name}</Text>
                </View>
                <Text style={[styles.progressPct, { color: subColors.primary }]}>{pct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: subColors.primary, width: animWidth },
                  ]}
                />
              </View>
              <Text style={styles.progressDetail}>{mastered}/{total} mastered</Text>
            </View>
          );
        })}
      </View>

      {/* Achievements */}
      <View style={[styles.section, { marginBottom: 100 }]}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((ach, i) => (
          <View
            key={i}
            style={[
              styles.achievementRow,
              !ach.unlocked && styles.achievementLocked,
            ]}
          >
            <Text style={styles.achievementEmoji}>{ach.emoji}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>
                {ach.title} {ach.unlocked ? '' : '🔒'}
              </Text>
              <Text style={styles.achievementDesc}>{ach.desc}</Text>
            </View>
            {ach.unlocked && (
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            )}
          </View>
        ))}
      </View>

      {/* Reset Progress Button */}
      <View style={styles.resetContainer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={styles.resetBtnText}>Reset All Progress</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 16,
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

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    gap: 8,
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // Progress bars
  progressItem: {
    marginBottom: 18,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetail: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  // Achievements
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 14,
  },
  achievementLocked: {
    opacity: 0.45,
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  resetContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
