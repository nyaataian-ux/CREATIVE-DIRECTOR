import React, { useState } from 'react';
import { ReferenceItem, DesignPrinciple } from '../types';
import {
  Upload,
  Sparkles,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ReferenceLibraryProps {
  references: ReferenceItem[];
  onUploadReference: (file: File, category: string, notes: string) => Promise<void>;
  onAnalyzeReference: (referenceId: string) => Promise<void>;
  onToggleReferenceSelection: (referenceId: string) => void;
  onRateReference: (referenceId: string, rating: number) => void;
  isAnalyzing: boolean;
}

export const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({
  references,
  onUploadReference,
  onAnalyzeReference,
  onToggleReferenceSelection,
  onRateReference,
  isAnalyzing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRefId, setActiveRefId] = useState<string>(references[0]?.id || '');
  const [uploadCategory, setUploadCategory] = useState<string>('Healthcare Poster');
  const [uploadNotes, setUploadNotes] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeRef = references.find((r) => r.id === activeRefId) || references[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload PNG, JPG, WebP, SVG, or PDF.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size exceeds 20MB limit.');
      return;
    }

    try {
      await onUploadReference(file, uploadCategory, uploadNotes);
      setUploadNotes('');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    }
  };

  const filteredReferences = references.filter((ref) => {
    const matchesCat = selectedCategory === 'all' || ref.category === selectedCategory;
    const matchesSearch =
      ref.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.analysis?.principles.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header & Upload Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Multimodal Reference Intelligence Engine</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Reference Library &amp; Design Principles</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Inspect supplied artwork references, extract reusable layout and typographic principles using Gemini
              multimodal analysis, and guide the creative director with verified design precedents.
            </p>
          </div>

          {/* Upload Button Form */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Upload New Reference</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Main Split: Reference List & Detailed 8-Point Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reference Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2 bg-[#111216] border border-neutral-800/80 rounded-xl p-3">
            <Search className="w-4 h-4 text-neutral-400 ml-1" />
            <input
              type="text"
              placeholder="Search references or principles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none w-full"
            />
          </div>

          {/* Reference Cards */}
          <div className="space-y-3">
            {filteredReferences.map((ref) => {
              const isSelectedForProject = ref.selectedForProject;
              const isCurrent = ref.id === activeRef?.id;

              return (
                <div
                  key={ref.id}
                  onClick={() => setActiveRefId(ref.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-900 border-sky-500/60 shadow-lg'
                      : 'bg-[#111216] border-neutral-800/80 hover:border-neutral-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-100">{ref.filename}</span>
                        <span className="text-[11px] text-neutral-400">· {ref.category}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{ref.userNotes}</p>
                    </div>

                    <label
                      className="flex items-center gap-1.5 text-[11px] text-neutral-400 cursor-pointer select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelectedForProject}
                        onChange={() => onToggleReferenceSelection(ref.id)}
                        className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  {/* Principles Tags */}
                  {ref.analysis && (
                    <div className="mt-3 pt-3 border-t border-neutral-800/60 flex flex-wrap gap-2 text-[11px] text-neutral-400">
                      {ref.analysis.principles.map((p) => (
                        <span key={p.id} className="text-neutral-300">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions & Rating */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRateReference(ref.id, star);
                          }}
                          className={`p-0.5 ${(ref.analysis?.rating || 0) >= star ? 'text-amber-400' : 'text-neutral-600 hover:text-neutral-400'}`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyzeReference(ref.id);
                      }}
                      disabled={isAnalyzing}
                      className="flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{ref.analysis ? 'Re-run Analysis' : 'Analyze with Gemini'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 8-Point Structured Analysis Dossier (7 cols) */}
        <div className="lg:col-span-7 bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-6">
          {activeRef ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800/80 gap-3">
                <div>
                  <div className="text-xs font-mono text-sky-400">REFERENCE INTELLIGENCE RECORD</div>
                  <h3 className="text-lg font-bold text-neutral-100">{activeRef.filename}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAnalyzeReference(activeRef.id)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Reference'}</span>
                  </button>
                </div>
              </div>

              {activeRef.analysis ? (
                <div className="space-y-6 text-xs">
                  {/* A. Metadata */}
                  <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                    <h4 className="font-semibold text-neutral-200">A. Reference Metadata</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-neutral-400">Artwork Type:</span>{' '}
                        <span className="text-neutral-200">{activeRef.analysis.artworkType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Aspect Ratio:</span>{' '}
                        <span className="text-neutral-200">{activeRef.analysis.aspectRatio}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Audience:</span>{' '}
                        <span className="text-neutral-200">{activeRef.analysis.intendedAudience}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-neutral-400">Communication Objective:</span>{' '}
                        <span className="text-neutral-200">{activeRef.analysis.communicationObjective}</span>
                      </div>
                    </div>
                  </div>

                  {/* B. Composition & Grid */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-neutral-200">B. Composition &amp; Grid Strategy</h4>
                    <ul className="space-y-1.5">
                      {activeRef.analysis.observations.composition.map((obs, i) => (
                        <li key={i} className="text-neutral-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-sky-400">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* C. Typography Scale & Hierarchy */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-neutral-200">C. Typographic Architecture</h4>
                    <ul className="space-y-1.5">
                      {activeRef.analysis.observations.typography.map((obs, i) => (
                        <li key={i} className="text-neutral-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-sky-400">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* D. Colour Strategy (Labeled as Estimates) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-neutral-200">D. Colour System &amp; Palette</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">Estimated values</span>
                    </div>
                    <ul className="space-y-1.5">
                      {activeRef.analysis.observations.colour.map((obs, i) => (
                        <li key={i} className="text-neutral-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-sky-400">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* H. Reusable Design Principles */}
                  <div className="space-y-3 pt-3 border-t border-neutral-800">
                    <h4 className="font-semibold text-neutral-200">
                      H. Extracted Reusable Design Principles
                    </h4>
                    <div className="space-y-3">
                      {activeRef.analysis.principles.map((principle) => (
                        <div
                          key={principle.id}
                          className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-400">{principle.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Confidence: {principle.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-200">{principle.description}</p>
                          <div className="pt-2 text-[11px] text-neutral-400 space-y-0.5">
                            <div>
                              <strong className="text-neutral-300">Application:</strong> {principle.application}
                            </div>
                            <div>
                              <strong className="text-neutral-300">Limitations:</strong> {principle.limitations}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
                  <div className="text-sm font-medium text-neutral-300">No Analysis Yet</div>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Run the multimodal Gemini analysis engine on this reference to unpack its 8-point design schema.
                  </p>
                  <button
                    onClick={() => onAnalyzeReference(activeRef.id)}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-500 transition-colors"
                  >
                    Analyze Reference
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center text-xs text-neutral-400">Select a reference file to view its analysis dossier.</div>
          )}
        </div>
      </div>
    </div>
  );
};
