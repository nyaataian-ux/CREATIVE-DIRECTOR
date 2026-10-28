import { ProjectData, ReferenceItem, LayoutSpec } from '../types';

// Embedded clean vector brand assets
export const SAMPLE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <defs>
    <linearGradient id="helix" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <path d="M12 10 C18 4, 30 4, 36 10 C42 16, 30 26, 24 30 C18 34, 6 44, 12 50 C18 56, 30 56, 36 50" fill="none" stroke="url(#helix)" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="24" cy="30" r="3.5" fill="#38bdf8"/>
  <text x="56" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#f8fafc" letter-spacing="1.5">AEROVANT</text>
  <text x="57" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="3.5">PHARMACEUTICALS</text>
</svg>`;

export const SAMPLE_PACKSHOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 400" width="280" height="400">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="canisterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="40%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <!-- Drop shadow -->
  <ellipse cx="140" cy="375" rx="90" ry="14" fill="#000000" opacity="0.45"/>
  <!-- Inhaler Body -->
  <path d="M80 70 Q80 40 140 40 Q200 40 200 70 L200 240 Q200 280 170 300 L120 330 Q80 340 70 300 L70 120 Z" fill="url(#bodyGrad)" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Top Canister -->
  <rect x="105" y="15" width="70" height="65" rx="10" fill="url(#canisterGrad)" stroke="#0284c7" stroke-width="1"/>
  <rect x="120" y="8" width="40" height="8" rx="3" fill="#94a3b8"/>
  <!-- Dose counter display window -->
  <rect x="110" y="110" width="60" height="34" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="140" y="133" font-family="monospace" font-size="18" font-weight="700" fill="#38bdf8" text-anchor="middle">120</text>
  <!-- Embossed logo on body -->
  <text x="135" y="195" font-family="sans-serif" font-size="13" font-weight="800" fill="#0284c7" text-anchor="middle" letter-spacing="1">AEROVANT</text>
  <text x="135" y="210" font-family="sans-serif" font-size="9" font-weight="600" fill="#64748b" text-anchor="middle">DUAL-ACTION</text>
  <!-- Mouthpiece & Protective Cap -->
  <path d="M70 290 Q60 330 110 350 L140 330 Z" fill="url(#capGrad)" stroke="#334155" stroke-width="1"/>
  <!-- Micron mist airflow aura -->
  <circle cx="65" cy="315" r="28" fill="#38bdf8" opacity="0.18"/>
  <circle cx="50" cy="305" r="16" fill="#38bdf8" opacity="0.25"/>
</svg>`;

export const SAMPLE_BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50">
  <rect x="2" y="2" width="156" height="46" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="14" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <path d="M19 25 L23 29 L31 20" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <text x="48" y="22" font-family="sans-serif" font-size="9" font-weight="700" fill="#f8fafc">MHRA &amp; EMA</text>
  <text x="48" y="34" font-family="sans-serif" font-size="8" font-weight="500" fill="#94a3b8">AUTHORIZED 2026</text>
</svg>`;

export const INITIAL_A1_LAYOUT_SPEC: LayoutSpec = {
  document: {
    widthMm: 594,
    heightMm: 841,
    orientation: 'portrait',
    bleedMm: 3,
    title: 'Aerovant Dual-Action Product Awareness A1 Poster',
  },
  colorPalette: {
    primary: '#0284c7', // Sky-600 medical blue
    secondary: '#0f172a', // Slate-900 structural
    accent: '#38bdf8', // Sky-400 technical highlight
    background: '#090a0f', // Restrained charcoal canvas
    text: '#f8fafc',
    mutedText: '#94a3b8',
  },
  elements: [
    // Background canvas
    {
      id: 'bg-canvas',
      type: 'shape',
      role: 'background',
      x: 0,
      y: 0,
      width: 594,
      height: 841,
      fill: 'url(#bgGradient)',
      editable: false,
    },
    // Subtle architectural grid line
    {
      id: 'grid-hairline-1',
      type: 'shape',
      role: 'background',
      x: 48,
      y: 110,
      width: 498,
      height: 1,
      fill: '#1e293b',
      editable: false,
    },
    // Top Brand Logo
    {
      id: 'brand-logo',
      type: 'image',
      role: 'brand-elements',
      x: 48,
      y: 40,
      width: 140,
      height: 38,
      assetId: 'asset-logo-001',
      assetUrl: SAMPLE_LOGO_SVG,
      editable: false,
      locked: true,
    },
    // Regulatory Badge
    {
      id: 'regulatory-badge',
      type: 'image',
      role: 'brand-elements',
      x: 436,
      y: 42,
      width: 110,
      height: 34,
      assetId: 'asset-badge-001',
      assetUrl: SAMPLE_BADGE_SVG,
      editable: false,
      locked: true,
    },
    // Primary Headline (Exact Copy)
    {
      id: 'headline-text',
      type: 'text',
      role: 'headline',
      x: 48,
      y: 165,
      width: 498,
      height: 70,
      content: 'PRECISION MICRON DELIVERY.\nSUSTAINED 24-HOUR AIRWAY STABILITY.',
      contentSource: 'approvedCopy.headline',
      fontSize: 22,
      fontWeight: 800,
      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      fill: '#f8fafc',
      lineHeight: 28,
      editable: true,
    },
    // Subheading (Exact Copy)
    {
      id: 'subheading-text',
      type: 'text',
      role: 'subheading',
      x: 48,
      y: 245,
      width: 330,
      height: 40,
      content: 'Engineered for targeted alveolar penetration\nwith uniform micro-suspension distribution.',
      contentSource: 'approvedCopy.subheading',
      fontSize: 11,
      fontWeight: 500,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#38bdf8',
      lineHeight: 16,
      editable: true,
    },
    // Hero Packshot Placement (Protected Asset)
    {
      id: 'hero-packshot',
      type: 'image',
      role: 'hero-visual',
      x: 340,
      y: 230,
      width: 210,
      height: 300,
      assetId: 'asset-packshot-001',
      assetUrl: SAMPLE_PACKSHOT_SVG,
      editable: false,
      locked: true,
    },
    // Body Text Paragraph (Exact Copy)
    {
      id: 'body-paragraph',
      type: 'text',
      role: 'supporting-information',
      x: 48,
      y: 310,
      width: 280,
      height: 75,
      content:
        'Aerovant Dual-Action combines advanced ultra-fine\nparticle engineering (<2.5 µm MMAD) with an ergonomic\nlow-resistance actuation system, ensuring effortless patient\ncompliance and predictable bronchial deposition across all\ninspiratory flow rates.',
      contentSource: 'approvedCopy.bodyText',
      fontSize: 8.5,
      fontWeight: 400,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#cbd5e1',
      lineHeight: 13,
      editable: true,
    },
    // Data Card 1 (Approved Claim 1)
    {
      id: 'claim-card-1',
      type: 'shape',
      role: 'supporting-information',
      x: 48,
      y: 410,
      width: 136,
      height: 80,
      fill: '#0f172a',
      stroke: '#1e293b',
      strokeWidth: 0.8,
      borderRadius: 4,
      editable: true,
    },
    {
      id: 'claim-stat-1',
      type: 'text',
      role: 'supporting-information',
      x: 60,
      y: 438,
      width: 112,
      height: 25,
      content: '94.2%',
      fontSize: 19,
      fontWeight: 700,
      fontFamily: "'Outfit', sans-serif",
      fill: '#38bdf8',
      editable: true,
    },
    {
      id: 'claim-desc-1',
      type: 'text',
      role: 'supporting-information',
      x: 60,
      y: 456,
      width: 112,
      height: 28,
      content: 'Alveolar deposition\nefficiency in scintigraphy',
      contentSource: 'approvedCopy.approvedClaims[0]',
      fontSize: 6.8,
      fontWeight: 500,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#94a3b8',
      lineHeight: 9.5,
      editable: true,
    },
    // Data Card 2 (Approved Claim 2)
    {
      id: 'claim-card-2',
      type: 'shape',
      role: 'supporting-information',
      x: 192,
      y: 410,
      width: 136,
      height: 80,
      fill: '#0f172a',
      stroke: '#1e293b',
      strokeWidth: 0.8,
      borderRadius: 4,
      editable: true,
    },
    {
      id: 'claim-stat-2',
      type: 'text',
      role: 'supporting-information',
      x: 204,
      y: 438,
      width: 112,
      height: 25,
      content: '24-HOUR',
      fontSize: 16,
      fontWeight: 700,
      fontFamily: "'Outfit', sans-serif",
      fill: '#f8fafc',
      editable: true,
    },
    {
      id: 'claim-desc-2',
      type: 'text',
      role: 'supporting-information',
      x: 204,
      y: 456,
      width: 112,
      height: 28,
      content: 'FEV1 improvement sustained\nthrough complete cycle',
      contentSource: 'approvedCopy.approvedClaims[1]',
      fontSize: 6.8,
      fontWeight: 500,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#94a3b8',
      lineHeight: 9.5,
      editable: true,
    },
    // Product Formulation Information Box (Exact Copy)
    {
      id: 'product-info-box',
      type: 'shape',
      role: 'supporting-information',
      x: 48,
      y: 520,
      width: 498,
      height: 52,
      fill: '#0d131f',
      stroke: '#0284c7',
      strokeWidth: 0.6,
      borderRadius: 4,
      editable: true,
    },
    {
      id: 'product-info-text',
      type: 'text',
      role: 'supporting-information',
      x: 64,
      y: 542,
      width: 466,
      height: 30,
      content:
        'Aerovant (formoterol fumarate / glycopyrronium bromide) 12/96 mcg inhalation aerosol.\nIndicated for maintenance bronchodilator treatment in adult patients with chronic obstructive pulmonary disease (COPD).',
      contentSource: 'approvedCopy.productInformation',
      fontSize: 7.2,
      fontWeight: 500,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#e2e8f0',
      lineHeight: 11,
      editable: true,
    },
    // Call to Action Banner (Exact Copy)
    {
      id: 'cta-container',
      type: 'shape',
      role: 'call-to-action',
      x: 48,
      y: 600,
      width: 498,
      height: 48,
      fill: '#0284c7',
      borderRadius: 4,
      editable: true,
    },
    {
      id: 'cta-text',
      type: 'text',
      role: 'call-to-action',
      x: 297,
      y: 630,
      width: 460,
      height: 20,
      content: 'Discover the clinical evidence and prescribing guide at aerovant-clinical.org',
      contentSource: 'approvedCopy.callToAction',
      fontSize: 9.5,
      fontWeight: 700,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#ffffff',
      textAnchor: 'middle',
      editable: true,
    },
    // Mandatory Medical Disclaimer (Exact Copy - Never Invent)
    {
      id: 'disclaimer-divider',
      type: 'shape',
      role: 'disclaimer',
      x: 48,
      y: 675,
      width: 498,
      height: 0.8,
      fill: '#334155',
      editable: false,
    },
    {
      id: 'disclaimer-text',
      type: 'text',
      role: 'disclaimer',
      x: 48,
      y: 700,
      width: 498,
      height: 50,
      content:
        'Prescription-only medicine (POM). Refer to the full Summary of Product Characteristics (SmPC) prior to prescribing.\nReport adverse events in accordance with national pharmacovigilance regulations. Not indicated for acute bronchospasm relief.\nAdverse events should be reported to: pv-safety@aerovantpharma.com.',
      contentSource: 'approvedCopy.disclaimer',
      fontSize: 6.2,
      fontWeight: 400,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fill: '#94a3b8',
      lineHeight: 9.5,
      editable: true,
    },
    // Footer / Identification / Document Code (Exact Copy)
    {
      id: 'footer-text',
      type: 'text',
      role: 'footer',
      x: 48,
      y: 795,
      width: 498,
      height: 20,
      content:
        'Aerovant Pharma UK Ltd. © 2026. All rights reserved. Document Code: AER-2026-UK-0842. Date of preparation: October 2026.',
      contentSource: 'approvedCopy.footerText',
      fontSize: 6,
      fontWeight: 500,
      fontFamily: "'JetBrains Mono', monospace",
      fill: '#64748b',
      editable: true,
    },
  ],
};

export const INITIAL_REFERENCES: ReferenceItem[] = [
  {
    id: 'ref-swiss-001',
    filename: 'swiss-editorial-pharma-grid.png',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop', // fallback preview
    fileType: 'image/png',
    fileSize: 1845200,
    category: 'Healthcare Poster',
    uploadStatus: 'complete',
    userNotes: 'Reference for asymmetric packshot anchoring and clean, high-legibility typographic scale.',
    selectedForProject: true,
    uploadedAt: '2026-10-25T10:00:00.000Z',
    analysis: {
      referenceId: 'ref-swiss-001',
      filename: 'swiss-editorial-pharma-grid.png',
      artworkType: 'A1 Exhibition & Clinic Poster',
      aspectRatio: '1:1.414 (A-series Portrait)',
      intendedAudience: 'Medical consultants and clinic directors',
      communicationObjective: 'Build immediate scientific credibility and introduce novel formulation',
      brandContext: 'Tier-1 European clinical biotechnology',
      observations: {
        composition: [
          'Strict 12-column Swiss grid with 48mm outer protective margins',
          'Asymmetric split: 60% left column allocated for typographic persuasion, 40% right for hero packshot',
          'Generous vertical resting zone between headline and data cards',
        ],
        typography: [
          'High-contrast neo-grotesque sans display typeface for title with tight tracking (-0.02em)',
          'Clear 3:1 type size hierarchy from primary headline to explanatory body',
          'Tabular monospace figures for all quantitative clinical metric scores',
        ],
        colour: [
          'Dominant canvas: Deep void slate #090a0f (65% presence)',
          'Structural surface: Cool dark slate #0f172a (25% presence)',
          'Accent budget: Electric clinical cyan #38bdf8 (10% focused action points)',
        ],
        imagery: [
          'Unobscured, isolated product packshot rendered with crisp studio rim lighting',
          'Subtle atmospheric micro-particle aura signifying aerosol deposition',
        ],
        hierarchy: [
          'Level 1: Primary therapeutic promise headline',
          'Level 2: Floating 3D product delivery device',
          'Level 3: Dual quantitative proof cards',
          'Level 4: Prescribing indications and regulatory footer',
        ],
      },
      principles: [
        {
          id: 'p-1',
          name: 'Strict Asymmetric Aligned Grid',
          description: 'Lock text and packshot into clear vertical tracks without overlapping.',
          application: 'Ideal for healthcare posters requiring high data density without feeling cluttered.',
          limitations: 'Requires sufficient vertical canvas space (A1/A2).',
          confidence: 'high',
        },
        {
          id: 'p-2',
          name: 'Isolated Proof Metrics',
          description: 'Format clinical claims into distinct high-contrast data cards with oversized numbers.',
          application: 'Quickly captures clinical specialists during rapid walking transit in hospital corridors.',
          limitations: 'Keep to 2-3 key metrics maximum to prevent decision fatigue.',
          confidence: 'high',
        },
        {
          id: 'p-3',
          name: 'Regulated Disclaimer Zoning',
          description: 'Group legal, adverse-event, and prescribing disclaimers in a grounded base zone.',
          application: 'Mandatory in pharmaceutical and medical advertising across all international bodies.',
          limitations: 'Must maintain minimum 6pt legibility for regulatory compliance.',
          confidence: 'high',
        },
      ],
      protectedElements: ['Corporate logo', 'Pharmaceutical packaging canister', 'SmPC reference code'],
      userNotes: ['Approved for borrowing grid rhythm and data card positioning.'],
      analysisStatus: 'complete',
      rating: 5,
    },
  },
  {
    id: 'ref-monograph-002',
    filename: 'clinical-monograph-key-visual.png',
    fileUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop',
    fileType: 'image/png',
    fileSize: 2104500,
    category: 'Campaign Key Visual',
    uploadStatus: 'complete',
    userNotes: 'Reference for clear headline leading and high-visibility CTA banner design.',
    selectedForProject: true,
    uploadedAt: '2026-10-26T14:30:00.000Z',
    analysis: {
      referenceId: 'ref-monograph-002',
      filename: 'clinical-monograph-key-visual.png',
      artworkType: 'Clinical Symposium Key Visual',
      aspectRatio: '1:1.414',
      intendedAudience: 'Pulmonologists and respiratory nurse specialists',
      communicationObjective: 'Direct clinicians to online clinical trial registry and trial whitepapers',
      brandContext: 'Respiratory therapeutics portfolio',
      observations: {
        composition: [
          'High visual anchor at upper third',
          'Integrated full-width CTA bar separating technical narrative from legal disclaimers',
        ],
        typography: [
          'Geometric display sans with strong weight contrasts',
          'High line-height on medical prose ensuring zero optical crowding',
        ],
        colour: [
          'Deep midnight canvas with cyan edge glows',
          'Solid vibrant blue CTA block achieving 6.8:1 contrast against white type',
        ],
        imagery: [
          'Macro cross-section visualization of aerosol particles entering lung bronchia',
        ],
        hierarchy: [
          'Headline -> Visual Mechanism -> Action Link -> Compliance block',
        ],
      },
      principles: [
        {
          id: 'p-4',
          name: 'Full-Width Action Anchor',
          description: 'Use a solid, saturated CTA strip across the lower third to clearly separate clinical proof from mandatory footnotes.',
          application: 'Ensures the call to action is impossible to overlook even from 3 meters away.',
          limitations: 'Do not make it taller than 10% of total poster height.',
          confidence: 'high',
        },
      ],
      protectedElements: ['Prescribing URL', 'Adverse event reporting address'],
      userNotes: ['Adopt the full-width CTA bar styling.'],
      analysisStatus: 'complete',
      rating: 4,
    },
  },
];

export const INITIAL_DEFAULT_PROJECT: ProjectData = {
  id: 'proj-aerovant-001',
  name: 'Aerovant Dual-Action Product Awareness Campaign',
  clientBrand: 'Aerovant Pharma',
  category: 'A1 Poster',
  objective: 'Product-awareness campaign launching the next-generation micro-particle inhaler for severe respiratory management',
  targetAudience: 'Healthcare professionals (pulmonologists, GPs, hospital pharmacists) and managed respiratory patients',
  mainMessage: 'Precision Micron Aerosol Delivery for Sustained 24-Hour Bronchial Stability.',
  artDirection: 'Premium, sophisticated, clean and Swiss-grid disciplined with controlled negative space and authoritative clinical presence.',
  brandGuidelines: 'Palette strictly confined to Deep Slate (#090a0f), Pure White (#f8fafc), and Precision Cyan (#38bdf8 / #0284c7). Logo and packshot must be placed intact with zero redrawing or distortion.',
  mandatoryInclusions: [
    'Aerovant Pharmaceutical Wordmark',
    'MHRA & EMA Authorized Certification Badge',
    'Full Product Indication Statement',
    'Exact 24-hour stability claim wording',
    'Prescription-only medicine (POM) disclaimer',
    'Adverse event reporting instructions',
    'Document tracking code and preparation date',
  ],
  prohibitedChanges: [
    'Never alter or paraphrase approved headline and indication text',
    'Do not invent medical claims or statistical figures',
    'Never crop or apply decorative color filters to the packshot',
    'Do not alter the logo aspect ratio or typeface',
  ],
  outputFormats: ['SVG (Editable Master)', 'PDF (Print A1)', 'PNG (High-res Preview)'],
  productionRequirements: 'A1 Trim size 594mm x 841mm portrait, 3mm bleed, standard safe margin 48mm. CMYK process simulation and vector typography.',
  approvalStatus: 'Artwork In Review',

  approvedCopy: {
    headline: 'PRECISION MICRON DELIVERY.\nSUSTAINED 24-HOUR AIRWAY STABILITY.',
    subheading: 'Engineered for targeted alveolar penetration with uniform micro-suspension distribution.',
    bodyText:
      'Aerovant Dual-Action combines advanced ultra-fine particle engineering (<2.5 µm MMAD) with an ergonomic low-resistance actuation system, ensuring effortless patient compliance and predictable bronchial deposition across all inspiratory flow rates.',
    productInformation:
      'Aerovant (formoterol fumarate / glycopyrronium bromide) 12/96 mcg inhalation aerosol. Indicated for maintenance bronchodilator treatment in adult patients with chronic obstructive pulmonary disease (COPD).',
    approvedClaims: [
      'Demonstrated 94.2% alveolar deposition efficiency in clinical scintigraphy trials',
      'Statistically significant FEV1 improvement sustained through 24-hour post-dose monitoring',
      'Ergonomic dose indicator mechanism with audible lock-confirmation',
    ],
    callToAction: 'Discover the clinical evidence and prescribing guide at aerovant-clinical.org',
    disclaimer:
      'Prescription-only medicine (POM). Refer to the full Summary of Product Characteristics (SmPC) prior to prescribing. Report adverse events in accordance with national pharmacovigilance regulations. Not indicated for acute bronchospasm relief.',
    footerText:
      'Aerovant Pharma UK Ltd. © 2026. All rights reserved. Document Code: AER-2026-UK-0842. Date of preparation: October 2026.',
    contactInfo: 'Medical Affairs Inquiry: medical@aerovantpharma.com | 1-800-AERO-MED',
  },

  brandAssets: [
    {
      id: 'asset-logo-001',
      name: 'Aerovant Pharma Official Wordmark',
      filename: 'aerovant-logo-vector.svg',
      fileUrl: SAMPLE_LOGO_SVG,
      fileType: 'image/svg+xml',
      type: 'logo',
      integrityRule: 'PROTECTED',
      brand: 'Aerovant Pharma',
      notes: 'Preserve exact aspect ratio and colors. Never recreate or retype.',
      usedInElements: ['brand-logo'],
    },
    {
      id: 'asset-packshot-001',
      name: 'Aerovant Dual-Action Inhaler Packshot',
      filename: 'aerovant-dual-packshot.svg',
      fileUrl: SAMPLE_PACKSHOT_SVG,
      fileType: 'image/svg+xml',
      type: 'packshot',
      integrityRule: 'PROTECTED',
      brand: 'Aerovant Dual-Action',
      notes: 'Original product canister and dose counter. Placement only with proportional scaling.',
      usedInElements: ['hero-packshot'],
    },
    {
      id: 'asset-badge-001',
      name: 'Regulatory Authorization Seal',
      filename: 'mhra-ema-seal.svg',
      fileUrl: SAMPLE_BADGE_SVG,
      fileType: 'image/svg+xml',
      type: 'icon',
      integrityRule: 'PLACEMENT_ONLY',
      brand: 'Regulatory',
      notes: 'Mandatory clinical device authorization badge.',
      usedInElements: ['regulatory-badge'],
    },
  ],

  selectedReferenceIds: ['ref-swiss-001', 'ref-monograph-002'],

  concepts: [
    {
      id: 'concept-1',
      name: 'Swiss Precision Science (Selected Direction)',
      coreCreativeIdea: 'Clinical architectural rigor: Let pristine typography and mathematical data cards establish unquestioned clinical authority while isolating the physical delivery device.',
      communicationRationale: 'Healthcare professionals value verifiable quantitative data over decorative emotional claims. Establishing strict visual hierarchy immediately separates therapeutic benefit from mandatory pharmacovigilance.',
      visualMetaphor: 'A calibrated atmospheric micro-flow chamber: clean, controlled, sterile yet human-centered.',
      focalPoint: 'The high-contrast dual-line headline transitioning into the physical inhaler canister.',
      composition: 'Asymmetric 2-column structural division with 48mm perimeter breathing margins and grounded legal baseline.',
      readingSequence: [
        '1. Primary Clinical Headline',
        '2. Subheading & Formulation Promise',
        '3. Ergonomic Packshot & Dose Window',
        '4. Scintigraphy Proof Data Cards (94.2% & 24h)',
        '5. Prescribing Indications Container',
        '6. Full-Width Clinical Evidence CTA',
        '7. Mandatory Legal Disclaimers',
      ],
      typographyDirection: {
        displayFace: 'Outfit (Geometric Bold 700)',
        bodyFace: 'Plus Jakarta Sans (Medium 500, Regular 400)',
        hierarchyRationale: 'High optical contrast without becoming theatrical; ensures legibility from 3 meters down to 0.5 meter reading distance.',
      },
      colourDirection: {
        dominant: '#090a0f (Restrained Charcoal Canvas)',
        supporting: ['#0f172a (Structural Dark Slate)', '#1e293b (Hairline Dividers)'],
        accent: '#38bdf8 (Precision Clinical Cyan)',
        rationale: 'Deep dark field reduces eye fatigue, enhances perceived packaging contrast, and highlights cyan technical data points.',
      },
      imageDirection: 'Isolated high-key studio lighting on the physical device, micro-droplet aura to communicate particle penetration without cartoonish clouds.',
      referencePrinciplesUsed: [
        'Strict Asymmetric Aligned Grid (from Swiss Editorial Reference)',
        'Isolated Proof Metrics (from Swiss Editorial Reference)',
        'Full-Width Action Anchor (from Clinical Monograph Reference)',
      ],
      strengths: [
        'Uncompromising regulatory compliance with clear separation of claims and disclaimers',
        'High memorability in busy hospital corridors and medical congress halls',
        'Direct preservation of protected packshot and authorized logo',
      ],
      risks: [
        'Requires disciplined negative space maintenance during local text revisions',
      ],
      productionImplications: [
        'High-density vector text exports cleanly to A1 print with zero rasterization artifacts',
        'Exact 594x841mm trim with 3mm bleed and 48mm margin protection',
      ],
      selected: true,
    },
    {
      id: 'concept-2',
      name: 'Patient Empowerment & Daily Rhythm',
      coreCreativeIdea: 'Focus on 24-hour freedom: Frame the morning-to-night uninterrupted breath stability through circular temporal infographics.',
      communicationRationale: 'Appeals strongly to patients and general practitioners prioritizing daily quality-of-life and compliance over pharmacokinetics.',
      visualMetaphor: 'A continuous circular timeline showing 24 hours of sustained bronchial expansion.',
      focalPoint: 'Central circular 24-hour chronometer gauge adjacent to the device.',
      composition: 'Centric radial layout anchored by the inhaler dose counter.',
      readingSequence: ['Temporal Circle', 'Headline', 'Packshot', 'CTA'],
      typographyDirection: {
        displayFace: 'Plus Jakarta Sans Bold',
        bodyFace: 'Plus Jakarta Sans Regular',
        hierarchyRationale: 'Friendly yet disciplined medical sans.',
      },
      colourDirection: {
        dominant: '#0c1322',
        supporting: ['#1e293b', '#334155'],
        accent: '#10b981',
        rationale: 'Emerald green accents signify continuous vital respiration and recovery.',
      },
      imageDirection: 'Device placed at center of circular timeline with soft daylight backlighting.',
      referencePrinciplesUsed: ['Isolated Proof Metrics'],
      strengths: ['High emotional resonance for outpatient clinics'],
      risks: ['Radial geometry reduces space for lengthy mandatory medical indications'],
      productionImplications: ['Requires curved vector paths in SVG'],
      selected: false,
    },
    {
      id: 'concept-3',
      name: 'Cellular Alveolar Science',
      coreCreativeIdea: 'Deep micro-aerodynamic physics: Spotlight the sub-micron (<2.5 µm) aerosol particle distribution with scientific depth.',
      communicationRationale: 'Positions Aerovant as a technological breakthrough in particle engineering, compelling academic pulmonologists.',
      visualMetaphor: 'Microscopic cross-section of deep alveolar sacs receiving micro-fine aerosol deposition.',
      focalPoint: 'Luminescent microscopic particle stream entering the lung parenchyma.',
      composition: 'Diagonal kinetic composition with top-left to bottom-right trajectory.',
      readingSequence: ['Particle Trajectory', 'Headline', 'Clinical Stats', 'Prescribing Details'],
      typographyDirection: {
        displayFace: 'Outfit SemiBold',
        bodyFace: 'Plus Jakarta Sans',
        hierarchyRationale: 'High-tech scientific aesthetic.',
      },
      colourDirection: {
        dominant: '#080d1a',
        supporting: ['#172554'],
        accent: '#60a5fa',
        rationale: 'Deep royal blue evokes deep respiratory chambers and cryogenic stability.',
      },
      imageDirection: 'Scientific 3D rendering of micro-suspension aerosol droplets.',
      referencePrinciplesUsed: ['Strict Asymmetric Aligned Grid'],
      strengths: ['Extremely persuasive for clinical researchers and key opinion leaders'],
      risks: ['Heavy background imagery risks competing with body text legibility'],
      productionImplications: ['Requires careful background scrim to maintain WCAG contrast'],
      selected: false,
    },
  ],
  selectedConceptId: 'concept-1',

  prompts: [
    {
      id: 'prompt-v1',
      version: 1,
      visualAssetPrompt:
        'Studio pharmaceutical macro photography of the Aerovant dual-action aerosol inhaler standing upright on a polished obsidian slate surface. Ultra-clean medical device aesthetic, crisp rim illumination, subtle cool cyan micro-particle aerosol luminescence drifting from mouthpiece, 8k resolution, zero dust, neutral clinical background.',
      layoutConstructionPrompt:
        'Construct an A1 portrait poster (594mm x 841mm) with 3mm bleed in pure scalable SVG. Implement a 12-column Swiss grid with 48mm outer margin. Place the protected Aerovant logo top-left (x=48, y=40) and regulatory badge top-right (x=436, y=42). Set the primary headline in Outfit Bold 22pt: "PRECISION MICRON DELIVERY. SUSTAINED 24-HOUR AIRWAY STABILITY." Position the protected packshot in the right column (x=340, y=230, w=210, h=300). Anchor two clinical proof cards (94.2% alveolar deposition and 24-HOUR sustained FEV1). Insert approved formulation text in a bordered clinical container, follow with a full-width cyan CTA bar, and ground with the exact POM disclaimer and footer code.',
      sections: {
        overview: 'A1 Healthcare Awareness Poster for Aerovant Dual-Action Inhaler Campaign',
        communicationObjective: 'Drive clinical awareness and HCP trial adoption by highlighting sub-micron particle alveolar penetration and sustained 24-hr stability.',
        audience: 'Pulmonologists, general practitioners, hospital pharmacists, and adult COPD patients.',
        referenceAnalysis: 'Synthesized from Swiss Editorial Grid (ref-swiss-001) and Clinical Monograph Key Visual (ref-monograph-002). Reusable principles: Asymmetric Aligned Grid, Isolated Proof Metrics, Full-Width Action Anchor.',
        selectedConcept: 'Concept 1: Swiss Precision Science. Mathematical layout, disciplined negative space, authoritative contrast.',
        designRationale: 'Prioritizes scientific credibility through high-legibility sans typography, structured data proof cards, and intact preservation of physical packaging.',
        compositionGrid: 'A1 Portrait (594x841mm), 12-column modular grid, 48mm margin, 3mm bleed.',
        typography: 'Headline: Outfit 22pt bold. Subheading: Plus Jakarta Sans 11pt. Body: Plus Jakarta Sans 8.5pt. Data stats: Outfit 19pt. Disclaimers: Plus Jakarta Sans 6.2pt. Footer: JetBrains Mono 6pt.',
        colour: '65% Restrained Charcoal Canvas (#090a0f), 25% Structural Dark Slate (#0f172a), 10% Precision Cyan Accent (#38bdf8 / #0284c7).',
        imageDirection: 'Crisp studio photography of physical canister with subtle micro-mist halo; placed as vector/embedded asset without raster compression.',
        approvedCopy: 'Exact copy verbatim from approved source. Headline, indication, claims, disclaimer and footer must match 100%.',
        protectedAssets: 'Logo (asset-logo-001), Inhaler Packshot (asset-packshot-001), Regulatory Badge (asset-badge-001). All marked PROTECTED / PLACEMENT ONLY.',
        layoutRequirements: 'Independent SVG groups (<g id="group-background">, <g id="group-brand-elements">, <g id="group-headline">, <g id="group-hero-visual">, etc.). All text editable via <text> and <tspan>.',
        pdfProduction: 'A1 physical dimensions (1683.78pt x 2383.94pt), CMYK process simulation, embedded vector assets, crop mark guidelines.',
        qualityCriteria: '100% exact copy audit match, zero text collision, WCAG AA 4.5:1 text contrast, zero medical claim fabrication.',
        negativeConstraints: 'No invented medical claims, no cartoon illustrations, no floating sparkles, no distorted packshots, no unapproved text paraphrasing.',
        outputDeliverables: 'artwork.svg, artwork.pdf, artwork-preview.png, generation-prompt.md, design-spec.json, creative-rationale.md, asset-manifest.json, quality-report.json, README.md.',
      },
      updatedAt: '2026-10-27T16:00:00.000Z',
    },
  ],

  revisionHistory: [],
  createdAt: '2026-10-25T09:00:00.000Z',
  updatedAt: '2026-10-27T16:00:00.000Z',
};
