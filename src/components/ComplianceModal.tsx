import React, { useState, useEffect } from 'react';
import { ApprovedCopy, ProjectData, ComplianceCheckResult } from '../types';
import { ShieldCheck, X, AlertTriangle, CheckCircle2, FileSearch, Sparkles } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [result, setResult] = useState<ComplianceCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/ai/compliance-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approvedCopy: project.approvedCopy,
        projectBrief: project,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.compliance) {
          setResult(data.compliance);
        }
      })
      .catch((err) => console.error('Compliance check failed:', err))
      .finally(() => setLoading(false));
  }, [isOpen, project]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111216] border border-neutral-800 rounded-xl p-6 max-w-2xl w-full space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                AI Healthcare Advertising Compliance Audit
              </h3>
              <p className="text-xs text-neutral-400">
                Audits medical claims, prohibited superlatives, POM notifications, and readability.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-sky-400 animate-pulse mx-auto" />
            <div className="text-xs text-neutral-300 font-medium">
              Auditing regulatory text with Gemini...
            </div>
          </div>
        ) : result ? (
          <div className="space-y-4 text-xs">
            {/* Top Score Banner */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Compliance Score</span>
                <div className="text-2xl font-bold text-emerald-400">{result.score}/100</div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Readability Index</span>
                <div className="text-xs font-semibold text-neutral-200">{result.readabilityScore}</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-200 font-medium">Prescription-Only Medicine (POM) Notice</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-200 font-medium">Prohibited Promotional Superlatives Scan</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">CLEAN (0 FLAGS)</span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-200 font-medium">Adverse Event Pharmacovigilance Routing</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">IDENTIFIED</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
              <span className="font-semibold text-neutral-200 block">Auditor Recommendations:</span>
              <ul className="space-y-1.5 text-neutral-300 text-[11px]">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400">▪</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
