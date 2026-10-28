import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Download,
  Upload,
  Check,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
  Sliders,
  Maximize2,
  ArrowRight,
  Palette,
  Shield,
  FileCheck,
} from 'lucide-react';
import { BrandAsset } from '../types';

interface ImageStudioViewProps {
  clientBrand: string;
  onApplyAsBackground: (svgOrImageUrl: string) => void;
  onSaveToBrandAssets: (asset: BrandAsset) => void;
}

interface GeneratedImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  modelUsed: string;
  aspectRatio: string;
  createdAt: string;
  isEditMode?: boolean;
}

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({
  clientBrand,
  onApplyAsBackground,
  onSaveToBrandAssets,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-3.1-flash-lite-image');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImageItem | null>(null);

  const [history, setHistory] = useState<GeneratedImageItem[]>([
    {
      id: 'img-default-1',
      prompt: `Atmospheric micro-particle aerosol mist for ${clientBrand} in dark slate void`,
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
          <defs>
            <radialGradient id="mist" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.35"/>
              <stop offset="60%" stop-color="#0f172a" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#090a0f" stop-opacity="1"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="#090a0f"/>
          <rect width="1000" height="1000" fill="url(#mist)"/>
          <circle cx="500" cy="450" r="160" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.4"/>
          <circle cx="500" cy="450" r="12" fill="#38bdf8" opacity="0.6"/>
          <circle cx="460" cy="420" r="4" fill="#38bdf8" opacity="0.8"/>
          <circle cx="540" cy="470" r="6" fill="#38bdf8" opacity="0.5"/>
          <circle cx="520" cy="390" r="5" fill="#38bdf8" opacity="0.7"/>
          <circle cx="430" cy="480" r="3.5" fill="#38bdf8" opacity="0.6"/>
          <circle cx="570" cy="420" r="4.5" fill="#38bdf8" opacity="0.5"/>
        </svg>
      `)}`,
      modelUsed: 'gemini-3.1-flash-lite-image',
      aspectRatio: '1:1',
      createdAt: new Date().toISOString(),
    },
  ]);

  const presetThemes = [
    {
      label: 'Micro-Particle Aerosol Mist',
      prompt: `Commercial pharmaceutical studio macro photography of clean cyan micro-particle aerosol dispersion on deep matte slate background, clinical rim illumination, hyper-detailed, no text`,
      aspectRatio: '3:4',
    },
    {
      label: 'Swiss Architectural Grid',
      prompt: `Precision Swiss modernist graphic architecture, hairline subtle dark cyan grid coordinate lines on #090a0f deep slate canvas, minimalist clinical engineering layout backdrop, no text`,
      aspectRatio: '1:1',
    },
    {
      label: 'Luminescent Alveolar Flow',
      prompt: `Scientific 3D visualization of aerodynamic laminar airflow pathways through healthy pulmonary bronchial structures, glowing translucent cyan curves against dark slate, high contrast`,
      aspectRatio: '16:9',
    },
    {
      label: 'Clinical Studio Pedestal',
      prompt: `Dark minimalist podium pedestal in medical laboratory studio, subtle cyan accent lighting halo from below, pristine matte materials, luxury pharmaceutical display aesthetic, zero clutter`,
      aspectRatio: '1:1',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageBase64(reader.result as string);
      setMode('edit');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateOrEdit = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setStatusMessage(mode === 'edit' ? 'Editing image with AI instructions...' : 'Generating image asset...');

    try {
      const res = await fetch('/api/ai/image-create-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          inputImageBase64: mode === 'edit' ? uploadedImageBase64 : undefined,
          aspectRatio,
          editMode: mode === 'edit',
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const newItem: GeneratedImageItem = {
          id: `gen-${Date.now()}`,
          prompt: prompt.trim(),
          imageUrl: data.imageUrl,
          modelUsed: data.modelUsed || model,
          aspectRatio,
          createdAt: new Date().toISOString(),
          isEditMode: mode === 'edit',
        };
        setHistory((prev) => [newItem, ...prev]);
        setSelectedImage(newItem);
        setStatusMessage('Asset successfully generated!');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err: any) {
      console.warn('Image generation error, generating procedural vector asset:', err);
      // Fallback procedural generation
      const proceduralSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
        <defs>
          <radialGradient id="haloFallback" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.4"/>
            <stop offset="60%" stop-color="#0f172a" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#090a0f" stop-opacity="1"/>
          </radialGradient>
        </defs>
        <rect width="1000" height="1000" fill="#090a0f"/>
        <rect width="1000" height="1000" fill="url(#haloFallback)"/>
        <ellipse cx="500" cy="720" rx="300" ry="40" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
        <circle cx="500" cy="450" r="140" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
        <circle cx="500" cy="450" r="80" fill="#38bdf8" opacity="0.15"/>
        <text x="500" y="455" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">${clientBrand.toUpperCase()}</text>
        <text x="500" y="485" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#94a3b8" text-anchor="middle">${prompt.slice(0, 36)}</text>
      </svg>`;

      const fallbackItem: GeneratedImageItem = {
        id: `gen-${Date.now()}`,
        prompt: prompt.trim(),
        imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(proceduralSvg)}`,
        modelUsed: 'procedural-vector-engine',
        aspectRatio,
        createdAt: new Date().toISOString(),
        isEditMode: mode === 'edit',
      };
      setHistory((prev) => [fallbackItem, ...prev]);
      setSelectedImage(fallbackItem);
      setStatusMessage('Procedural vector graphic synthesized.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleApplyToCanvas = (item: GeneratedImageItem) => {
    onApplyAsBackground(item.imageUrl);
    setStatusMessage('Applied as background layer in Artwork Editor!');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleSaveAsset = (item: GeneratedImageItem) => {
    const newAsset: BrandAsset = {
      id: `asset-${Date.now()}`,
      name: item.prompt.slice(0, 32) || 'Generated Asset',
      filename: `generated-${item.id}.svg`,
      fileUrl: item.imageUrl,
      fileType: item.imageUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png',
      type: 'photo',
      integrityRule: 'EDITABLE',
      notes: `Generated via ${item.modelUsed}. Aspect ratio: ${item.aspectRatio}`,
    };
    onSaveToBrandAssets(newAsset);
    setStatusMessage('Saved to Brand Asset Library!');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleDownload = (item: GeneratedImageItem) => {
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.download = `creative-architect-asset-${item.id}.${item.imageUrl.startsWith('data:image/svg') ? 'svg' : 'png'}`;
    a.click();
  };

  const currentPreview = selectedImage || history[0];

  return (
    <div className="flex-1 max-w-[1720px] w-full mx-auto p-6 flex flex-col gap-6">
      {/* Header and Control Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                Create & Edit Images Studio
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  {model}
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Generate high-resolution visual backdrops and edit imagery with natural language instructions
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector and Model Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode toggle */}
          <div className="flex bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setMode('create')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'create'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'edit'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Edit Image
            </button>
          </div>

          {/* Model selector */}
          <div className="flex items-center gap-2 bg-neutral-950/70 border border-neutral-800 rounded-lg px-3 py-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Model:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.1-flash-lite-image" className="bg-neutral-900 text-neutral-200">
                gemini-3.1-flash-lite-image (Default)
              </option>
              <option value="gemini-nano-banana-2.1" className="bg-neutral-900 text-neutral-200">
                gemini-nano-banana-2.1 (Fast Generator)
              </option>
              <option value="procedural-vector-engine" className="bg-neutral-900 text-neutral-200">
                Procedural Vector Engine (Instant SVG)
              </option>
            </select>
          </div>

          {/* Aspect ratio selector */}
          <div className="flex items-center gap-2 bg-neutral-950/70 border border-neutral-800 rounded-lg px-3 py-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Ratio:</span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="1:1" className="bg-neutral-900 text-neutral-200">1:1 Square</option>
              <option value="3:4" className="bg-neutral-900 text-neutral-200">3:4 Poster</option>
              <option value="4:3" className="bg-neutral-900 text-neutral-200">4:3 Landscape</option>
              <option value="16:9" className="bg-neutral-900 text-neutral-200">16:9 Widescreen</option>
              <option value="9:16" className="bg-neutral-900 text-neutral-200">9:16 Vertical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Panel: 5 columns */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Input Panel */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              {mode === 'edit' ? 'Edit Existing Image' : 'Generate Visual Asset'}
            </h2>

            {mode === 'edit' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-300 font-medium">Input Base Image:</label>
                <div className="border-2 border-dashed border-neutral-700 rounded-lg p-4 text-center hover:border-neutral-500 transition-colors bg-neutral-950/50">
                  {uploadedImageBase64 ? (
                    <div className="flex items-center justify-between gap-3">
                      <img
                        src={uploadedImageBase64}
                        alt="Base preview"
                        className="w-14 h-14 object-cover rounded border border-neutral-700"
                      />
                      <div className="flex-1 text-left">
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Base image loaded
                        </span>
                        <p className="text-[11px] text-neutral-500">Ready for AI instruction edits</p>
                      </div>
                      <label className="px-2.5 py-1 text-[11px] font-medium text-neutral-300 bg-neutral-800 rounded hover:bg-neutral-700 cursor-pointer">
                        Replace
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-2">
                      <Upload className="w-6 h-6 text-neutral-500" />
                      <span className="text-xs text-neutral-300 font-medium">Upload image to edit</span>
                      <span className="text-[11px] text-neutral-500">Supports PNG, JPG, WebP, SVG</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Prompt input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-300 font-medium">
                {mode === 'edit' ? 'Edit Instruction Prompt:' : 'Visual Asset Description:'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'edit'
                    ? 'e.g., "Add subtle micro-particle aerosol haze around the canister and shift background lighting to clinical deep slate"'
                    : 'e.g., "Atmospheric micro-particle aerosol mist for Aerovant on dark slate void with cyan rim lighting, commercial studio quality"'
                }
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateOrEdit}
              disabled={!prompt.trim() || isGenerating || (mode === 'edit' && !uploadedImageBase64)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 text-white font-medium text-xs hover:bg-sky-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-sky-950"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with {model}...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{mode === 'edit' ? 'Apply AI Image Edits' : 'Generate Visual Asset'}</span>
                </>
              )}
            </button>

            {statusMessage && (
              <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Preset Prompts Panel */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Swiss & Healthcare Asset Presets
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {presetThemes.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    setAspectRatio(preset.aspectRatio);
                    setMode('create');
                  }}
                  className="flex flex-col items-start gap-1 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors">
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                      {preset.aspectRatio}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Preview & Asset History: 7 columns */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Active Canvas / Preview Card */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  Active Asset Preview
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {currentPreview.prompt.slice(0, 60)}...
                </p>
              </div>

              {/* Actions on Active Asset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApplyToCanvas(currentPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-500 transition-colors shadow-sm shadow-sky-950"
                  title="Insert this image into the A1 Artwork Editor canvas"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Apply to Artwork</span>
                </button>

                <button
                  onClick={() => handleSaveAsset(currentPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700 border border-neutral-700 transition-colors"
                  title="Save to Brand Asset Library"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save to Assets</span>
                </button>

                <button
                  onClick={() => handleDownload(currentPreview)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Display Window */}
            <div className="w-full bg-[#07080b] rounded-lg border border-neutral-800/80 p-4 flex items-center justify-center min-h-[360px] overflow-hidden">
              <div className="max-w-[480px] w-full rounded-md shadow-2xl border border-neutral-800 overflow-hidden flex items-center justify-center">
                <img
                  src={currentPreview.imageUrl}
                  alt={currentPreview.prompt}
                  className="w-full h-auto max-h-[460px] object-contain"
                />
              </div>
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-sky-400">
                  Model: {currentPreview.modelUsed}
                </span>
                <span>·</span>
                <span className="text-[11px]">Ratio: {currentPreview.aspectRatio}</span>
                {currentPreview.isEditMode && (
                  <>
                    <span>·</span>
                    <span className="text-amber-400 text-[11px] font-medium">Edited Asset</span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-neutral-500">
                {new Date(currentPreview.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Generated Asset Gallery */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Studio Session Asset Library ({history.length})</span>
              <span className="text-[11px] text-neutral-500 lowercase">Click to inspect or apply</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {history.map((item) => {
                const isSelected = selectedImage?.id === item.id || (!selectedImage && history[0].id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all aspect-square bg-[#07080b] group ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-500/20'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 text-[10px] text-neutral-300">
                      <p className="truncate font-medium">{item.prompt}</p>
                      <span className="text-neutral-500 font-mono text-[9px]">{item.modelUsed}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
