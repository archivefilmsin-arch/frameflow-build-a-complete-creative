'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ProjectCategory, ProjectStatus } from '@/types';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

const COVER_PRESETS = [
  { label: 'Desert Noir', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rainy Nocturne', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Analog Studio', url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Brutalist Mist', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kyoto Cedars', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
];

export function NewProjectModal({ isOpen, onClose, defaultCategory = 'Feature Film' }: NewProjectModalProps) {
  const { addProject } = useFrameFlow();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>(defaultCategory as ProjectCategory);
  const [status, setStatus] = useState<ProjectStatus>('Pre-Production');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory as ProjectCategory);
    }
    if (!startDate) {
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [defaultCategory, startDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      title,
      description,
      category,
      coverImage,
      startDate,
      targetDate: targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status,
      tags: tags.length > 0 ? tags : [category],
      progress: status === 'Completed' ? 100 : status === 'In Production' ? 50 : 15,
    });

    onClose();
    setTitle('');
    setDescription('');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#12151D] border border-[#232734] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232734] flex items-center justify-between bg-[#151923]">
          <div>
            <h2 className="text-base font-semibold text-[#F4F4F6] font-serif">
              Initialize New Creative Project
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Every production begins with a dedicated workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1E2330] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Echoes of the High Desert"
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60"
              >
                <option value="Photography">Photography</option>
                <option value="Short Film">Short Film</option>
                <option value="Feature Film">Feature Film</option>
                <option value="Documentary">Documentary</option>
                <option value="Screenplay">Screenplay</option>
                <option value="Travel Story">Travel Story</option>
                <option value="Personal Creative Project">Personal Creative Project</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60"
              >
                <option value="Idea">Idea</option>
                <option value="Pre-Production">Pre-Production</option>
                <option value="In Production">In Production</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
              Premise / Logline / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the thematic core, logline, or visual atmosphere..."
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Target Completion Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none focus:border-[#E5A93C]/60"
              />
            </div>
          </div>

          {/* Cover image selection */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60 mb-2"
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {COVER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => setCoverImage(preset.url)}
                  className={`h-12 w-20 rounded-md overflow-hidden relative border transition-all shrink-0 ${
                    coverImage === preset.url ? 'border-[#E5A93C] ring-1 ring-[#E5A93C]' : 'border-[#262B3B] opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-center truncate py-0.5 text-[#F4F4F6]">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. 35mm, Neo-Western, Monochrome, Anamorphic"
              className="w-full bg-[#181B25] border border-[#262B3B] rounded-lg px-3.5 py-2 text-sm text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#232734] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1C202C] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-colors shadow-sm"
            >
              Launch Project Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
