import React, { useState } from 'react';
import { ProjectData, ArtworkCategory } from '../types';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface CreativeBriefProps {
  project: ProjectData;
  onUpdateProject: (updated: Partial<ProjectData>) => void;
  onGenerateConcepts: () => void;
  isGenerating: boolean;
}

export const CreativeBrief: React.FC<CreativeBriefProps> = ({
  project,
  onUpdateProject,
  onGenerateConcepts,
  isGenerating,
}) => {
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    name: project.name,
    clientBrand: project.clientBrand,
    category: project.category,
    objective: project.objective,
    targetAudience: project.targetAudience,
    mainMessage: project.mainMessage,
    artDirection: project.artDirection,
    brandGuidelines: project.brandGuidelines,
    mandatoryInclusions: [...project.mandatoryInclusions],
    prohibitedChanges: [...project.prohibitedChanges],
    productionRequirements: project.productionRequirements,
    approvalStatus: project.approvalStatus,
  });

  const [savedNotification, setSavedNotification] = useState<boolean>(false);
  const [newMandatory, setNewMandatory] = useState<string>('');
  const [newProhibited, setNewProhibited] = useState<string>('');

  const handleSave = () => {
    onUpdateProject(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleAddMandatory = () => {
    if (!newMandatory.trim()) return;
    setFormData((prev) => ({
      ...prev,
      mandatoryInclusions: [...(prev.mandatoryInclusions || []), newMandatory.trim()],
    }));
    setNewMandatory('');
  };

  const handleRemoveMandatory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mandatoryInclusions: prev.mandatoryInclusions?.filter((_, i) => i !== index),
    }));
  };

  const handleAddProhibited = () => {
    if (!newProhibited.trim()) return;
    setFormData((prev) => ({
      ...prev,
      prohibitedChanges: [...(prev.prohibitedChanges || []), newProhibited.trim()],
    }));
    setNewProhibited('');
  };

  const handleRemoveProhibited = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prohibitedChanges: prev.prohibitedChanges?.filter((_, i) => i !== index),
    }));
  };

  const categories: ArtworkCategory[] = [
    'A1 Poster',
    'A2 Poster',
    'A3 Poster',
    'Brochure',
    'Product Label',
    'Digital Advertising',
    'Campaign Key Visual',
  ];

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Structured Creative Brief &amp; Strategy Engine</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Project Brief &amp; Production Parameters</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Defines the communication mandate, target audience, mandatory inclusions, and negative constraints.
              Drives the creative director model to formulate compliant, non-fabricated concepts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-100 bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Brief</span>
            </button>
            <button
              onClick={onGenerateConcepts}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Concepts'}</span>
            </button>
          </div>
        </div>

        {savedNotification && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Creative brief changes saved successfully.</span>
          </div>
        )}
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Core Project Identifiers (8 cols) */}
        <div className="lg:col-span-8 bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-neutral-200">1. Campaign Parameters &amp; Objectives</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Project Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Client or Brand Name</label>
              <input
                type="text"
                value={formData.clientBrand || ''}
                onChange={(e) => setFormData({ ...formData, clientBrand: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Artwork Category / Format</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ArtworkCategory })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-300 focus:border-sky-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Approval Status</label>
              <select
                value={formData.approvalStatus}
                onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as any })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-300 focus:border-sky-500 focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Concept Approved">Concept Approved</option>
                <option value="Artwork In Review">Artwork In Review</option>
                <option value="Production Ready">Production Ready</option>
                <option value="Exported">Exported</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Communication Objective</label>
            <textarea
              rows={2}
              value={formData.objective || ''}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Target Audience &amp; Viewing Context</label>
            <textarea
              rows={2}
              value={formData.targetAudience || ''}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Main Core Message</label>
            <input
              type="text"
              value={formData.mainMessage || ''}
              onChange={(e) => setFormData({ ...formData, mainMessage: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Desired Art Direction</label>
            <textarea
              rows={2}
              value={formData.artDirection || ''}
              onChange={(e) => setFormData({ ...formData, artDirection: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Brand Guidelines &amp; Palette Restrictions</label>
            <textarea
              rows={2}
              value={formData.brandGuidelines || ''}
              onChange={(e) => setFormData({ ...formData, brandGuidelines: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Constraints & Production Spec (4 cols) */}
        <div className="lg:col-span-4 space-y-5 text-xs">
          {/* Mandatory Inclusions */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-neutral-200">2. Mandatory Inclusions</h3>
            <p className="text-[11px] text-neutral-400">Elements that must be present in the final artwork.</p>

            <div className="space-y-1.5">
              {formData.mandatoryInclusions?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-200"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveMandatory(idx)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add mandatory item..."
                value={newMandatory}
                onChange={(e) => setNewMandatory(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 focus:outline-none"
              />
              <button
                onClick={handleAddMandatory}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Prohibited Changes (Negative Constraints) */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-neutral-200">3. Prohibited Changes</h3>
            </div>
            <p className="text-[11px] text-neutral-400">
              Strict negative constraints preventing AI hallucination or unauthorized modification.
            </p>

            <div className="space-y-1.5">
              {formData.prohibitedChanges?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-red-950/20 border border-red-900/30 text-[11px] text-red-200"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveProhibited(idx)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add negative constraint..."
                value={newProhibited}
                onChange={(e) => setNewProhibited(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 focus:outline-none"
              />
              <button
                onClick={handleAddProhibited}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Production Requirements */}
          <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-neutral-200">4. Production Specification</h3>
            <textarea
              rows={3}
              value={formData.productionRequirements || ''}
              onChange={(e) => setFormData({ ...formData, productionRequirements: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
