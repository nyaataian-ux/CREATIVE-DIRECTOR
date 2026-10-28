import React, { useState } from 'react';
import { ProjectPrompt, ProjectData } from '../types';
import {
  Sparkles,
  Copy,
  Download,
  Check,
  Save,
  Code,
  Image,
  Layers,
  FileText,
} from 'lucide-react';

interface PromptStudioProps {
  prompt: ProjectPrompt;
  project: ProjectData;
  onUpdatePrompt: (prompt: ProjectPrompt) => void;
  onRegeneratePrompt: () => void;
  isGenerating: boolean;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({
  prompt,
  project,
  onUpdatePrompt,
  onRegeneratePrompt,
  isGenerating,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'layout' | 'sections'>('visual');
  const [visualText, setVisualText] = useState(prompt.visualAssetPrompt);
  const [layoutText, setLayoutText] = useState(prompt.layoutConstructionPrompt);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    const content = `# CREATIVE ARCHITECT GENERATION PROMPTS
## Project: ${project.name}
**Version**: ${prompt.version}
**Updated**: ${prompt.updatedAt}

---

## 1. VISUAL ASSET GENERATION PROMPT
${visualText}

---

## 2. EDITABLE LAYOUT CONSTRUCTION PROMPT
${layoutText}

---

## 3. STRUCTURED 17-SECTION SPECIFICATION
### 1. Overview
${prompt.sections.overview}

### 2. Communication Objective
${prompt.sections.communicationObjective}

### 3. Audience
${prompt.sections.audience}

### 4. Reference Analysis
${prompt.sections.referenceAnalysis}

### 5. Selected Concept
${prompt.sections.selectedConcept}

### 6. Design Rationale
${prompt.sections.designRationale}

### 7. Composition & Grid
${prompt.sections.compositionGrid}

### 8. Typography
${prompt.sections.typography}

### 9. Colour
${prompt.sections.colour}

### 10. Image Direction
${prompt.sections.imageDirection}

### 11. Approved Copy
${prompt.sections.approvedCopy}

### 12. Protected Assets
${prompt.sections.protectedAssets}

### 13. Layout Requirements
${prompt.sections.layoutRequirements}

### 14. PDF Production
${prompt.sections.pdfProduction}

### 15. Quality Criteria
${prompt.sections.qualityCriteria}

### 16. Negative Constraints
${prompt.sections.negativeConstraints}

### 17. Output Deliverables
${prompt.sections.outputDeliverables}
`;

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generation-prompt-v${prompt.version}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onUpdatePrompt({
      ...prompt,
      visualAssetPrompt: visualText,
      layoutConstructionPrompt: layoutText,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Dual-Discipline Prompt Studio</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Project Prompts &amp; Engineering Studio</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Strict separation between Visual Asset Generation (backgrounds and photographic assets) and Editable
              Layout Construction (vector shapes, exact copy, protected assets, and measurements).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onRegeneratePrompt}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Prompts'}</span>
            </button>
          </div>
        </div>

        {/* Prompt Type Segmented Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'visual'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Type A: Visual Asset Prompt</span>
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'layout'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Type B: Layout Construction Prompt</span>
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'sections'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>17-Section Specification</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('md')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => handleDownload('txt')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Plain Text (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Viewport */}
      {activeTab === 'visual' && (
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-neutral-100">
                A. Visual Asset Generation Prompt (Image Model Target)
              </h3>
              <p className="text-xs text-neutral-400">
                Supplies diffusion/image synthesis models with lighting, texture, camera angle, and background
                parameters. Prohibits typography and logo generation.
              </p>
            </div>
            <button
              onClick={() => handleCopy(visualText, 'visual')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg"
            >
              {copied === 'visual' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'visual' ? 'Copied' : 'Copy Prompt'}</span>
            </button>
          </div>

          <textarea
            rows={10}
            value={visualText}
            onChange={(e) => setVisualText(e.target.value)}
            className="w-full bg-[#0a0b0d] border border-neutral-800/90 rounded-lg p-4 text-xs font-mono text-neutral-200 leading-relaxed focus:border-sky-500 focus:outline-none"
          />

          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400">
            <strong className="text-neutral-300">Target Model Use:</strong> Compatible with Gemini Image Generation
            (Nano Banana 2.1), Midjourney v6, or Imagen 3. Do not instruct image models to render text or packaging
            labels.
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-neutral-100">
                B. Editable Layout Construction Prompt (SVG &amp; Vector Engine Target)
              </h3>
              <p className="text-xs text-neutral-400">
                Specifies exact physical millimeter coordinates, layer groups, typography hierarchy, and asset
                placement rules for vector synthesis.
              </p>
            </div>
            <button
              onClick={() => handleCopy(layoutText, 'layout')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg"
            >
              {copied === 'layout' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'layout' ? 'Copied' : 'Copy Prompt'}</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={layoutText}
            onChange={(e) => setLayoutText(e.target.value)}
            className="w-full bg-[#0a0b0d] border border-neutral-800/90 rounded-lg p-4 text-xs font-mono text-neutral-200 leading-relaxed focus:border-sky-500 focus:outline-none"
          />

          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400">
            <strong className="text-neutral-300">Target Engine Use:</strong> Fed into the Creative Architect SVG
            engine to instantiate real, layered vector elements with zero raster degradation.
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-bold text-neutral-100">Complete 17-Section Project Specification</h3>
            <span className="text-xs font-mono text-sky-400">Version {prompt.version}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(prompt.sections).map(([key, val]) => (
              <div key={key} className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800/60 space-y-1.5">
                <h4 className="font-bold text-sky-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-neutral-300 leading-relaxed text-[11px]">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
