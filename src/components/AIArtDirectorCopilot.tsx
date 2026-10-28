import React, { useState } from 'react';
import { ProjectData, LayoutSpec, AICopilotMessage } from '../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Sliders,
  Palette,
  ShieldCheck,
  Image,
  ArrowRight,
  CheckCircle2,
  Minimize2,
} from 'lucide-react';

interface AIArtDirectorCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  layoutSpec: LayoutSpec;
  onApplyPalette: (palette: any) => void;
  onOptimizeLayout: () => void;
  onOpenCompliance: () => void;
  onOpenVisualStudio: () => void;
  isOptimizingLayout: boolean;
}

export const AIArtDirectorCopilot: React.FC<AIArtDirectorCopilotProps> = ({
  isOpen,
  onClose,
  project,
  layoutSpec,
  onApplyPalette,
  onOptimizeLayout,
  onOpenCompliance,
  onOpenVisualStudio,
  isOptimizingLayout,
}) => {
  const [messages, setMessages] = useState<AICopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am your AI Creative Art Director for **${project.name}**. I evaluate visual hierarchy, Swiss grid math, typography pairings, and regulatory compliance. How can I assist your design production today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;

    const userMsg: AICopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          project,
          layoutSpec,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('Copilot request failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (action: any) => {
    if (action.type === 'apply_palette') {
      onApplyPalette(action.payload);
    } else if (action.type === 'apply_layout') {
      onOptimizeLayout();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#0e1014] border-l border-neutral-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#111216]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
              AI Art Director Copilot
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">
              Creative Strategy &amp; Layout Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-neutral-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick AI Action Strip */}
      <div className="p-3 bg-neutral-900/60 border-b border-neutral-800/80 space-y-2">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
          One-Click AI Optimizations
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={onOptimizeLayout}
            disabled={isOptimizingLayout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 transition-colors disabled:opacity-50"
          >
            <Sliders className="w-3 h-3 text-sky-400" />
            <span>{isOptimizingLayout ? 'Balancing...' : 'Auto-Balance Grid'}</span>
          </button>
          <button
            onClick={() => handleSend('Recommend an optimal 60-30-10 clinical color palette')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 transition-colors"
          >
            <Palette className="w-3 h-3 text-emerald-400" />
            <span>Harmonize Palette</span>
          </button>
          <button
            onClick={onOpenCompliance}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Medical Ad Audit</span>
          </button>
          <button
            onClick={onOpenVisualStudio}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 transition-colors"
          >
            <Image className="w-3 h-3 text-purple-400" />
            <span>Visual Studio</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                {isUser ? (
                  <>
                    <span>Designer</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-sky-400" />
                    <span>Creative Art Director</span>
                  </>
                )}
                <span>· {m.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-xl max-w-[90%] leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Optional Action Card */}
                {m.actionSuggested && (
                  <div className="mt-3 pt-3 border-t border-neutral-800/80">
                    <button
                      onClick={() => handleActionClick(m.actionSuggested)}
                      className="w-full flex items-center justify-between p-2 rounded bg-sky-950/60 border border-sky-800/70 hover:bg-sky-900/60 text-sky-200 text-[11px] font-semibold transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>{m.actionSuggested.label}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Consulting design intelligence...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-neutral-800 bg-[#111216]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask art director or instruct changes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
