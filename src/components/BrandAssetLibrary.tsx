import React, { useState } from 'react';
import { BrandAsset, ApprovedCopy, IntegrityRule } from '../types';
import {
  Shield,
  FileCheck,
  Plus,
  Lock,
  Unlock,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
} from 'lucide-react';

interface BrandAssetLibraryProps {
  assets: BrandAsset[];
  approvedCopy: ApprovedCopy;
  onUpdateAsset: (asset: BrandAsset) => void;
  onAddAsset: (asset: BrandAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  onUpdateApprovedCopy: (copy: ApprovedCopy) => void;
}

export const BrandAssetLibrary: React.FC<BrandAssetLibraryProps> = ({
  assets,
  approvedCopy,
  onUpdateAsset,
  onAddAsset,
  onDeleteAsset,
  onUpdateApprovedCopy,
}) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'copy'>('assets');
  const [copyState, setCopyState] = useState<ApprovedCopy>({ ...approvedCopy });
  const [newClaim, setNewClaim] = useState<string>('');
  const [showAddAssetModal, setShowAddAssetModal] = useState<boolean>(false);

  // New asset form state
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<BrandAsset['type']>('logo');
  const [newAssetIntegrity, setNewAssetIntegrity] = useState<IntegrityRule>('PROTECTED');
  const [newAssetNotes, setNewAssetNotes] = useState('');
  const [newAssetFileUrl, setNewAssetFileUrl] = useState('');

  const handleCopySave = () => {
    onUpdateApprovedCopy(copyState);
  };

  const handleAddClaim = () => {
    if (!newClaim.trim()) return;
    setCopyState((prev) => ({
      ...prev,
      approvedClaims: [...prev.approvedClaims, newClaim.trim()],
    }));
    setNewClaim('');
  };

  const handleRemoveClaim = (index: number) => {
    setCopyState((prev) => ({
      ...prev,
      approvedClaims: prev.approvedClaims.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewAssetFileUrl(reader.result as string);
      if (!newAssetName) {
        setNewAssetName(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAsset = () => {
    if (!newAssetName || !newAssetFileUrl) return;

    const newAsset: BrandAsset = {
      id: `asset-${Date.now()}`,
      name: newAssetName,
      filename: `${newAssetName.toLowerCase().replace(/\s+/g, '-')}.svg`,
      fileUrl: newAssetFileUrl,
      fileType: 'image/svg+xml',
      type: newAssetType,
      integrityRule: newAssetIntegrity,
      notes: newAssetNotes,
      usedInElements: [],
    };

    onAddAsset(newAsset);
    setShowAddAssetModal(false);
    setNewAssetName('');
    setNewAssetNotes('');
    setNewAssetFileUrl('');
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header & Sub-Navigation */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              <span>Brand &amp; Content Integrity Engine</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">Brand Assets &amp; Approved Copy Repository</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Strictly controls brand marks, product pack shots, authorized claims, and mandatory disclaimers. Protected
              assets are preserved in original form without AI hallucination or redraw.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'assets'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Brand Assets ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('copy')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'copy'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Approved Copy Repository
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'assets' ? (
        /* Brand Assets View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-400">
              <span>{assets.filter((a) => a.integrityRule === 'PROTECTED').length} Protected Assets Locked</span>
              <span aria-hidden="true"> · </span>
              <span>Vector and High-Resolution Placements</span>
            </div>
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand Asset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assets.map((asset) => {
              const isProtected = asset.integrityRule === 'PROTECTED';
              return (
                <div
                  key={asset.id}
                  className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-100">{asset.name}</h4>
                        <div className="text-[11px] font-mono text-neutral-400">{asset.filename}</div>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isProtected
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {asset.integrityRule}
                      </span>
                    </div>

                    {/* Asset Preview Frame */}
                    <div className="h-36 bg-[#0a0b0d] rounded-lg border border-neutral-800/80 flex items-center justify-center p-4 overflow-hidden">
                      <img
                        src={asset.fileUrl}
                        alt={asset.name}
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <p className="text-xs text-neutral-400">{asset.notes || 'No notes specified.'}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-neutral-400">
                      {asset.usedInElements && asset.usedInElements.length > 0 ? (
                        <span>Bound to {asset.usedInElements.length} element(s)</span>
                      ) : (
                        <span>Available in library</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={asset.integrityRule}
                        onChange={(e) =>
                          onUpdateAsset({
                            ...asset,
                            integrityRule: e.target.value as IntegrityRule,
                          })
                        }
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-[11px] text-neutral-300 focus:outline-none"
                      >
                        <option value="PROTECTED">PROTECTED</option>
                        <option value="PLACEMENT_ONLY">PLACEMENT ONLY</option>
                        <option value="CROPPING_ALLOWED">CROPPING ALLOWED</option>
                        <option value="EDITABLE">EDITABLE</option>
                        <option value="REPLACEMENT_REQUIRED">REPLACEMENT REQUIRED</option>
                      </select>
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Approved Copy Repository */
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
            <div>
              <h3 className="text-base font-bold text-neutral-100">Approved Medical Copy Source</h3>
              <p className="text-xs text-neutral-400">
                All artwork text elements are checked deterministically against these approved fields.
              </p>
            </div>
            <button
              onClick={handleCopySave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Approved Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Primary Headline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Primary Headline (Verbatim)</label>
              <textarea
                rows={3}
                value={copyState.headline}
                onChange={(e) => setCopyState({ ...copyState, headline: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>

            {/* Subheading */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Subheading / Clinical Position</label>
              <textarea
                rows={3}
                value={copyState.subheading}
                onChange={(e) => setCopyState({ ...copyState, subheading: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>

            {/* Body Text */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Body Text / Therapeutic Explanation</label>
              <textarea
                rows={4}
                value={copyState.bodyText}
                onChange={(e) => setCopyState({ ...copyState, bodyText: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>

            {/* Product Information & Indications */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">
                Product Formulation &amp; Indication Statement
              </label>
              <textarea
                rows={4}
                value={copyState.productInformation}
                onChange={(e) => setCopyState({ ...copyState, productInformation: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>

            {/* Call to Action */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Call to Action (CTA)</label>
              <input
                type="text"
                value={copyState.callToAction}
                onChange={(e) => setCopyState({ ...copyState, callToAction: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Footer / Tracking Code */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Document Tracking Code &amp; Preparation Date</label>
              <input
                type="text"
                value={copyState.footerText}
                onChange={(e) => setCopyState({ ...copyState, footerText: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>

            {/* Mandatory Medical Disclaimer */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="font-semibold text-neutral-300 flex items-center gap-2">
                <span>Mandatory Medical Disclaimer &amp; Pharmacovigilance (POM)</span>
                <span className="text-[10px] text-amber-400 font-mono">DO NOT REMOVE OR PARAPHRASE</span>
              </label>
              <textarea
                rows={3}
                value={copyState.disclaimer}
                onChange={(e) => setCopyState({ ...copyState, disclaimer: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* Approved Claims List */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <h4 className="text-xs font-semibold text-neutral-200">
              Approved Quantitative Claims &amp; Clinical Endpoints
            </h4>
            <div className="space-y-2">
              {copyState.approvedClaims.map((claim, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs"
                >
                  <span className="text-neutral-200">
                    <strong className="text-sky-400 mr-2 font-mono">Claim #{idx + 1}:</strong>
                    {claim}
                  </span>
                  <button
                    onClick={() => handleRemoveClaim(idx)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new approved clinical claim..."
                value={newClaim}
                onChange={(e) => setNewClaim(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-100 focus:outline-none"
              />
              <button
                onClick={handleAddClaim}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 rounded-lg"
              >
                Add Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-neutral-100">Add Brand Asset</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aerovant Clinical Logo"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Asset Type</label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none"
                  >
                    <option value="logo">Logo</option>
                    <option value="packshot">Product Packshot</option>
                    <option value="photo">Photograph</option>
                    <option value="icon">Icon / Seal</option>
                    <option value="disclaimer">Legal Emblem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Integrity Rule</label>
                  <select
                    value={newAssetIntegrity}
                    onChange={(e) => setNewAssetIntegrity(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none"
                  >
                    <option value="PROTECTED">PROTECTED</option>
                    <option value="PLACEMENT_ONLY">PLACEMENT ONLY</option>
                    <option value="CROPPING_ALLOWED">CROPPING ALLOWED</option>
                    <option value="EDITABLE">EDITABLE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Upload File (SVG / PNG)</label>
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Usage Notes &amp; Restrictions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Never stretch or redraw. Minimum 30mm height."
                  value={newAssetNotes}
                  onChange={(e) => setNewAssetNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAsset}
                disabled={!newAssetName || !newAssetFileUrl}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg disabled:opacity-50"
              >
                Register Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
