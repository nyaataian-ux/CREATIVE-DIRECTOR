import React, { useState } from 'react';
import { LayoutSpec, LayoutElement, ArtworkRevision } from '../types';
import { generateSvgFromLayout } from '../utils/svgEngine';
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
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [showBleed, setShowBleed] = useState<boolean>(true);
  const [revisionSummary, setRevisionSummary] = useState<string>('Adjusted element positioning and typographic scale');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  React.useEffect(() => {
    setCurrentSpec(layoutSpec);
  }, [layoutSpec]);

  const selectedElement = currentSpec.elements.find((el) => el.id === selectedElementId);

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
    a.download = 'artwork.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Editor Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Vector Artwork Production Engine</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Live SVG Artwork Editor</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Property-based vector editing with millimeter coordinates, lock controls for protected brand assets, and
              instant SVG synthesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 mr-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-1.5 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 rounded"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 rounded"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {onAutoBalance && (
              <button
                onClick={onAutoBalance}
                disabled={isOptimizing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/80 hover:bg-sky-900/60 rounded-lg transition-colors shadow-sm disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{isOptimizing ? 'Balancing...' : 'AI Auto-Balance'}</span>
              </button>
            )}

            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 rounded-lg transition-colors"
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
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Revision</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Artwork revision saved to project history.</span>
          </div>
        )}
      </div>

      {/* Editor Split: Canvas & Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#111216] border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col">
          {/* Canvas Controls */}
          <div className="px-5 py-3 border-b border-neutral-800/80 bg-[#14151a] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="font-medium text-neutral-200">Canvas</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">594 × 841 mm (A1)</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBleed}
                  onChange={(e) => setShowBleed(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Bleed Overlay (3mm)</span>
              </label>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
                  className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono text-neutral-300 w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                  className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(0.85)}
                  className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded ml-1"
                  title="Fit Canvas"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="p-8 bg-[#0a0b0d] flex items-center justify-center overflow-auto min-h-[720px] max-h-[880px]">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.12s ease-out',
              }}
              className="relative shadow-2xl shadow-black border border-neutral-800/90 bg-[#090a0f] rounded-sm shrink-0"
            >
              {showBleed && (
                <div
                  className="absolute inset-0 pointer-events-none border border-dashed border-sky-500/30 z-20"
                  style={{ margin: '8px' }}
                />
              )}

              {/* Selection bounding box indicator for current element */}
              {selectedElement && (
                <div
                  className="absolute border border-sky-400/80 bg-sky-500/10 pointer-events-none z-10 transition-all"
                  style={{
                    left: `${selectedElement.x}px`,
                    top: `${selectedElement.y}px`,
                    width: `${selectedElement.width}px`,
                    height: `${selectedElement.height}px`,
                  }}
                />
              )}

              <div
                className="w-[594px] h-[841px] flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: liveSvg }}
              />
            </div>
          </div>
        </div>

        {/* Right: Layer Hierarchy & Element Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Layer Elements Tree */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Layer Tree &amp; Elements</h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {currentSpec.elements.length} Elements
              </span>
            </div>

            <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
              {currentSpec.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-800 text-sky-300 font-semibold border border-neutral-700'
                        : 'bg-neutral-900/50 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        [{el.type}]
                      </span>
                      <span className="truncate">{el.id}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {el.locked ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <Lock className="w-3 h-3" />
                          <span>LOCKED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400">EDITABLE</span>
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
                  <h3 className="text-sm font-bold text-neutral-100">Element Properties</h3>
                  <div className="text-[11px] font-mono text-sky-400">
                    ID: {selectedElement.id} · Role: {selectedElement.role}
                  </div>
                </div>

                {selectedElement.locked ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-mono text-emerald-300">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>PROTECTED ASSET</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 text-[10px]">
                    Free to Edit
                  </span>
                )}
              </div>

              {selectedElement.locked && (
                <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 text-[11px] text-neutral-300 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    This asset is protected by Brand Integrity rules. Direct redraw or geometry modification is locked
                    to prevent brand distortion.
                  </span>
                </div>
              )}

              {/* Geometry (X, Y, Width, Height) in mm */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Position &amp; Dimensions (mm)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">X Position (mm)</label>
                    <input
                      type="number"
                      disabled={selectedElement.locked}
                      value={selectedElement.x}
                      onChange={(e) => handleUpdateElementProperty('x', parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Y Position (mm)</label>
                    <input
                      type="number"
                      disabled={selectedElement.locked}
                      value={selectedElement.y}
                      onChange={(e) => handleUpdateElementProperty('y', parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Width (mm)</label>
                    <input
                      type="number"
                      disabled={selectedElement.locked}
                      value={selectedElement.width}
                      onChange={(e) => handleUpdateElementProperty('width', parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Height (mm)</label>
                    <input
                      type="number"
                      disabled={selectedElement.locked}
                      value={selectedElement.height}
                      onChange={(e) => handleUpdateElementProperty('height', parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Text Properties if element type is text */}
              {selectedElement.type === 'text' && (
                <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Typography &amp; Copy Content</span>
                  </span>

                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Text Content</label>
                    <textarea
                      rows={4}
                      value={selectedElement.content || ''}
                      onChange={(e) => handleUpdateElementProperty('content', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2.5 text-neutral-100 focus:outline-none font-sans"
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
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none"
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
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400">Font Family</label>
                    <select
                      value={selectedElement.fontFamily}
                      onChange={(e) => handleUpdateElementProperty('fontFamily', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-300 focus:outline-none"
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

              {/* Color & Styling */}
              <div className="space-y-2 pt-3 border-t border-neutral-800 text-xs">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Color &amp; Appearance</span>
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-neutral-400 block mb-1">Fill Color</label>
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
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 font-mono"
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
          <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4">
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
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none"
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
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
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
