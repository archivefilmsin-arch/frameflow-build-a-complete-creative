'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Sparkles,
  Tag,
  Clock,
  Trash2,
  FolderKanban,
  Edit3,
  X,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { JournalEntry } from '@/types';

export default function CreativeJournalPage() {
  const {
    journal,
    projects,
    addJournalEntry,
    deleteJournalEntry,
  } = useFrameFlow();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'stream' | 'calendar'>('stream');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Form state
  const [entryTitle, setEntryTitle] = useState('');
  const [entryCategory, setEntryCategory] = useState<JournalEntry['category']>('Observation');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState('Contemplative');
  const [entryTags, setEntryTags] = useState('');
  const [linkedProj, setLinkedProj] = useState('');

  const categories = [
    'All',
    'Observation',
    'Travel Experience',
    'Creative Thought',
    'Writing Prompt',
    'Milestone',
    'Random Spark',
  ];

  const filteredEntries = journal.filter((j) => {
    const matchesCategory = selectedCategory === 'All' || j.category === selectedCategory;
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      title: entryTitle,
      category: entryCategory,
      content: entryContent,
      mood: entryMood,
      tags: entryTags.split(',').map((t) => t.trim()).filter(Boolean),
      linkedProjectId: linkedProj || undefined,
    });

    setEntryTitle('');
    setEntryContent('');
    setEntryTags('');
    setLinkedProj('');
    setIsComposerOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Journal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Creative Diary & Observation Archive</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            Creative Journal
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            Record unfiltered observations, travel sensory details, philosophical doubts, and fleeting creative sparks
          </p>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] shadow-md shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Controls: Search, Category Filters, View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#606675] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diary thoughts..."
            className="w-full bg-[#12151D] border border-[#232734] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F4F6] placeholder-[#606675] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40'
                  : 'text-[#9CA3AF] hover:text-white bg-[#12151D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stream View */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => {
          const linkedProject = projects.find((p) => p.id === entry.linkedProjectId);

          return (
            <article
              key={entry.id}
              className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] hover:border-[#383F52] transition-colors space-y-4 group shadow-md"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C202C]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                    {entry.category}
                  </span>
                  <span className="text-xs font-mono text-[#606675] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {entry.date}
                  </span>
                  {entry.mood && (
                    <span className="text-xs text-[#9CA3AF] italic font-serif">
                      Mood: {entry.mood}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {linkedProject && (
                    <Link
                      href={`/projects/${linkedProject.id}`}
                      className="text-[11px] font-mono text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-[#E5A93C]/20"
                    >
                      <FolderKanban className="w-3 h-3" />
                      {linkedProject.title}
                    </Link>
                  )}
                  <button
                    onClick={() => deleteJournalEntry(entry.id)}
                    className="p-1 text-[#606675] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#E5A93C] transition-colors">
                  {entry.title}
                </h3>
                <p className="text-sm font-serif text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-[#606675] bg-[#161922] px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Write Creative Journal Entry</h3>
              <button onClick={() => setIsComposerOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Entry Title *</label>
                <input
                  type="text"
                  required
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="e.g. The Sound of 35mm Gate Friction"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Category</label>
                  <select
                    value={entryCategory}
                    onChange={(e) => setEntryCategory(e.target.value as any)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="Observation">Observation</option>
                    <option value="Travel Experience">Travel Experience</option>
                    <option value="Creative Thought">Creative Thought</option>
                    <option value="Writing Prompt">Writing Prompt</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Random Spark">Random Spark</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Mood</label>
                  <input
                    type="text"
                    value={entryMood}
                    onChange={(e) => setEntryMood(e.target.value)}
                    placeholder="Contemplative..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Link Project</label>
                  <select
                    value={linkedProj}
                    onChange={(e) => setLinkedProj(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none truncate"
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Journal Thoughts *</label>
                <textarea
                  rows={6}
                  required
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  placeholder="Describe the light, dialogue, doubt, or sudden epiphany..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-3 text-xs text-white font-serif leading-relaxed outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={entryTags}
                  onChange={(e) => setEntryTags(e.target.value)}
                  placeholder="Celluloid, Craft, Mood"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9CA3AF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs"
                >
                  Commit to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
