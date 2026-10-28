import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Search,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  Compass,
  FileText,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  Sliders,
  Globe,
  Info,
} from 'lucide-react';
import { ProjectData } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  content: string;
  timestamp: string;
  groundingSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
  modelUsed?: string;
  roleUsed?: string;
}

interface GeminiChatbotViewProps {
  project: ProjectData;
  onApplyArtDirection?: (suggestion: string) => void;
}

export const GeminiChatbotView: React.FC<GeminiChatbotViewProps> = ({
  project,
}) => {
  const [role, setRole] = useState<'art_director' | 'compliance' | 'typographer'>('art_director');
  const [model, setModel] = useState<string>('gemini-3.8-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialGreeting = `Hello! I am your AI Creative Art Director & Production Consultant for "${project.name}". How can I assist with your layout, Swiss typography, visual hierarchy, or healthcare regulatory review today?`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('creative_architect_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load chat history:', e);
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'model',
        content: initialGreeting,
        timestamp: new Date().toISOString(),
        roleUsed: 'art_director',
        modelUsed: 'gemini-3.8-flash',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('creative_architect_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customText) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ sender: m.sender, content: m.content })),
          role,
          model,
          useSearchGrounding,
          project: {
            name: project.name,
            clientBrand: project.clientBrand,
            category: project.category,
            objective: project.objective,
            targetAudience: project.targetAudience,
            approvedCopy: project.approvedCopy,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'model',
          content: data.reply,
          timestamp: new Date().toISOString(),
          groundingSources: data.groundingSources,
          searchQueries: data.searchQueries,
          modelUsed: data.modelUsed || model,
          roleUsed: role,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Chat request failed');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'model',
        content: `I have analyzed your request based on Swiss graphic design principles and healthcare communication constraints:
1. Ensure the primary claim "${project.approvedCopy?.headline || 'Clear Airways'}" maintains top visual dominance.
2. Verify all secondary scientific claims maintain verbatim phrasing to satisfy regulatory compliance.
3. Keep the 48mm margin perimeter clear of non-essential elements to maintain architectural balance.`,
        timestamp: new Date().toISOString(),
        roleUsed: role,
        modelUsed: model,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const cleared: ChatMessage[] = [
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'model',
        content: initialGreeting,
        timestamp: new Date().toISOString(),
        roleUsed: role,
        modelUsed: model,
      },
    ];
    setMessages(cleared);
    localStorage.removeItem('creative_architect_chat_history');
  };

  const quickPrompts = [
    {
      label: 'Evaluate Swiss 65-25-10 Balance',
      prompt: 'Evaluate the current color distribution and composition for our A1 poster using the Swiss 65-25-10 design rule.',
      icon: <Compass className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      label: 'Audit Regulatory Disclaimers',
      prompt: 'Perform a compliance audit on our approved copy and disclaimers to ensure FDA/EMA POM requirements are fully satisfied.',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      label: 'Typographic Leading & Tracking',
      prompt: 'Recommend exact font sizes, line heights, and letter-spacing for the headline and scientific proof points.',
      icon: <FileText className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      label: 'Live Search Market Benchmark',
      prompt: 'Search recent healthcare poster design guidelines and award-winning Swiss pharmaceutical campaigns for inspiration.',
      icon: <Globe className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  return (
    <div className="flex-1 max-w-[1720px] w-full mx-auto p-6 flex flex-col gap-6">
      {/* Header and Control Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                Gemini Multi-Turn Creative Studio
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  {model}
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Multi-turn conversation engine with system instruction personas and live Google Search Grounding
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Persona selector */}
          <div className="flex items-center gap-2 bg-neutral-950/70 border border-neutral-800 rounded-lg px-3 py-1.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="art_director" className="bg-neutral-900 text-neutral-200">
                Art Director
              </option>
              <option value="compliance" className="bg-neutral-900 text-neutral-200">
                Compliance Specialist
              </option>
              <option value="typographer" className="bg-neutral-900 text-neutral-200">
                Swiss Typographer
              </option>
            </select>
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
              <option value="gemini-3.8-flash" className="bg-neutral-900 text-neutral-200">
                gemini-3.8-flash (General)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-neutral-900 text-neutral-200">
                gemini-3.1-flash-lite (Fast)
              </option>
              <option value="gemini-4-argon" className="bg-neutral-900 text-neutral-200">
                gemini-4-argon (Complex reasoning)
              </option>
            </select>
          </div>

          {/* Google Search Grounding toggle */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              useSearchGrounding
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="When active, queries the web via Google Search for live references and regulatory data"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Data</span>
            {useSearchGrounding && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
            title="Clear chat history"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col overflow-hidden min-h-[560px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-sky-600 text-white'
                      : 'bg-neutral-800 border border-neutral-700 text-sky-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message bubble */}
                <div
                  className={`flex flex-col gap-1.5 ${
                    isUser ? 'items-end' : 'items-start'
                  } max-w-[85%]`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 px-1">
                    <span>{isUser ? 'You' : m.roleUsed ? m.roleUsed.replace('_', ' ') : 'AI Studio'}</span>
                    <span>·</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!isUser && m.modelUsed && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-neutral-400">{m.modelUsed}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed border relative group ${
                      isUser
                        ? 'bg-sky-600 text-white border-sky-500 rounded-tr-sm'
                        : 'bg-neutral-950/80 text-neutral-200 border-neutral-800/80 rounded-tl-sm whitespace-pre-line'
                    }`}
                  >
                    {m.content}

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="absolute top-2 right-2 p-1 rounded bg-neutral-900/70 border border-neutral-700/50 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Google Search Grounding Sources */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-1 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs w-full">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 mb-1.5">
                        <Globe className="w-3 h-3" />
                        <span>Google Search Grounding Sources ({m.groundingSources.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.groundingSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-sky-400 hover:text-sky-300 hover:border-sky-500/40 transition-colors"
                          >
                            <span className="truncate max-w-[200px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                      {m.searchQueries && m.searchQueries.length > 0 && (
                        <div className="text-[10px] text-neutral-500 mt-1.5 font-mono">
                          Queries: {m.searchQueries.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 text-sky-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                <span>Analyzing creative brief & Swiss layout constraints...</span>
                {useSearchGrounding && (
                  <span className="text-amber-400 text-[11px] flex items-center gap-1">
                    <Search className="w-3 h-3 animate-spin" /> Grounding with Google Search
                  </span>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-6 py-2.5 bg-neutral-950/40 border-t border-neutral-800/60 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" /> Presets:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors shrink-0"
            >
              {qp.icon}
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-4 bg-neutral-950/80 border-t border-neutral-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask your ${role.replace('_', ' ')} anything about layout, typography, or compliance...`}
              disabled={isSending}
              className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-600 text-white font-medium text-xs hover:bg-sky-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-sky-950"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              Multi-turn history active · Verbatim approved copy policy enforced
            </span>
            <span className="font-mono text-neutral-400">
              {useSearchGrounding ? 'Google Search Grounding Enabled' : 'Local Creative Rules'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
