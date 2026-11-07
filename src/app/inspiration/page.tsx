'use client';

import { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Search,
  Filter,
  Image as ImageIcon,
  Quote,
  Film,
  Link2,
  Tag,
  Palette,
  Layers,
  Sparkles,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { InspirationItem, MoodboardItem } from '@/types';

export default function InspirationVaultPage() {
  const {
    inspiration,
    moodboards,
    projects,
    addInspiration,
    deleteInspiration,
    addMoodboard,
  } = useFrameFlow();

  const [activeTab, setActiveTab] = useState<'vault' | 'moodboards'>('vault');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);

  // Form state - Inspiration
  const [title, setTitle] = useState('');
  const [type, setType] = useState<InspirationItem['type']>('film_still');
  const [content, setContent] = useState('');
  const [desc, setDesc] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [linkedProj, setLinkedProj] = useState('');
  const [paletteInput, setPaletteInput] = useState('#0C0F17, #253549, #D4813B');

  // Form state - Moodboard
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDesc, setBoardDesc] = useState('');

  const types = ['All', 'film_still', 'image', 'quote', 'link', 'concept'];

  const filteredItems = inspiration.filter((item) => {
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCreateInspiration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const palette = paletteInput.split(',').map((c) => c.trim()).filter(Boolean);

    addInspiration({
      title,
      type,
      content,
      description: desc,
      authorOrSource: author,
      tags: tags.length > 0 ? tags : ['Visual'],
      palette: palette.length > 0 ? palette : undefined,
      projectId: linkedProj || undefined,
    });

    setTitle('');
    setContent('');
    setDesc('');
    setAuthor('');
    setTagsInput('');
    setIsAddModalOpen(false);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    addMoodboard({
      title: boardTitle,
      description: boardDesc,
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      elements: [
        {
          id: `mbe-${Date.now()}`,
          imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
          caption: 'Atmosphere study',
        },
      ],
    });

    setBoardTitle('');
    setBoardDesc('');
    setIsAddBoardOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Creative References & Visual Research</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            Inspiration Vault
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            A private visual sanctuary for cinematographic stills, lighting palettes, quotes, and moodboards
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'vault' ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Save Inspiration</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddBoardOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Moodboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs: Vault Items vs Moodboards */}
      <div className="flex items-center gap-1 border-b border-[#232734] pb-px">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'vault'
              ? 'border-[#E5A93C] text-[#E5A93C] font-semibold bg-[#13161F]'
              : 'border-transparent text-[#9CA3AF] hover:text-white'
          }`}
        >
          Visual Archive ({inspiration.length})
        </button>
        <button
          onClick={() => setActiveTab('moodboards')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'moodboards'
              ? 'border-[#E5A93C] text-[#E5A93C] font-semibold bg-[#13161F]'
              : 'border-transparent text-[#9CA3AF] hover:text-white'
          }`}
        >
          Curated Moodboards ({moodboards.length})
        </button>
      </div>

      {/* 1. VAULT ITEMS VIEW */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#606675] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visual archive..."
                className="w-full bg-[#12151D] border border-[#232734] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F4F6] placeholder-[#606675] outline-none"
              />
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-all ${
                    selectedType === t
                      ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40'
                      : 'text-[#9CA3AF] hover:text-white bg-[#12151D]'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Pinterest-Style Masonry Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => {
              const isImage = item.type === 'film_still' || item.type === 'image';
              const isQuote = item.type === 'quote';
              const isConcept = item.type === 'concept';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] transition-all break-inside-avoid flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {isImage && item.content.startsWith('http') && (
                      <div className="relative w-full overflow-hidden bg-[#181B24]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.content}
                          alt={item.title}
                          className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <button
                          onClick={() => deleteInspiration(item.id)}
                          className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                          {item.type.replace('_', ' ')}
                        </span>
                        {!isImage && (
                          <button
                            onClick={() => deleteInspiration(item.id)}
                            className="text-[#606675] hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#F4F4F6] group-hover:text-[#E5A93C] transition-colors">
                        {item.title}
                      </h3>

                      {isQuote ? (
                        <blockquote className="border-l-2 border-[#E5A93C] pl-3 py-1 font-serif text-sm italic text-white leading-relaxed">
                          {item.content}
                        </blockquote>
                      ) : (
                        item.description && (
                          <p className="text-xs text-[#9CA3AF] leading-relaxed">
                            {item.description}
                          </p>
                        )
                      )}

                      {/* Color Palette Swatches */}
                      {item.palette && item.palette.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono uppercase text-[#606675] block">
                            Dominant Palette
                          </span>
                          <div className="flex items-center gap-1.5">
                            {item.palette.map((color, idx) => (
                              <div
                                key={idx}
                                className="h-6 flex-1 rounded-md border border-black/30 shadow-xs"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-[#141720] border-t border-[#1C202C] flex items-center justify-between text-[11px] text-[#606675]">
                    <span>{item.authorOrSource || 'Saved Asset'}</span>
                    <div className="flex gap-1">
                      {item.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[#9CA3AF]">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MOODBOARDS VIEW */}
      {activeTab === 'moodboards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moodboards.map((board) => (
              <div
                key={board.id}
                className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4 hover:border-[#383F52] transition-colors"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">{board.title}</h3>
                    <p className="text-xs text-[#9CA3AF]">{board.description}</p>
                  </div>
                  <span className="text-xs font-mono text-[#E5A93C]">
                    {board.elements.length} visuals
                  </span>
                </div>

                {/* Moodboard Collage */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {board.elements.map((el) => (
                    <div key={el.id} className="aspect-square rounded-xl overflow-hidden bg-[#181B24]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={el.imageUrl} alt={el.caption || 'Board frame'} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Inspiration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Save Creative Inspiration</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInspiration} className="space-y-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Roger Deakins Silhouette"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Asset Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="film_still">Film Still</option>
                    <option value="image">Photography</option>
                    <option value="quote">Quote / Proverb</option>
                    <option value="link">Website Link</option>
                    <option value="concept">Creative Concept</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Author / Source</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Film or Artist..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  {type === 'quote' ? 'Quote Text *' : 'Image URL or Link *'}
                </label>
                <input
                  type="text"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'quote' ? '“A film is or should be...”' : 'https://...'}
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Creative Analysis / Notes</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Why this lighting or composition resonates..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Color Palette (Hex codes, comma separated)</label>
                <input
                  type="text"
                  value={paletteInput}
                  onChange={(e) => setPaletteInput(e.target.value)}
                  placeholder="#0C0F17, #253549, #D4813B"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Moodboard Modal */}
      {isAddBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Create New Moodboard</h3>
              <button onClick={() => setIsAddBoardOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-3">
              <input
                type="text"
                required
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                placeholder="Moodboard Title *"
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={boardDesc}
                onChange={(e) => setBoardDesc(e.target.value)}
                placeholder="Visual theme & intent..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddBoardOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
