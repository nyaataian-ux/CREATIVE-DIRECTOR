export type ArtworkCategory =
  | 'A1 Poster'
  | 'A2 Poster'
  | 'A3 Poster'
  | 'Brochure'
  | 'Product Label'
  | 'Digital Advertising'
  | 'Campaign Key Visual';

export type IntegrityRule =
  | 'PROTECTED'
  | 'PLACEMENT_ONLY'
  | 'CROPPING_ALLOWED'
  | 'EDITABLE'
  | 'REPLACEMENT_REQUIRED';

export interface BrandAsset {
  id: string;
  name: string;
  filename: string;
  fileUrl: string; // data URL or path
  fileType: string;
  type: 'logo' | 'packshot' | 'photo' | 'icon' | 'color_palette' | 'disclaimer';
  integrityRule: IntegrityRule;
  width?: number;
  height?: number;
  notes?: string;
  brand?: string;
  usedInElements?: string[];
}

export interface ApprovedCopy {
  headline: string;
  subheading: string;
  bodyText: string;
  productInformation: string;
  approvedClaims: string[];
  callToAction: string;
  disclaimer: string;
  footerText: string;
  contactInfo: string;
}

export interface DesignPrinciple {
  id: string;
  name: string;
  description: string;
  application: string;
  limitations: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ReferenceObservations {
  composition: string[];
  typography: string[];
  colour: string[];
  imagery: string[];
  hierarchy: string[];
}

export interface ReferenceAnalysis {
  referenceId: string;
  filename: string;
  artworkType: string;
  aspectRatio: string;
  intendedAudience: string;
  communicationObjective: string;
  brandContext: string;
  observations: ReferenceObservations;
  principles: DesignPrinciple[];
  protectedElements: string[];
  userNotes: string[];
  analysisStatus: 'pending' | 'analyzing' | 'complete' | 'failed';
  rating?: number;
}

export interface ReferenceItem {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadStatus: 'uploaded' | 'analyzing' | 'complete' | 'error';
  errorMessage?: string;
  analysis?: ReferenceAnalysis;
  userNotes: string;
  selectedForProject: boolean;
  uploadedAt: string;
}

export interface ConceptDirection {
  id: string;
  name: string;
  coreCreativeIdea: string;
  communicationRationale: string;
  visualMetaphor: string;
  focalPoint: string;
  composition: string;
  readingSequence: string[];
  typographyDirection: {
    displayFace: string;
    bodyFace: string;
    hierarchyRationale: string;
  };
  colourDirection: {
    dominant: string;
    supporting: string[];
    accent: string;
    rationale: string;
  };
  imageDirection: string;
  referencePrinciplesUsed: string[];
  strengths: string[];
  risks: string[];
  productionImplications: string[];
  selected?: boolean;
}

export interface PromptSections {
  overview: string;
  communicationObjective: string;
  audience: string;
  referenceAnalysis: string;
  selectedConcept: string;
  designRationale: string;
  compositionGrid: string;
  typography: string;
  colour: string;
  imageDirection: string;
  approvedCopy: string;
  protectedAssets: string;
  layoutRequirements: string;
  pdfProduction: string;
  qualityCriteria: string;
  negativeConstraints: string;
  outputDeliverables: string;
}

export interface ProjectPrompt {
  id: string;
  version: number;
  visualAssetPrompt: string;
  layoutConstructionPrompt: string;
  sections: PromptSections;
  updatedAt: string;
}

export interface LayoutElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'group';
  role:
    | 'background'
    | 'brand-elements'
    | 'hero-visual'
    | 'headline'
    | 'subheading'
    | 'supporting-information'
    | 'call-to-action'
    | 'disclaimer'
    | 'footer';
  x: number; // in mm or relative coordinate
  y: number;
  width: number;
  height: number;
  content?: string;
  contentSource?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  lineHeight?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  borderRadius?: number;
  assetId?: string;
  assetUrl?: string;
  editable: boolean;
  locked?: boolean;
}

export interface LayoutSpec {
  document: {
    widthMm: number;
    heightMm: number;
    orientation: 'portrait' | 'landscape';
    bleedMm: number;
    title: string;
  };
  elements: LayoutElement[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    mutedText: string;
  };
}

export interface ArtworkRevision {
  revisionId: string;
  timestamp: string;
  changeSummary: string;
  promptVersion: number;
  layoutSpec: LayoutSpec;
  svgMarkup: string;
  qaStatus: 'passed' | 'review-required' | 'failed' | 'untested';
}

export interface QACheckItem {
  id: string;
  name: string;
  category: 'dimensions' | 'copy_integrity' | 'asset_protection' | 'visual_hierarchy' | 'print_readiness';
  status: 'passed' | 'failed' | 'needs-review' | 'not-applicable';
  details: string;
  recommendation?: string;
}

export interface CopyAuditItem {
  field: string;
  suppliedText: string;
  foundInArtwork: boolean;
  exactMatch: boolean;
  similarityScore: number;
  discrepancyNote?: string;
}

export interface QAReport {
  timestamp: string;
  overallStatus: 'passed' | 'review-required' | 'failed';
  checks: QACheckItem[];
  copyAudit: CopyAuditItem[];
  visualCritique: {
    hierarchyScore: string;
    compositionAnalysis: string;
    typographyLegibility: string;
    colorContrast: string;
    unintendedArtifacts: string[];
    briefComplianceNote: string;
  };
  blockers: string[];
  warnings: string[];
  recommendations: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  clientBrand: string;
  category: ArtworkCategory;
  objective: string;
  targetAudience: string;
  mainMessage: string;
  artDirection: string;
  brandGuidelines: string;
  mandatoryInclusions: string[];
  prohibitedChanges: string[];
  outputFormats: string[];
  productionRequirements: string;
  approvalStatus: 'Draft' | 'Concept Approved' | 'Artwork In Review' | 'Production Ready' | 'Exported';
  
  // Structured sub-entities
  approvedCopy: ApprovedCopy;
  brandAssets: BrandAsset[];
  selectedReferenceIds: string[];
  concepts: ConceptDirection[];
  selectedConceptId?: string;
  prompts: ProjectPrompt[];
  currentRevision?: ArtworkRevision;
  revisionHistory: ArtworkRevision[];
  latestQAReport?: QAReport;
  
  createdAt: string;
  updatedAt: string;
}

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionSuggested?: {
    type: 'apply_palette' | 'apply_layout' | 'apply_typography' | 'apply_background';
    label: string;
    payload: any;
  };
}

export interface ComplianceCheckResult {
  passed: boolean;
  score: number;
  readabilityScore: string;
  superlativeFlags: { phrase: string; reason: string; severity: 'high' | 'medium' | 'low' }[];
  pomIdentification: boolean;
  disclaimerPresent: boolean;
  recommendations: string[];
}

export interface GeneratedVisualAsset {
  id: string;
  name: string;
  prompt: string;
  fileUrl: string;
  type: 'background' | 'illustration' | 'pattern';
  createdAt: string;
}
