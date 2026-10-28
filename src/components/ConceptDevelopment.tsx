import React, { useState } from 'react';
import { ConceptDirection } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Layers, Eye } from 'lucide-react';

interface ConceptDevelopmentProps {
  concepts: ConceptDirection[];
  selectedConceptId?: string;
  onSelectConcept: (conceptId: string) => void;
  onGenerateConcepts: () => void;
  isGenerating: boolean;
}

export const ConceptDevelopment: React.FC<ConceptDevelopmentProps> = ({
  concepts,
  selectedConceptId,
  onSelectConcept,
  onGenerateConcepts,
  isGenerating,
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    selectedConceptId || concepts[0]?.id || ''
  );

  const activeConcept = concepts.find((c) => c.id === activeTabId) || concepts[0];

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Strategic Art Direction &amp; Concept Development</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Creative Concepts &amp; Visual Strategies</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Compare 3 distinct creative concepts derived from the creative brief and reference design principles.
              Select the active concept to drive layout construction and prompt generation.
            </p>
          </div>

          <button
            onClick={onGenerateConcepts}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Directions...' : 'Regenerate 3 Concepts'}</span>
          </button>
        </div>
      </div>

      {/* Concept Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.map((concept, index) => {
          const isSelected = concept.id === selectedConceptId;
          const isViewing = concept.id === activeConcept?.id;

          return (
            <div
              key={concept.id}
              onClick={() => setActiveTabId(concept.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isViewing
                  ? 'bg-neutral-900 border-sky-500/80 shadow-md'
                  : 'bg-[#111216] border-neutral-800/80 hover:border-neutral-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono text-neutral-400">Direction 0{index + 1}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    SELECTED
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-neutral-100 mt-2">{concept.name}</h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{concept.coreCreativeIdea}</p>

              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">
                  {concept.readingSequence?.length || 4} Sequence Steps
                </span>
                {isSelected ? (
                  <span className="text-emerald-400 font-semibold text-[11px]">Active in Artwork</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectConcept(concept.id);
                      setActiveTabId(concept.id);
                    }}
                    className="text-sky-400 hover:text-sky-300 font-medium text-[11px]"
                  >
                    Select this Direction
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Strategy Breakdown */}
      {activeConcept && (
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800/80 gap-4">
            <div>
              <div className="text-xs font-mono text-sky-400">CONCEPT SPECIFICATION DOSSIER</div>
              <h3 className="text-lg font-bold text-neutral-100">{activeConcept.name}</h3>
            </div>

            {activeConcept.id !== selectedConceptId ? (
              <button
                onClick={() => onSelectConcept(activeConcept.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Select &amp; Apply to Artwork</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Currently active design direction</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Core Idea & Communication Rationale */}
            <div className="space-y-4">
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Core Creative Idea</h4>
                <p className="text-neutral-300 leading-relaxed">{activeConcept.coreCreativeIdea}</p>
              </div>

              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Communication Rationale</h4>
                <p className="text-neutral-300 leading-relaxed">{activeConcept.communicationRationale}</p>
              </div>

              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Visual Metaphor &amp; Focal Point</h4>
                <div className="space-y-1 text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Metaphor:</span> {activeConcept.visualMetaphor}
                  </div>
                  <div>
                    <span className="text-neutral-400">Focal Point:</span> {activeConcept.focalPoint}
                  </div>
                  <div>
                    <span className="text-neutral-400">Composition:</span> {activeConcept.composition}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography, Color, and Reading Sequence */}
            <div className="space-y-4">
              {/* Reading Sequence */}
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Reading Sequence (Eye Path)</h4>
                <div className="space-y-1.5">
                  {activeConcept.readingSequence?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-neutral-300">
                      <span className="w-5 h-5 rounded-full bg-neutral-800 text-[10px] font-mono flex items-center justify-center text-sky-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Direction */}
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Typography Architecture</h4>
                <div className="space-y-1 text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Display Face:</span>{' '}
                    <strong className="text-neutral-100">{activeConcept.typographyDirection?.displayFace}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Body Face:</span>{' '}
                    <strong className="text-neutral-100">{activeConcept.typographyDirection?.bodyFace}</strong>
                  </div>
                  <p className="text-neutral-400 text-[11px] pt-1">
                    {activeConcept.typographyDirection?.hierarchyRationale}
                  </p>
                </div>
              </div>

              {/* Color Strategy */}
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800/60 space-y-2">
                <h4 className="font-semibold text-neutral-200">Color Palette &amp; Contrast Distribution</h4>
                <div className="space-y-1 text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Dominant Canvas:</span>{' '}
                    {activeConcept.colourDirection?.dominant}
                  </div>
                  <div>
                    <span className="text-neutral-400">Accent Focus:</span>{' '}
                    <span className="text-sky-400">{activeConcept.colourDirection?.accent}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pt-1">{activeConcept.colourDirection?.rationale}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrowed Reference Principles, Strengths & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800 text-xs">
            <div className="space-y-1.5">
              <h5 className="font-bold text-neutral-200">Borrowed Principles</h5>
              <ul className="space-y-1 text-neutral-400 text-[11px]">
                {activeConcept.referencePrinciplesUsed?.map((p, i) => (
                  <li key={i}>▪ {p}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-emerald-400">Strategic Strengths</h5>
              <ul className="space-y-1 text-neutral-300 text-[11px]">
                {activeConcept.strengths?.map((s, i) => (
                  <li key={i}>✔ {s}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-amber-400">Production Risks &amp; Checks</h5>
              <ul className="space-y-1 text-neutral-400 text-[11px]">
                {activeConcept.risks?.map((r, i) => (
                  <li key={i}>⚠ {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
