import React, { useState } from 'react';
import { ProjectData, ArtworkCategory } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: ProjectData) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [clientBrand, setClientBrand] = useState('');
  const [category, setCategory] = useState<ArtworkCategory>('A1 Poster');
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainMessage, setMainMessage] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [artDirection, setArtDirection] = useState('Premium, sophisticated, and clean editorial design');
  const [brandGuidelines, setBrandGuidelines] = useState('Strict color palette and asset preservation');
  const [productionReqs, setProductionReqs] = useState('Trim 594 × 841 mm, 3mm bleed, 48mm safe margin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientBrand) return;

    const newProject: ProjectData = {
      id: `proj-${Date.now()}`,
      name,
      clientBrand,
      category,
      objective,
      targetAudience,
      mainMessage,
      artDirection,
      brandGuidelines,
      mandatoryInclusions: ['Official Logo', 'Regulatory Indication Statement', 'Document Code'],
      prohibitedChanges: ['Never invent medical claims', 'Do not distort brand packaging'],
      outputFormats: ['SVG', 'PDF', 'PNG'],
      productionRequirements: productionReqs,
      approvalStatus: 'Draft',
      approvedCopy: {
        headline: headline || `${clientBrand.toUpperCase()} ADVANCED THERAPEUTIC INNOVATION`,
        subheading: subheading || 'Engineered for sustained patient efficacy and targeted distribution.',
        bodyText: 'Clinical formulation designed for optimal delivery and predictable response.',
        productInformation: `${clientBrand} approved therapeutic formulation.`,
        approvedClaims: ['Demonstrated statistical significance in clinical trials'],
        callToAction: 'Explore the full monograph and clinical trials data.',
        disclaimer: 'Prescription-only medicine (POM). Refer to full SmPC before prescribing.',
        footerText: `${clientBrand} Ltd. © 2026. All rights reserved.`,
        contactInfo: 'Medical Affairs Inquiry',
      },
      brandAssets: [],
      selectedReferenceIds: [],
      concepts: [],
      prompts: [],
      revisionHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-2xl w-full my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-100">Create New Project Brief</h3>
            <p className="text-xs text-neutral-400">
              Establish a fresh project brief without overwriting existing projects.
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. CardiaFlow Awareness Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Client or Brand Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cardia Therapeutics"
                value={clientBrand}
                onChange={(e) => setClientBrand(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Artwork Format</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArtworkCategory)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-300 focus:outline-none focus:border-sky-500"
              >
                <option value="A1 Poster">A1 Poster (594 × 841 mm)</option>
                <option value="A2 Poster">A2 Poster (420 × 594 mm)</option>
                <option value="A3 Poster">A3 Poster (297 × 420 mm)</option>
                <option value="Brochure">Brochure</option>
                <option value="Product Label">Product Label</option>
                <option value="Digital Advertising">Digital Advertising</option>
                <option value="Campaign Key Visual">Campaign Key Visual</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Main Headline</label>
              <input
                type="text"
                placeholder="Initial approved headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Communication Objective</label>
            <textarea
              rows={2}
              placeholder="e.g. Drive clinical awareness among hospital specialists..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Target Audience</label>
            <input
              type="text"
              placeholder="e.g. Cardiologists, GPs, hospital pharmacists"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Art Direction Style</label>
              <input
                type="text"
                value={artDirection}
                onChange={(e) => setArtDirection(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Production Specification</label>
              <input
                type="text"
                value={productionReqs}
                onChange={(e) => setProductionReqs(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
