// Default subjects for Revisely
export const defaultSubjects = [
  { id: 'chem', name: 'Inorganic Chemistry', theme: 'purple', icon: 'flask' },
  { id: 'maths', name: 'Maths Formulas', theme: 'green', icon: 'calculator' },
  { id: 'phys', name: 'Physics Concepts', theme: 'blue', icon: 'atom' },
  { id: 'bio', name: 'Biology & More', theme: 'pink', icon: 'leaf' },
];

// Default flashcards — real, educationally valuable content
export const defaultCards = [
  // ── Chemistry ─────────────────────────────────────────────
  {
    id: 'chem-1',
    subjectId: 'chem',
    title: 'Oxidation states of common elements',
    front:
      'H = +1 (with non-metals)\n  = −1 (in metal hydrides)\nO = −2 (usually)\nF = −1 (always)\nNa = +1, K = +1, Ag = +1',
    back:
      'Fluorine is always −1 since it is the most electronegative element. Hydrogen takes −1 in hydrides because metals are less electronegative than H. Oxygen is −1 in peroxides (e.g. H₂O₂) and +2 in OF₂.',
    theme: 'purple',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'chem-2',
    subjectId: 'chem',
    title: 'Flame test colours',
    front:
      'Li → Crimson red\nNa → Golden yellow\nK  → Lilac / violet\nCa → Orange-red\nBa → Apple green\nCu → Blue-green',
    back:
      'Flame tests work because metal cations absorb thermal energy, exciting electrons to higher energy levels. As electrons return to the ground state they emit characteristic wavelengths of visible light.',
    theme: 'purple',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'chem-3',
    subjectId: 'chem',
    title: 'Periodic trends',
    front:
      'Across a period (L → R):\n• Atomic radius ↓\n• Ionisation energy ↑\n• Electronegativity ↑\n• Electron affinity ↑ (generally)',
    back:
      'Effective nuclear charge increases across a period because protons are added to the same shell. Down a group, atomic radius increases due to additional electron shells, reducing ionisation energy and electronegativity.',
    theme: 'purple',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'chem-4',
    subjectId: 'chem',
    title: 'Common polyatomic ions',
    front:
      'SO₄²⁻  Sulfate\nNO₃⁻   Nitrate\nCO₃²⁻  Carbonate\nOH⁻    Hydroxide\nNH₄⁺   Ammonium\nMnO₄⁻  Permanganate',
    back:
      'Tip: "-ate" ions typically contain more oxygen than "-ite" ions (e.g. SO₄²⁻ sulfate vs SO₃²⁻ sulfite). NH₄⁺ is the only common positive polyatomic ion at this level.',
    theme: 'purple',
    mastered: false,
    reviewCount: 0,
  },

  // ── Maths ─────────────────────────────────────────────────
  {
    id: 'maths-1',
    subjectId: 'maths',
    title: 'Quadratic formula',
    front:
      'For ax² + bx + c = 0:\n\nx = (−b ± √(b² − 4ac)) / 2a\n\nDiscriminant Δ = b² − 4ac',
    back:
      'Δ > 0 → two distinct real roots\nΔ = 0 → one repeated real root\nΔ < 0 → no real roots (two complex conjugate roots)\n\nDerived by completing the square on the general quadratic.',
    theme: 'green',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'maths-2',
    subjectId: 'maths',
    title: 'Core trigonometric identities',
    front:
      'sin²θ + cos²θ = 1\ntan θ = sin θ / cos θ\n\nDouble angle:\nsin 2θ = 2 sin θ cos θ\ncos 2θ = cos²θ − sin²θ\n         = 2cos²θ − 1\n         = 1 − 2sin²θ',
    back:
      'These identities are derived from the unit circle. The Pythagorean identity sin²θ + cos²θ = 1 comes from x² + y² = 1. Dividing through by cos²θ gives 1 + tan²θ = sec²θ.',
    theme: 'green',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'maths-3',
    subjectId: 'maths',
    title: "Euler's formula & identity",
    front:
      "Euler's formula:\ne^(iθ) = cos θ + i sin θ\n\nEuler's identity (θ = π):\ne^(iπ) + 1 = 0",
    back:
      "Euler's identity links five fundamental constants: e, i, π, 1, and 0. The formula can be proven via Taylor series expansions of eˣ, sin x, and cos x. It is the foundation of phasor analysis in engineering.",
    theme: 'green',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'maths-4',
    subjectId: 'maths',
    title: 'Differentiation rules',
    front:
      'Power rule:  d/dx [xⁿ] = nxⁿ⁻¹\nProduct rule: (uv)′ = u′v + uv′\nQuotient rule: (u/v)′ = (u′v − uv′) / v²\nChain rule: dy/dx = dy/du · du/dx',
    back:
      'Common derivatives:\nd/dx [sin x] = cos x\nd/dx [cos x] = −sin x\nd/dx [eˣ] = eˣ\nd/dx [ln x] = 1/x\n\nThe chain rule is essential for composite functions, e.g. d/dx [sin(3x)] = 3cos(3x).',
    theme: 'green',
    mastered: false,
    reviewCount: 0,
  },

  // ── Physics ───────────────────────────────────────────────
  {
    id: 'phys-1',
    subjectId: 'phys',
    title: 'SUVAT – Kinematics equations',
    front:
      'v = u + at\ns = ut + ½at²\nv² = u² + 2as\ns = ½(u + v)t\n\nwhere s = displacement, u = initial velocity,\nv = final velocity, a = acceleration, t = time',
    back:
      'These equations assume constant (uniform) acceleration and motion in a straight line. They are derived from the definitions of velocity and acceleration by integration or algebraic manipulation.',
    theme: 'blue',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'phys-2',
    subjectId: 'phys',
    title: 'Planck equation & photon energy',
    front:
      'E = hf = hc / λ\n\nh = 6.63 × 10⁻³⁴ J·s  (Planck constant)\nc = 3.00 × 10⁸ m/s\n\nEnergy of a photon is proportional to its frequency.',
    back:
      'Higher frequency (shorter λ) means higher energy. UV photons carry more energy than visible light, which is why UV causes sunburn. This equation was key to explaining the photoelectric effect (Einstein, 1905).',
    theme: 'blue',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'phys-3',
    subjectId: 'phys',
    title: "Newton's three laws of motion",
    front:
      "1st Law: An object stays at rest or in uniform motion unless acted on by a net force.\n\n2nd Law: F = ma  (net force = mass × acceleration)\n\n3rd Law: Every action has an equal and opposite reaction.",
    back:
      "The 1st law defines inertia. The 2nd law is a vector equation — direction matters. The 3rd law's action-reaction pairs act on different objects (e.g. Earth pulls you down, you pull Earth up).",
    theme: 'blue',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'phys-4',
    subjectId: 'phys',
    title: "Ohm's law & electrical power",
    front:
      "Ohm's law: V = IR\n\nPower:\nP = IV = I²R = V²/R\n\nwhere V = voltage (V), I = current (A),\nR = resistance (Ω), P = power (W)",
    back:
      "Ohm's law applies to ohmic conductors (constant R). For non-ohmic components like diodes, R varies with V. Combining P = IV with V = IR yields the three equivalent power formulas.",
    theme: 'blue',
    mastered: false,
    reviewCount: 0,
  },

  // ── Biology ───────────────────────────────────────────────
  {
    id: 'bio-1',
    subjectId: 'bio',
    title: 'Stages of mitosis',
    front:
      'PMAT:\n1. Prophase — chromatin condenses, spindle forms\n2. Metaphase — chromosomes align at the equator\n3. Anaphase — sister chromatids pulled apart\n4. Telophase — nuclear envelopes reform\n+ Cytokinesis — cytoplasm divides',
    back:
      'Mitosis produces two genetically identical diploid daughter cells. It is used for growth, repair, and asexual reproduction. Meiosis (reduction division) produces four haploid gametes instead.',
    theme: 'pink',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'bio-2',
    subjectId: 'bio',
    title: 'Photosynthesis equation',
    front:
      '6CO₂ + 6H₂O  →  C₆H₁₂O₆ + 6O₂\n           (light energy, chlorophyll)\n\nLight-dependent: thylakoid membranes\nLight-independent (Calvin cycle): stroma',
    back:
      'Light reactions split water (photolysis) producing O₂, ATP, and NADPH. The Calvin cycle fixes CO₂ into G3P using ATP and NADPH. Limiting factors: light intensity, CO₂ concentration, temperature.',
    theme: 'pink',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'bio-3',
    subjectId: 'bio',
    title: 'DNA structure',
    front:
      'Double helix with antiparallel strands (5′→3′ and 3′→5′)\n\nBase pairing:\nA — T  (2 hydrogen bonds)\nG ≡ C  (3 hydrogen bonds)\n\nBackbone: sugar-phosphate (deoxyribose)',
    back:
      'Discovered by Watson & Crick (1953) using Rosalind Franklin\'s X-ray data. The double helix is stabilised by H-bonds between bases and hydrophobic stacking. Chargaff\'s rule: %A = %T and %G = %C.',
    theme: 'pink',
    mastered: false,
    reviewCount: 0,
  },
  {
    id: 'bio-4',
    subjectId: 'bio',
    title: 'Key cell organelles',
    front:
      'Nucleus — contains DNA, controls cell\nMitochondria — aerobic respiration (ATP)\nRibosomes — protein synthesis\nRER — protein folding & transport\nGolgi apparatus — modifies & packages proteins\nLysosomes — digestive enzymes\nCell membrane — selectively permeable phospholipid bilayer',
    back:
      'Mitochondria and chloroplasts have their own DNA (endosymbiont theory). Prokaryotes lack membrane-bound organelles but do have ribosomes (70S vs 80S in eukaryotes).',
    theme: 'pink',
    mastered: false,
    reviewCount: 0,
  },
];
