import React, { useState } from 'react';
import { LayoutSpec, LayoutElement } from '../types';
import { generateSvgFromLayout } from '../utils/svgEngine';
import { SwissGridOverlay, SwissGridConfig, DEFAULT_SWISS_GRID_CONFIG } from './SwissGridOverlay';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  Undo2,
  Redo2,
  Save,
  RotateCcw,
  Download,
  Eye,
  Type,
  Move,
  Palette,
  CheckCircle2,
  Sparkles,
  Grid3X3,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Shield,
  Image as ImageIcon,
  Columns,
  Maximize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';

interface ArtworkEditorProps {
  layoutSpec: LayoutSpec;
  onUpdateLayoutSpec: (newSpec: LayoutSpec, summary: string) => void;
  onResetLayoutSpec: () => void;
  revisionCount: number;
  onAutoBalance?: () => void;
  isOptimizing?: boolean;
  onOpenCopilot?: () => void;
}

export const ArtworkEditor: React.FC<ArtworkEditorProps> = ({
  layoutSpec,
  onUpdateLayoutSpec,
  onResetLayoutSpec,
  revisionCount,
  onAutoBalance,
  isOptimizing,
  onOpenCopilot,
}) => {
  const [currentSpec, setCurrentSpec] = useState<LayoutSpec>(layoutSpec);
  const [history, setHistory] = useState<LayoutSpec[]>([layoutSpec]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string>('headline-text');
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [showBleed, setShowBleed] = useState<boolean>(true);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);
  const [gridConfig, setGridConfig] = useState<SwissGridConfig>(DEFAULT_SWISS_GRID_CONFIG);
  const [showGridSettingsModal, setShowGridSettingsModal] = useState<boolean>(false);
  const [revisionSummary, setRevisionSummary] = useState<string>('Adjusted element positioning and typographic scale');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  React.useEffect(() => {
    setCurrentSpec(layoutSpec);
  }, [layoutSpec]);

  const selectedElement = currentSpec.elements.find((el) => el.id === selectedElementId);
  const hoveredElement = hoveredElementId
    ? currentSpec.elements.find((el) => el.id === hoveredElementId)
    : null;

  // Generate live SVG markup from current state
  const liveSvg = generateSvgFromLayout(currentSpec);

  const applyChange = (updatedElements: LayoutElement[]) => {
    const nextSpec: LayoutSpec = {
      ...currentSpec,
      elements: updatedElements,
    };
    setCurrentSpec(nextSpec);

    // Append to local undo history
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(nextSpec);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUpdateElementProperty = (key: keyof LayoutElement, value: any) => {
    if (!selectedElement || selectedElement.locked) return;

    const updated = currentSpec.elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, [key]: value };
      }
      return el;
    });

    applyChange(updated);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentSpec(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentSpec(history[historyIndex + 1]);
    }
  };

  const handleSaveRevision = () => {
    onUpdateLayoutSpec(currentSpec, revisionSummary);
    setShowSaveModal(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([liveSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swiss-artwork-master.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Swiss alignment helper actions for selected element
  const alignToLeftMargin = () => {
    if (!selectedElement || selectedElement.locked) return;
    handleUpdateElementProperty('x', 48);
  };

  const alignToCenterX = () => {
    if (!selectedElement || selectedElement.locked) return;
    const centeredX = Math.round((594 - selectedElement.width) / 2);
    handleUpdateElementProperty('x', centeredX);
  };

  const alignToRightMargin = () => {
    if (!selectedElement || selectedElement.locked) return;
    const rightX = Math.round(546 - selectedElement.width);
    handleUpdateElementProperty('x', rightX);
  };

  const alignToTopMargin = () => {
    if (!selectedElement || selectedElement.locked) return;
    handleUpdateElementProperty('y', 48);
  };

  const spanThreeColumns = () => {
    if (!selectedElement || selectedElement.locked) return;
    // 3 Swiss columns: 3 * 76.33 + 2 * 8 = 245mm
    handleUpdateElementProperty('width', 245);
  };

  const spanFullContentWidth = () => {
    if (!selectedElement || selectedElement.locked) return;
    const updated = currentSpec.elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, x: 48, width: 498 };
      }
      return el;
    });
    applyChange(updated);
  };

  // Role color pill styles for colorful hierarchy
  const getRoleStyle = (role: LayoutElement['role']) => {
    switch (role) {
      case 'headline':
        return {
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          label: 'Headline',
          icon: <Type className="w-3 h-3 text-blue-400" />,
        };
      case 'subheading':
        return {
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-400',
          label: 'Subheading',
          icon: <Type className="w-3 h-3 text-cyan-400" />,
        };
      case 'hero-visual':
        return {
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'Hero Visual',
          icon: <ImageIcon className="w-3 h-3 text-emerald-400" />,
        };
      case 'brand-elements':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'Brand Asset',
          icon: <Shield className="w-3 h-3 text-amber-400" />,
        };
      case 'call-to-action':
        return {
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
          label: 'CTA',
          icon: <Sparkles className="w-3 h-3 text-purple-400" />,
        };
      case 'supporting-information':
        return {
          badge: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
          dot: 'bg-teal-400',
          label: 'Supporting',
          icon: <Type className="w-3 h-3 text-teal-400" />,
        };
      case 'disclaimer':
      case 'footer':
        return {
          badge: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
          dot: 'bg-slate-400',
          label: 'Legal / Info',
          icon: <Layers className="w-3 h-3 text-slate-400" />,
        };
      default:
        return {
          badge: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          dot: 'bg-neutral-400',
          label: 'Element',
          icon: <Layers className="w-3 h-3 text-neutral-400" />,
        };
    }
  };

  // Curated color swatches for quick palette assignment
  const quickPalette = [
    { label: 'Navy Deep', color: '#0a192f' },
    { label: 'Brand Cyan', color: '#0284c7' },
    { label: 'Sky Blue', color: '#38bdf8' },
    { label: 'Medical Mint', color: '#10b981' },
    { label: 'Warm Amber', color: '#f59e0b' },
    { label: 'Rose Accent', color: '#f43f5e' },
    { label: 'Pure White', color: '#ffffff' },
    { label: 'Dark Slate', color: '#1e293b' },
    { label: 'Muted Silver', color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Editor Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 shadow-lg shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Vector Artwork Production Engine</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
              <span>Live SVG Artwork Editor</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/70 border border-sky-800/60 text-sky-300">
                Swiss Grid v2.4
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Property-based vector editing with millimeter coordinates, lock controls for protected brand assets, and
              instant SVG synthesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 mr-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-1.5 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 rounded transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 rounded transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {onAutoBalance && (
              <button
                onClick={onAutoBalance}
                disabled={isOptimizing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-700/80 hover:bg-sky-900/60 rounded-lg transition-colors shadow-sm disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{isOptimizing ? 'Balancing...' : 'AI Auto-Balance'}</span>
              </button>
            )}

            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Copilot</span>
              </button>
            )}

            <button
              onClick={onResetLayoutSpec}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export SVG</span>
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm shadow-sky-900/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Revision</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Artwork revision saved to project history.</span>
          </div>
        )}
      </div>

      {/* Editor Split: Canvas & Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-[#111216] border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col shadow-xl">
          {/* Canvas Controls Bar */}
          <div className="px-5 py-3 border-b border-neutral-800/80 bg-[#14151a] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="font-semibold text-neutral-200">A1 Master Canvas</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                594 × 841 mm (Margin: 48mm)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Swiss Grid Overlay Toggle Button (Primary User Request) */}
              <div className="flex items-center bg-neutral-900 border border-neutral-700/80 rounded-lg p-0.5 shadow-sm">
                <button
                  onClick={() => setShowGridOverlay(!showGridOverlay)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    showGridOverlay
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-900/50'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Toggle Swiss Grid Overlay (Margins, Columns, Gutters)"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Swiss Grid</span>
                  <span className={`text-[10px] ml-0.5 px-1 rounded ${showGridOverlay ? 'bg-sky-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                    {gridConfig.columnCount}C
                  </span>
                </button>

                <button
                  onClick={() => setShowGridSettingsModal(!showGridSettingsModal)}
                  className={`p-1 rounded text-neutral-400 hover:text-neutral-100 transition-colors ml-0.5 ${
                    showGridSettingsModal ? 'bg-neutral-800 text-sky-300' : ''
                  }`}
                  title="Configure Grid Lines, Gutters & Columns"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bleed Overlay Toggle */}
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer select-none px-2 py-1 bg-neutral-900/80 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  checked={showBleed}
                  onChange={(e) => setShowBleed(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Bleed (3mm)</span>
              </label>

              {/* Zoom Controls */}
              <div className="flex items-center gap-0.5 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                  className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono text-neutral-300 w-11 text-center font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
                  className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(0.85)}
                  className="px-1.5 py-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:bg-neutral-800 rounded transition-colors ml-0.5"
                  title="Fit Canvas"
                >
                  Fit
                </button>
              </div>
            </div>
          </div>

          {/* Grid Settings Popover Panel */}
          {showGridSettingsModal && (
            <div className="px-5 py-3.5 bg-[#181920] border-b border-neutral-700/80 flex flex-wrap items-center gap-4 text-xs animate-in slide-in-from-top-2">
              <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Grid Options:</span>
              </span>

              {/* Column Count Selection */}
              <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800">
                <button
                  onClick={() => setGridConfig((prev) => ({ ...prev, columnCount: 6 }))}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    gridConfig.columnCount === 6
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  6 Columns (Poster Standard)
                </button>
                <button
                  onClick={() => setGridConfig((prev) => ({ ...prev, columnCount: 12 }))}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    gridConfig.columnCount === 12
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  12 Columns (Fine Detail)
                </button>
              </div>

              {/* Toggles for sub-elements */}
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridConfig.showGutters}
                  onChange={(e) =>
                    setGridConfig((prev) => ({ ...prev, showGutters: e.target.checked }))
                  }
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Gutters (8mm)</span>
              </label>

              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridConfig.showMargins}
                  onChange={(e) =>
                    setGridConfig((prev) => ({ ...prev, showMargins: e.target.checked }))
                  }
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>48mm Margins</span>
              </label>

              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridConfig.showRows}
                  onChange={(e) =>
                    setGridConfig((prev) => ({ ...prev, showRows: e.target.checked }))
                  }
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Modular Rows</span>
              </label>

              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridConfig.showBaseline}
                  onChange={(e) =>
                    setGridConfig((prev) => ({ ...prev, showBaseline: e.target.checked }))
                  }
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Baseline (24mm)</span>
              </label>

              {/* Opacity slider */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] text-neutral-400">Opacity:</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={gridConfig.opacity}
                  onChange={(e) =>
                    setGridConfig((prev) => ({ ...prev, opacity: parseFloat(e.target.value) }))
                  }
                  className="w-20 accent-sky-500"
                />
                <span className="text-[10px] font-mono text-neutral-400 w-6">
                  {Math.round(gridConfig.opacity * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Canvas Viewport */}
          <div className="p-8 bg-[#0a0b0d] flex items-center justify-center overflow-auto min-h-[720px] max-h-[880px] relative">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.12s ease-out',
              }}
              className="relative shadow-2xl shadow-black border border-neutral-800/90 bg-[#090a0f] rounded-sm shrink-0"
            >
              {/* Optional 3mm Bleed Overlay */}
              {showBleed && (
                <div
                  className="absolute inset-0 pointer-events-none border border-dashed border-rose-500/50 z-20"
                  style={{ margin: '8px' }}
                >
                  <span className="absolute top-1 left-2 text-[9px] font-mono text-rose-400 uppercase tracking-wider font-semibold">
                    Bleed Boundary (3mm)
                  </span>
                </div>
              )}

              {/* Hover Indicator Box for Layer element */}
              {hoveredElement && hoveredElement.id !== selectedElementId && (
                <div
                  className="absolute border border-dashed border-sky-400/60 bg-sky-400/5 pointer-events-none z-20 transition-all duration-75"
                  style={{
                    left: `${hoveredElement.x}px`,
                    top: `${hoveredElement.y}px`,
                    width: `${hoveredElement.width}px`,
                    height: `${hoveredElement.height}px`,
                  }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/60 text-[9px] font-mono text-sky-200">
                    {hoveredElement.id}
                  </span>
                </div>
              )}

              {/* Selection bounding box indicator for current element */}
              {selectedElement && (
                <div
                  className="absolute border-2 border-sky-400 bg-sky-500/10 pointer-events-none z-30 transition-all shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                  style={{
                    left: `${selectedElement.x}px`,
                    top: `${selectedElement.y}px`,
                    width: `${selectedElement.width}px`,
                    height: `${selectedElement.height}px`,
                  }}
                >
                  {/* Corner Handles */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-sky-600 rounded-sm" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-sky-600 rounded-sm" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-sky-600 rounded-sm" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-sky-600 rounded-sm" />

                  {/* Element Live Metric Label */}
                  <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-900 border border-sky-500 text-[10px] font-mono text-sky-200 whitespace-nowrap shadow-md">
                    <span className="font-bold text-white">{selectedElement.id}</span>
                    <span className="text-neutral-500">|</span>
                    <span>
                      {Math.round(selectedElement.width)} × {Math.round(selectedElement.height)} mm
                    </span>
                  </div>
                </div>
              )}

              {/* Swiss Grid Overlay Component */}
              {showGridOverlay && (
                <SwissGridOverlay
                  widthMm={594}
                  heightMm={841}
                  marginMm={48}
                  config={gridConfig}
                  activeElementCoords={
                    selectedElement
                      ? {
                          x: selectedElement.x,
                          y: selectedElement.y,
                          width: selectedElement.width,
                          height: selectedElement.height,
                        }
                      : null
                  }
                />
              )}

              {/* Native Vector SVG Canvas Content */}
              <div
                className="w-[594px] h-[841px] flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:block relative z-10"
                dangerouslySetInnerHTML={{ __html: liveSvg }}
              />
            </div>
          </div>

          {/* Canvas Footer Status */}
          <div className="px-5 py-2.5 border-t border-neutral-800/80 bg-[#14151a] flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="text-sky-400 flex items-center gap-1 font-semibold">
                <Grid3X3 className="w-3.5 h-3.5" />
                {showGridOverlay ? `Swiss Grid Active (${gridConfig.columnCount}-Col)` : 'Grid Inactive'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">Gutters: 8mm</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">Margins: 48mm</span>
            </div>
            <div className="text-neutral-400 font-mono text-[11px]">
              {selectedElement ? (
                <span className="text-emerald-400">
                  Target: <strong className="text-neutral-100">{selectedElement.id}</strong> (X:{selectedElement.x} Y:{selectedElement.y})
                </span>
              ) : (
                'Click a layer or element to edit'
              )}
            </div>
          </div>
        </div>

        {/* Right: Layer Hierarchy & Element Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Swiss Alignment Action Bar (Active when an element is selected) */}
          {selectedElement && !selectedElement.locked && (
            <div className="bg-[#111216] border border-sky-500/30 rounded-xl p-4 shadow-md bg-gradient-to-r from-sky-950/20 to-neutral-900/60">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Columns className="w-3.5 h-3.5 text-sky-400" />
                  <span>Swiss Grid Snapping &amp; Alignment</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Instant Millimeter Snap</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                <button
                  onClick={alignToLeftMargin}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Snap X to Left Margin (48mm)"
                >
                  <AlignLeft className="w-3.5 h-3.5 text-sky-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">Margin L</span>
                  <span className="text-[9px] font-mono text-neutral-500">48mm</span>
                </button>

                <button
                  onClick={alignToCenterX}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Center horizontally on canvas"
                >
                  <AlignCenter className="w-3.5 h-3.5 text-sky-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">Center</span>
                  <span className="text-[9px] font-mono text-neutral-500">297mm</span>
                </button>

                <button
                  onClick={alignToRightMargin}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Snap right edge to right margin (546mm)"
                >
                  <AlignRight className="w-3.5 h-3.5 text-sky-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">Margin R</span>
                  <span className="text-[9px] font-mono text-neutral-500">546mm</span>
                </button>

                <button
                  onClick={alignToTopMargin}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Snap Y to top margin (48mm)"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">Top Safe</span>
                  <span className="text-[9px] font-mono text-neutral-500">48mm</span>
                </button>

                <button
                  onClick={spanThreeColumns}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Set width to 3 Swiss columns (245mm)"
                >
                  <Columns className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">3 Cols</span>
                  <span className="text-[9px] font-mono text-neutral-500">245mm</span>
                </button>

                <button
                  onClick={spanFullContentWidth}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800 transition-colors text-center"
                  title="Span entire content zone from 48mm to 546mm"
                >
                  <Maximize className="w-3.5 h-3.5 text-purple-400 mb-0.5" />
                  <span className="text-[10px] text-neutral-300 font-medium">Full Grid</span>
                  <span className="text-[9px] font-mono text-neutral-500">498mm</span>
                </button>
              </div>
            </div>
          )}

          {/* Layer Elements Tree */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Layer Hierarchy &amp; Assets</h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {currentSpec.elements.length} Elements
              </span>
            </div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {currentSpec.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                const isHovered = el.id === hoveredElementId;
                const roleStyle = getRoleStyle(el.role);

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    onMouseEnter={() => setHoveredElementId(el.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-neutral-800/90 text-sky-200 font-semibold border-sky-500/70 shadow-sm'
                        : isHovered
                        ? 'bg-neutral-800/50 text-neutral-100 border-neutral-700'
                        : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {/* Color-coded role badge */}
                      <span
                        className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleStyle.badge}`}
                      >
                        {roleStyle.icon}
                        <span>{roleStyle.label}</span>
                      </span>
                      <span className="truncate font-medium">{el.id}</span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {Math.round(el.x)}·{Math.round(el.y)}
                      </span>

                      {el.locked ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          <span>LOCKED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400/80 font-mono">
                          EDIT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Element Property Inspector */}
          {selectedElement ? (
            <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <span>{selectedElement.id}</span>
                  </h3>
                  <div className="text-[11px] font-mono text-sky-400 mt-0.5">
                    Role: {selectedElement.role} · Type: {selectedElement.type}
                  </div>
                </div>

                {selectedElement.locked ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 text-[10px] font-mono text-amber-300">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>BRAND INTEGRITY LOCK</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-mono text-emerald-300">
                    Free to Edit
                  </span>
                )}
              </div>

              {selectedElement.locked && (
                <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-800/50 text-[11px] text-amber-200 flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    This asset is protected by Brand Integrity rules. Direct redraw or geometry modification is locked
                    to prevent brand distortion.
                  </span>
                </div>
              )}

              {/* Geometry (X, Y, Width, Height) in mm with steppers */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-sky-400" />
                    <span>Coordinates &amp; Dimensions (mm)</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">A1 Safe Grid: 48-546mm</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* X Position */}
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>X Position</span>
                      <span className="font-mono text-sky-400">{selectedElement.x} mm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        disabled={selectedElement.locked}
                        value={selectedElement.x}
                        onChange={(e) => handleUpdateElementProperty('x', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#111216] border border-neutral-700 rounded px-2 py-1 text-neutral-100 font-mono text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
                      />
                      {!selectedElement.locked && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => handleUpdateElementProperty('x', Math.max(0, selectedElement.x - 5))}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateElementProperty('x', selectedElement.x + 5)}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            +5
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Y Position */}
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>Y Position</span>
                      <span className="font-mono text-sky-400">{selectedElement.y} mm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        disabled={selectedElement.locked}
                        value={selectedElement.y}
                        onChange={(e) => handleUpdateElementProperty('y', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#111216] border border-neutral-700 rounded px-2 py-1 text-neutral-100 font-mono text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
                      />
                      {!selectedElement.locked && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => handleUpdateElementProperty('y', Math.max(0, selectedElement.y - 5))}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateElementProperty('y', selectedElement.y + 5)}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            +5
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Width */}
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>Width</span>
                      <span className="font-mono text-sky-400">{selectedElement.width} mm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        disabled={selectedElement.locked}
                        value={selectedElement.width}
                        onChange={(e) => handleUpdateElementProperty('width', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#111216] border border-neutral-700 rounded px-2 py-1 text-neutral-100 font-mono text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
                      />
                      {!selectedElement.locked && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => handleUpdateElementProperty('width', Math.max(10, selectedElement.width - 5))}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateElementProperty('width', selectedElement.width + 5)}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            +5
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Height */}
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>Height</span>
                      <span className="font-mono text-sky-400">{selectedElement.height} mm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        disabled={selectedElement.locked}
                        value={selectedElement.height}
                        onChange={(e) => handleUpdateElementProperty('height', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#111216] border border-neutral-700 rounded px-2 py-1 text-neutral-100 font-mono text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
                      />
                      {!selectedElement.locked && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => handleUpdateElementProperty('height', Math.max(5, selectedElement.height - 5))}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateElementProperty('height', selectedElement.height + 5)}
                            className="px-1.5 py-1 text-[10px] font-mono bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded"
                          >
                            +5
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Properties if element type is text */}
              {selectedElement.type === 'text' && (
                <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
                  <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-sky-400" />
                    <span>Typography &amp; Copywriting</span>
                  </span>

                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Text Content</label>
                    <textarea
                      rows={3}
                      value={selectedElement.content || ''}
                      onChange={(e) => handleUpdateElementProperty('content', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400">Font Size (pt)</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize || 16}
                        onChange={(e) =>
                          handleUpdateElementProperty('fontSize', parseFloat(e.target.value) || 12)
                        }
                        className="w-full bg-neutral-900 border border-neutral-700/80 rounded p-2 text-neutral-100 focus:outline-none focus:border-sky-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400">Line Height</label>
                      <input
                        type="number"
                        value={selectedElement.lineHeight || 20}
                        onChange={(e) =>
                          handleUpdateElementProperty('lineHeight', parseFloat(e.target.value) || 16)
                        }
                        className="w-full bg-neutral-900 border border-neutral-700/80 rounded p-2 text-neutral-100 focus:outline-none focus:border-sky-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400">Font Family</label>
                    <select
                      value={selectedElement.fontFamily}
                      onChange={(e) => handleUpdateElementProperty('fontFamily', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded p-2 text-neutral-200 focus:outline-none focus:border-sky-500 text-xs"
                    >
                      <option value="'Outfit', 'Plus Jakarta Sans', sans-serif">
                        Outfit (Display Headline Sans)
                      </option>
                      <option value="'Plus Jakarta Sans', sans-serif">
                        Plus Jakarta Sans (Body Prose)
                      </option>
                      <option value="'JetBrains Mono', monospace">
                        JetBrains Mono (Data &amp; Codes)
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Color & Quick Palette Swatches */}
              <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-sky-400" />
                  <span>Color &amp; Appearance</span>
                </span>

                {/* Quick Swatches Bar */}
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">
                    Quick Brand Palette Swatches
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickPalette.map((p) => {
                      const isActive = selectedElement.fill?.toLowerCase() === p.color.toLowerCase();
                      return (
                        <button
                          key={p.color}
                          onClick={() => handleUpdateElementProperty('fill', p.color)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            isActive
                              ? 'border-sky-400 scale-110 shadow-sm shadow-sky-500/50'
                              : 'border-neutral-700 hover:border-neutral-500 hover:scale-105'
                          }`}
                          style={{ backgroundColor: p.color }}
                          title={`${p.label} (${p.color})`}
                        >
                          {isActive && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                p.color === '#ffffff' ? 'text-black' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-neutral-400 block mb-1">Custom Hex Fill</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={
                          selectedElement.fill?.startsWith('#') ? selectedElement.fill : '#ffffff'
                        }
                        onChange={(e) => handleUpdateElementProperty('fill', e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.fill || ''}
                        onChange={(e) => handleUpdateElementProperty('fill', e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded p-1.5 text-xs text-neutral-100 font-mono focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 bg-[#111216] border border-neutral-800/80 rounded-xl">
              Select an element from the Layer Tree to edit its properties.
            </div>
          )}
        </div>
      </div>

      {/* Save Revision Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-100">Commit Artwork Revision</h3>
            <p className="text-xs text-neutral-400">
              Save a permanent snapshot of the current vector layout into the project history.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Change Summary / Release Note
              </label>
              <textarea
                rows={3}
                value={revisionSummary}
                onChange={(e) => setRevisionSummary(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRevision}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm"
              >
                Save as Revision #{revisionCount + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
