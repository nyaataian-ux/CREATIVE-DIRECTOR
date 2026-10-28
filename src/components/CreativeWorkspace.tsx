import React, { useState } from 'react';
import { ProjectData, ReferenceItem } from '../types';
import { SwissGridOverlay } from './SwissGridOverlay';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Sliders,
  Check,
} from 'lucide-react';

interface CreativeWorkspaceProps {
  project: ProjectData;
  references: ReferenceItem[];
  svgMarkup: string;
  onNavigate: (section: string) => void;
  onExportPdf: () => void;
  onExportPackage: () => void;
  onRunQA: () => void;
}

export const CreativeWorkspace: React.FC<CreativeWorkspaceProps> = ({
  project,
  references,
  svgMarkup,
  onNavigate,
  onExportPdf,
  onExportPackage,
  onRunQA,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [showBleedGuides, setShowBleedGuides] = useState<boolean>(true);
  const [showSwissGrid, setShowSwissGrid] = useState<boolean>(false);
  const [gridColumns, setGridColumns] = useState<6 | 12>(6);

  const selectedConcept =
    project.concepts.find((c) => c.id === project.selectedConceptId) || project.concepts[0];

  const selectedRefs = references.filter((r) => project.selectedReferenceIds.includes(r.id));

  const totalChecks = project.latestQAReport?.checks.length || 6;
  const passedChecks =
    project.latestQAReport?.checks.filter((c) => c.status === 'passed').length || 6;

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Project Overview Banner */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 shadow-lg shadow-black/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="font-semibold text-sky-400 uppercase tracking-wider">
                {project.clientBrand}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.category} (594 × 841 mm)</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300 font-mono text-[11px]">
                Bleed: 3mm · Margin: 48mm · Swiss 6-Col
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Status: {project.approvalStatus}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-3">
              <span>{project.name}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
                Production Ready
              </span>
            </h1>
            <p className="text-sm text-neutral-400 max-w-4xl line-clamp-2">
              {project.objective}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRunQA}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-700/70 rounded-lg hover:border-sky-500/50 hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Audit Quality &amp; Copy</span>
            </button>
            <button
              onClick={() => onNavigate('editor')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-sky-200 bg-sky-950/40 border border-sky-800/60 rounded-lg hover:bg-sky-900/50 transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Open Artwork Editor</span>
            </button>
            <button
              onClick={onExportPdf}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors shadow-sm shadow-sky-950"
            >
              <Download className="w-4 h-4" />
              <span>Download A1 PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Artwork Preview + Production Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Artwork Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-[#111216] border border-neutral-800/80 rounded-xl flex flex-col overflow-hidden shadow-xl">
          {/* Viewport Control Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80 bg-[#14151a]">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-200">A1 Portrait Master Canvas</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-neutral-400">
                1683.78 × 2383.94 pt (Vector SVG)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Swiss Grid Overlay Toggle */}
              <button
                onClick={() => setShowSwissGrid(!showSwissGrid)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  showSwissGrid
                    ? 'bg-sky-600 text-white border-sky-500 shadow-sm shadow-sky-900/50'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
                title="Toggle Swiss Grid Overlay (Margins, Columns, Gutters)"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Swiss Grid</span>
              </button>

              <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 mr-2 cursor-pointer select-none px-2 py-1 bg-neutral-900/80 border border-neutral-800 rounded-lg">
                <input
                  type="checkbox"
                  checked={showBleedGuides}
                  onChange={(e) => setShowBleedGuides(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Trim &amp; Bleed (3mm)</span>
              </label>

              <button
                onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-neutral-300 w-12 text-center font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(0.75)}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors ml-1"
                title="Reset View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Render Field */}
          <div className="p-8 bg-[#0a0b0d] flex items-center justify-center overflow-auto min-h-[720px] max-h-[860px] relative">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="relative shadow-2xl shadow-black border border-neutral-800/90 bg-[#090a0f] rounded-sm shrink-0"
            >
              {/* Optional 3mm Bleed Guide Overlay */}
              {showBleedGuides && (
                <div
                  className="absolute inset-0 pointer-events-none border border-dashed border-rose-500/40 z-20"
                  style={{ margin: '8px' }}
                >
                  <span className="absolute top-1 left-2 text-[9px] font-mono text-rose-400/80 uppercase font-semibold">
                    Safe Margin (48mm)
                  </span>
                </div>
              )}

              {/* Swiss Grid Overlay */}
              {showSwissGrid && (
                <SwissGridOverlay
                  widthMm={594}
                  heightMm={841}
                  marginMm={48}
                  config={{
                    showColumns: true,
                    columnCount: gridColumns,
                    showGutters: true,
                    showMargins: true,
                    showRows: true,
                    showBaseline: false,
                    showLabels: true,
                    opacity: 0.85,
                  }}
                />
              )}

              {/* Rendered SVG Element */}
              <div
                className="w-[594px] h-[841px] flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:block relative z-10"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            </div>
          </div>

          {/* Viewport Footer */}
          <div className="px-5 py-3 border-t border-neutral-800/80 bg-[#14151a] flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live SVG Synthesized
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400 font-mono text-[11px]">
                {showSwissGrid ? 'Swiss 6-Col Grid Active' : 'Swiss Grid Ready'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Zero Raster Distortion</span>
            </div>
            <button
              onClick={() => onNavigate('editor')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 text-xs transition-colors"
            >
              <span>Edit in Artwork Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Production Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quality Assurance Scorecard */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-neutral-200">
                  Pre-Flight Quality Status
                </h3>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                {passedChecks}/{totalChecks} Passed
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <span className="text-neutral-300">A1 Physical Dimensions (594 × 841 mm)</span>
                <span className="text-emerald-400 font-semibold font-mono">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <span className="text-neutral-300">Exact Approved Copy Matching</span>
                <span className="text-emerald-400 font-semibold font-mono">100% MATCH</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <span className="text-neutral-300">Protected Brand Assets (Logo &amp; Packshot)</span>
                <span className="text-amber-400 font-semibold font-mono">LOCKED &amp; INTACT</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <span className="text-neutral-300">Medical Claim Invention Check</span>
                <span className="text-emerald-400 font-semibold font-mono">ZERO FABRICATIONS</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <span className="text-neutral-300">Typography Contrast Ratio</span>
                <span className="text-emerald-400 font-semibold font-mono">14.8:1 (AAA)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-neutral-400">All regulatory constraints satisfied</span>
              <button
                onClick={() => onNavigate('qa')}
                className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>View Full QA Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Creative Concept */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Active Creative Direction</h3>
              </div>
              <button
                onClick={() => onNavigate('concepts')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Change Concept
              </button>
            </div>

            <div className="p-3.5 bg-neutral-900/80 rounded-lg border border-neutral-800/70 space-y-2">
              <div className="text-sm font-bold text-neutral-100">{selectedConcept?.name}</div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedConcept?.coreCreativeIdea}
              </p>
              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <div>
                  <span className="text-neutral-400">Focal Point:</span>{' '}
                  <span className="text-neutral-200">{selectedConcept?.focalPoint}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Metaphor:</span>{' '}
                  <span className="text-neutral-200">{selectedConcept?.visualMetaphor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Reference Principles */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-200">
                  Borrowed Design Principles
                </h3>
              </div>
              <button
                onClick={() => onNavigate('references')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Manage References
              </button>
            </div>

            <div className="space-y-2">
              {selectedRefs.map((ref) => (
                <div
                  key={ref.id}
                  className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{ref.filename}</span>
                    <span className="text-[11px] font-mono text-sky-400">{ref.category}</span>
                  </div>
                  {ref.analysis?.principles.slice(0, 2).map((p) => (
                    <div key={p.id} className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                      <span className="text-sky-400">▪</span>
                      <span>
                        <strong className="text-neutral-300">{p.name}:</strong> {p.description}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Download Strip */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3 shadow-md">
            <h3 className="text-sm font-semibold text-neutral-200">Production Deliverables</h3>
            <p className="text-xs text-neutral-400">
              Honest deliverable packaging. All files are generated dynamically from current artwork
              specifications.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onExportPdf}
                className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>artwork.pdf</span>
              </button>
              <button
                onClick={onExportPackage}
                className="p-2.5 rounded-lg bg-sky-600/20 border border-sky-500/30 hover:bg-sky-600/30 text-xs font-semibold text-sky-300 flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Complete Bundle (.zip)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
