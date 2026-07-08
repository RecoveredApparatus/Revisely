// ── Revisely Theme Colors ───────────────────────────────────
// Dark, glassmorphic palette with vibrant subject accents.

export const colors = {
  // Backgrounds
  bg: '#0a0c14',
  bgCard: '#141829',
  bgElevated: '#1a1f38',

  // Glass effect
  glass: 'rgba(16, 20, 36, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // ── Subject themes ────────────────────────────────────────
  purple: {
    primary: '#8b5cf6',
    light: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.3)',
    gradient: ['#a78bfa', '#7c3aed'],
  },
  green: {
    primary: '#10b981',
    light: '#34d399',
    glow: 'rgba(16, 185, 129, 0.3)',
    gradient: ['#34d399', '#059669'],
  },
  blue: {
    primary: '#06b6d4',
    light: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.3)',
    gradient: ['#22d3ee', '#0891b2'],
  },
  pink: {
    primary: '#ec4899',
    light: '#f472b6',
    glow: 'rgba(236, 72, 153, 0.3)',
    gradient: ['#f472b6', '#db2777'],
  },
  amber: {
    primary: '#f59e0b',
    light: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.3)',
    gradient: ['#fbbf24', '#d97706'],
  },
  red: {
    primary: '#ef4444',
    light: '#f87171',
    glow: 'rgba(239, 68, 68, 0.3)',
    gradient: ['#f87171', '#dc2626'],
  },
  cyan: {
    primary: '#06b6d4',
    light: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.3)',
    gradient: ['#22d3ee', '#0891b2'],
  },
  lime: {
    primary: '#84cc16',
    light: '#a3e635',
    glow: 'rgba(132, 204, 22, 0.3)',
    gradient: ['#a3e635', '#65a30d'],
  },

  // Semantic
  danger: '#ef4444',
  success: '#10b981',
};

/**
 * Resolve a subject theme key to its color palette.
 * Falls back to purple if the key is unknown.
 *
 * @param {string} theme - One of 'purple', 'green', 'blue', 'pink', 'amber'.
 * @returns {{ primary: string, light: string, glow: string, gradient: string[] }}
 */
export function getSubjectColors(theme) {
  return colors[theme] || colors.purple;
}
