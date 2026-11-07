'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Camera,
  FileText,
  Video,
  Clapperboard,
  Lightbulb,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { generateCreativeResponse } from '@/lib/ai/creativeEngine';

interface AICreativeAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  defaultCategory?: 'photography' | 'screenwriting' | 'documentary' | 'production' | 'general';
  onApplyAction?: (action: any) => void;
}

export function AICreativeAssistantDrawer({
  isOpen,
  onClose,
  initialPrompt = '',
  defaultCategory = 'general',
  onApplyAction,
}: AICreativeAssistantDrawerProps) {
  const { settings, aiMessages, addAIMessage, addJournalEntry, addShot, addShootPlan } = useFrameFlow();
  const [selectedCategory, setSelectedCategory] = useState<'photography' | 'screenwriting' | 'documentary' | 'production' | 'general'>(defaultCategory);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, aiMessages]);

  if (!isOpen) return null;

  const quickPrompts = {
    photography: [
      'Suggest a low-key chiaroscuro lighting scheme for night rain portraits',
      'Generate a 35mm street photography composition concept in Tokyo',
      'Recommend camera and lens combinations for high-contrast desert dunes',
    ],
    screenwriting: [
      'Punch up this dialogue exchange with deeper subtext and tension',
      'Help build a character wound and fatal flaw for my protagonist',
      'Scan my scene for pacing drag and unnecessary exposition',
    ],
    documentary: [
      'Generate 4 emotionally penetrating interview questions for an artisan engineer',
      'Structure a 4-chapter narrative arc about physical vinyl vs digital algorithms',
      'Suggest B-roll acoustic shooting strategies for quiet machinery',
    ],
    production: [
      'Extract a 4-shot cinematic coverage plan from my opening scene',
      'Recommend camera movement and lens choices for an intense interrogation',
      'Generate a pre-shoot checklist for Mojave high-wind filming',
    ],
    general: [
      'Expand this rough idea into a compelling visual premise',
      'Suggest 3 unconventional themes connecting memory, dust, and sound',
      'Help me break through a creative block on Act II midpoint',
    ],
  };

  const handleSend = async (textToSend?: string) => {
    const promptToSubmit = (textToSend || inputPrompt).trim();
    if (!promptToSubmit || isLoading) return;

    setInputPrompt('');
    addAIMessage({
      role: 'user',
      content: promptToSubmit,
      category: selectedCategory,
    });

    setIsLoading(true);

    try {
      const response = await generateCreativeResponse({
        prompt: promptToSubmit,
        category: selectedCategory,
        apiKey: settings.openaiApiKey,
      });

      addAIMessage({
        role: 'assistant',
        content: response.text,
        category: selectedCategory,
        suggestedAction: response.suggestedAction,
      });
    } catch (e) {
      addAIMessage({
        role: 'assistant',
        content: 'I encountered an issue processing your creative brief. Please try rephrasing your request.',
        category: selectedCategory,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteAction = (msgId: string, action: any) => {
    if (!action) return;

    if (action.type === 'create_idea') {
      addJournalEntry({
        date: new Date().toISOString().split('T')[0],
        title: action.payload.title,
        category: 'Creative Thought',
        content: `Generated with FrameFlow Muse:\n\n${action.payload.title}\nTags: ${action.payload.tags?.join(', ')}`,
        tags: action.payload.tags || ['AI Spark'],
      });
      setAppliedId(msgId);
    } else if (action.type === 'create_shot') {
      addShot(action.payload);
      setAppliedId(msgId);
    } else if (onApplyAction) {
      onApplyAction(action);
      setAppliedId(msgId);
    } else {
      navigator.clipboard.writeText(action.payload);
      setAppliedId(msgId);
    }

    setTimeout(() => setAppliedId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-[#0F1117] border-l border-[#232734] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#232734] flex items-center justify-between bg-[#12151D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#F4F4F6] tracking-wide flex items-center gap-2">
                FrameFlow Muse
                <span className="text-[10px] font-mono uppercase bg-[#1B202D] text-[#E5A93C] px-2 py-0.5 rounded border border-[#2A3245]">
                  AI Creative Advisor
                </span>
              </h2>
              <p className="text-xs text-[#9CA3AF]">Cinematic guidance across your entire creative pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1C202C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe Guarantee Banner */}
        <div className="px-5 py-2 bg-[#141822] border-b border-[#1E2330] flex items-center justify-between text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Preserves original work — suggestions require approval</span>
          </div>
          <span className="text-[11px] text-[#606675]">
            {settings.openaiApiKey ? 'Custom OpenAI Active' : 'Native Creative Engine'}
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-5 py-2.5 bg-[#11131A] border-b border-[#232734] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'general', label: 'General', icon: Lightbulb },
            { id: 'photography', label: 'Photo', icon: Camera },
            { id: 'screenwriting', label: 'Screenplay', icon: FileText },
            { id: 'documentary', label: 'Documentary', icon: Video },
            { id: 'production', label: 'Production', icon: Clapperboard },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#E5A93C] text-black shadow-sm font-semibold'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1E29]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {aiMessages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedId === msg.id;
            const isApplied = appliedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#F4F4F6]'
                      : 'bg-[#151821] border border-[#232734] text-[#E4E4E7]'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232734] text-[11px] text-[#9CA3AF]">
                      <span className="font-serif italic text-[#E5A93C]">FrameFlow Creative Counsel</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-white text-[#9CA3AF] transition-colors"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap space-y-2">{msg.content}</div>

                  {/* Suggestion Action Card */}
                  {!isUser && msg.suggestedAction && (
                    <div className="mt-3 pt-3 border-t border-[#232734] flex items-center justify-between gap-2 bg-[#101218] p-2.5 rounded-lg">
                      <div className="min-w-0">
                        <span className="text-[11px] uppercase tracking-wider text-[#E5A93C] font-semibold block">
                          Suggested Action
                        </span>
                        <span className="text-xs text-[#9CA3AF] truncate block">
                          {msg.suggestedAction.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleExecuteAction(msg.id, msg.suggestedAction)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                          isApplied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-[#E5A93C] text-black hover:bg-[#F3BE65]'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <span>Accept</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-[#151821] border border-[#232734] rounded-xl text-xs text-[#9CA3AF] w-fit">
              <Sparkles className="w-4 h-4 text-[#E5A93C] animate-spin" />
              <span>Developing creative response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-5 py-2 bg-[#12151D] border-t border-[#1F2330]">
          <p className="text-[11px] text-[#606675] mb-1.5 font-medium uppercase tracking-wider">
            Quick Prompts
          </p>
          <div className="flex flex-col gap-1.5">
            {quickPrompts[selectedCategory].slice(0, 2).map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-left text-xs text-[#9CA3AF] hover:text-[#E5A93C] bg-[#161922] hover:bg-[#1C202C] px-3 py-1.5 rounded border border-[#232734] transition-colors truncate"
              >
                &ldquo;{qp}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#232734] bg-[#12151D]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask Muse for ${selectedCategory} ideas, dialogue polish, or shot lists...`}
              disabled={isLoading}
              className="flex-1 bg-[#181B24] border border-[#262B3A] rounded-lg px-3.5 py-2.5 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2.5 rounded-lg bg-[#E5A93C] text-black hover:bg-[#F3BE65] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
