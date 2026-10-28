import React, { useState } from 'react';
import { GeneratedVisualAsset, BrandAsset } from '../types';
import { Sparkles, X, Image, Layers, CheckCircle2, Download, Plus } from 'lucide-react';

interface AIVisualStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientBrand: string;
  onApplyAsBackground: (asset: GeneratedVisualAsset) => void;
  onSaveToBrandAssets: (asset: BrandAsset) => void;
}

export const AIVisualStudioModal: React.FC<AIVisualStudioModalProps> = ({
  isOpen,
  onClose,
  clientBrand,
  onApplyAsBackground,
  onSaveToBrandAssets,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'particles' | 'grid' | 'flow'>('particles');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<GeneratedVisualAsset | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAppliedNotice(null);
    try {
      const res = await fetch('/api/ai/generate-visual-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTheme: selectedTheme,
          projectBrand: clientBrand,
        }),
      });

      const data = await res.json();
      if (data.asset) {
        setGeneratedAsset(data.asset);
      }
    } catch (err) {
      console.error('Visual asset generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyBackground = () => {
    if (!generatedAsset) return;
    onApplyAsBackground(generatedAsset);
    setAppliedNotice('Applied asset as primary artwork background canvas.');
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleSaveToAssets = () => {
    if (!generatedAsset) return;
    const brandAsset: BrandAsset = {
      id: `asset-${Date.now()}`,
      name: generatedAsset.name,
      filename: `${generatedAsset.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
      fileUrl: generatedAsset.fileUrl,
      fileType: 'image/svg+xml',
      type: 'photo',
      integrityRule: 'PLACEMENT_ONLY',
      notes: `Generated via AI Visual Studio for ${clientBrand}`,
      brand: clientBrand,
      usedInElements: [],
    };
    onSaveToBrandAssets(brandAsset);
    setAppliedNotice('Registered visual asset into Brand Asset Library.');
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const themes = [
    {
      id: 'particles' as const,
      name: 'Atmospheric Micro-Particles',
      desc: 'Sub-micron aerosol luminescence with deep obsidian void and studio rim lighting.',
    },
    {
      id: 'grid' as const,
      name: 'Precision Swiss Grid',
      desc: 'Architectural 48mm modular coordinate guidelines and hairline technical markers.',
    },
    {
      id: 'flow' as const,
      name: 'Luminescent Clinical Flow',
      desc: 'Aerodynamic continuous respiratory airflow waves with cyan glow accents.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-2xl w-full space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">AI Visual Studio</h3>
              <p className="text-xs text-neutral-400">
                Synthesize resolution-independent, scalable atmospheric backdrops and technical textures.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-300">
            Select Visual Aesthetic Direction
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedTheme === t.id
                    ? 'bg-neutral-900 border-sky-500 text-sky-400 shadow-md'
                    : 'bg-[#0e1014] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-semibold text-xs text-neutral-200 mb-1">{t.name}</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Vector Backdrop...' : 'Generate Visual Asset'}</span>
          </button>
        </div>

        {/* Result Preview */}
        {generatedAsset && (
          <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200">{generatedAsset.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">1200 × 1600 Vector Asset</span>
            </div>

            <div className="h-44 bg-[#0a0b0d] rounded-lg border border-neutral-800 flex items-center justify-center overflow-hidden">
              <img
                src={generatedAsset.fileUrl}
                alt={generatedAsset.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={handleSaveToAssets}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Brand Assets</span>
              </button>
              <button
                onClick={handleApplyBackground}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply as Artwork Background</span>
              </button>
            </div>
          </div>
        )}

        {appliedNotice && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
