import React from 'react';
import { Layers, Download, Plus, Sparkles, MessageSquare, Wand2, LogIn, LogOut, CloudCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface TopBarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  projectName: string;
  approvalStatus: string;
  onNewProject: () => void;
  onExport: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  currentUser: User | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  isCloudSyncing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentSection,
  onNavigate,
  projectName,
  approvalStatus,
  onNewProject,
  onExport,
  onToggleCopilot,
  isCopilotOpen,
  currentUser,
  onSignInGoogle,
  onSignOut,
  isCloudSyncing = false,
}) => {
  const navItems = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'chatbot', label: 'AI Chatbot', icon: <MessageSquare className="w-3 h-3 text-sky-400" /> },
    { id: 'image-studio', label: 'Image Studio', icon: <Wand2 className="w-3 h-3 text-amber-400" /> },
    { id: 'editor', label: 'Artwork Editor' },
    { id: 'references', label: 'References' },
    { id: 'assets', label: 'Assets & Copy' },
    { id: 'brief', label: 'Brief' },
    { id: 'concepts', label: 'Concepts' },
    { id: 'prompt-studio', label: 'Prompts' },
    { id: 'qa', label: 'Critique & QA' },
    { id: 'history', label: 'Revisions' },
    { id: 'export', label: 'Deliverables' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d10] border-b border-neutral-800/80 px-6 py-3">
      <div className="flex items-center justify-between gap-6 max-w-[1720px] mx-auto">
        {/* Zone 1: Wordmark with project info */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('workspace')}>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-neutral-100 whitespace-nowrap">
              CREATIVE ARCHITECT AI
            </span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="truncate max-w-[160px]">{projectName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">{approvalStatus}</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-800 text-sky-400 border border-neutral-700/60 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Firebase Auth Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cloud Firestore Sync / Google Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-lg px-2.5 py-1">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full border border-sky-500/50"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] flex items-center justify-center font-bold">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-semibold text-neutral-200 truncate max-w-[110px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isCloudSyncing ? 'Syncing...' : 'Firestore Synced'}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors ml-1"
                title="Sign out of Google / Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-sky-500/40 hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-sm"
              title="Sign in with Google to sync projects to Firestore database"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap border ${
              isCopilotOpen
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm shadow-sky-950'
                : 'bg-neutral-900 text-sky-400 border-sky-500/40 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={onNewProject}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-neutral-100 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap shadow-sm shadow-sky-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

