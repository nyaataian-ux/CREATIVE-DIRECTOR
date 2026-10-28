import React from 'react';
import { ArtworkRevision } from '../types';
import { History, RotateCcw, Download, CheckCircle2, Clock } from 'lucide-react';

interface ProjectHistoryProps {
  revisions: ArtworkRevision[];
  onRestoreRevision: (rev: ArtworkRevision) => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({
  revisions,
  onRestoreRevision,
}) => {
  const handleDownloadRevisionSvg = (rev: ArtworkRevision) => {
    const blob = new Blob([rev.svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artwork-${rev.revisionId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
            <span>Audit Trail &amp; Version Control</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-100">Project Revision History</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
            Every committed artwork state is archived with a unique revision ID, timestamp, prompt version, and
            detailed change summary. You can restore or export any previous revision.
          </p>
        </div>
      </div>

      {revisions.length === 0 ? (
        <div className="bg-[#111216] border border-neutral-800/80 rounded-xl p-12 text-center space-y-3">
          <History className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-200">No Revisions Archived Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Make edits in the Artwork Editor and click "Save Revision" to establish permanent version checkpoints.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {revisions.map((rev, idx) => (
            <div
              key={rev.revisionId}
              className="bg-[#111216] border border-neutral-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-sky-400 font-mono">
                    Revision #{revisions.length - idx} ({rev.revisionId})
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">
                    ·
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {new Date(rev.timestamp).toLocaleString()}
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">
                    ·
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    QA Status: {rev.qaStatus}
                  </span>
                </div>

                <p className="text-xs text-neutral-200 font-medium">{rev.changeSummary}</p>

                <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                  <span>Prompt Version: v{rev.promptVersion}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.layoutSpec.elements.length} Layout Elements</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadRevisionSvg(rev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={() => onRestoreRevision(rev)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Revision</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
