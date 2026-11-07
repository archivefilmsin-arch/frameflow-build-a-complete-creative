'use client';

import { useState } from 'react';
import { X, Sparkles, Lightbulb, Tag } from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

interface QuickIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickIdeaModal({ isOpen, onClose }: QuickIdeaModalProps) {
  const { addJournalEntry, projects } = useFrameFlow();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Random Spark' | 'Observation' | 'Creative Thought' | 'Writing Prompt'>('Random Spark');
  const [linkedProjectId, setLinkedProjectId] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      title: title || 'Untitled Creative Spark',
      category,
      content,
      mood: 'Inspired',
      tags: tags.length > 0 ? tags : ['Idea'],
      linkedProjectId: linkedProjectId || undefined,
    });

    onClose();
    setTitle('');
    setContent('');
    setTagsInput('');
    setLinkedProjectId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#232734] flex items-center justify-between bg-[#151923]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#E5A93C]">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#F4F4F6] font-serif">
                Capture Creative Spark
              </h2>
              <p className="text-[11px] text-[#9CA3AF]">
                Never let an evanescent idea slip away
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1E2330] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
              Idea Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Radio Tower That Broadcasts Silence"
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-1.5 text-xs text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60"
              >
                <option value="Random Spark">Random Spark</option>
                <option value="Observation">Observation</option>
                <option value="Creative Thought">Creative Thought</option>
                <option value="Writing Prompt">Writing Prompt</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                Link to Project (Optional)
              </label>
              <select
                value={linkedProjectId}
                onChange={(e) => setLinkedProjectId(e.target.value)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-1.5 text-xs text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60 truncate"
              >
                <option value="">No Project Link</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
              Concept Notes / Description
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot down the sensory details, dialogue snippet, lighting atmosphere, or story beat..."
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Atmosphere, Sound, Noir (comma separated)"
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-1.5 text-xs text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#232734] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1C202C] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-colors"
            >
              Commit to Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
