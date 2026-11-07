'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderKanban,
  Camera,
  FileText,
  Video,
  Clapperboard,
  Lightbulb,
  BookOpen,
  Archive,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI: (initialPrompt?: string) => void;
}

interface PaletteItem {
  name: string;
  sub?: string;
  href: string;
  icon: any;
  section: string;
}

export function CommandPalette({ isOpen, onClose, onOpenAI }: CommandPaletteProps) {
  const router = useRouter();
  const { projects, scripts, photos, journal, shootPlans } = useFrameFlow();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items based on query
  const q = query.toLowerCase();

  const navigationItems = [
    { name: 'Home Dashboard', href: '/', icon: Clapperboard, section: 'Navigation' },
    { name: 'My Projects', href: '/projects', icon: FolderKanban, section: 'Navigation' },
    { name: 'Photography Studio', href: '/photography', icon: Camera, section: 'Navigation' },
    { name: 'Scriptwriting Studio', href: '/scripts', icon: FileText, section: 'Navigation' },
    { name: 'Documentary Studio', href: '/documentary', icon: Video, section: 'Navigation' },
    { name: 'Film Production', href: '/production', icon: Clapperboard, section: 'Navigation' },
    { name: 'Inspiration Vault', href: '/inspiration', icon: Lightbulb, section: 'Navigation' },
    { name: 'Creative Journal', href: '/journal', icon: BookOpen, section: 'Navigation' },
    { name: 'Archive', href: '/archive', icon: Archive, section: 'Navigation' },
    { name: 'Settings', href: '/settings', icon: Settings, section: 'Navigation' },
  ].filter((item) => item.name.toLowerCase().includes(q));

  const matchedProjects = projects
    .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .slice(0, 4)
    .map((p) => ({
      name: p.title,
      sub: `${p.category} • ${p.status}`,
      href: `/projects/${p.id}`,
      icon: FolderKanban,
      section: 'Projects',
    }));

  const matchedScripts = scripts
    .filter((s) => s.title.toLowerCase().includes(q))
    .slice(0, 3)
    .map((s) => ({
      name: s.title,
      sub: s.version,
      href: '/scripts',
      icon: FileText,
      section: 'Scripts',
    }));

  const matchedPhotos = photos
    .filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
    .slice(0, 3)
    .map((p) => ({
      name: p.title,
      sub: `${p.camera || 'Photo'} • ${p.location || 'Library'}`,
      href: '/photography',
      icon: Camera,
      section: 'Photographs',
    }));

  const matchedJournal: PaletteItem[] = journal
    .filter((j) => j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q))
    .slice(0, 3)
    .map((j) => ({
      name: j.title,
      sub: `${j.category} • ${j.date}`,
      href: '/journal',
      icon: BookOpen,
      section: 'Journal',
    }));

  const allItems: PaletteItem[] = [
    ...navigationItems,
    ...matchedProjects,
    ...matchedScripts,
    ...matchedPhotos,
    ...matchedJournal,
  ];

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#12151C] border border-[#232734] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#232734] gap-3">
          <Search className="w-5 h-5 text-[#E5A93C]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, scripts, photos, ideas or type a command..."
            className="flex-1 bg-transparent text-[#F4F4F6] placeholder-[#606675] outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#9CA3AF] hover:text-white rounded-md hover:bg-[#1E222C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Quick Spark Button */}
        {query.trim().length > 0 && (
          <div className="px-4 py-2.5 bg-[#161A23] border-b border-[#232734] flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF]">
              Ask FrameFlow Muse about &quot;<span className="text-[#E5A93C]">{query}</span>&quot;
            </span>
            <button
              onClick={() => {
                onOpenAI(`Help me explore ideas and creative directions for: ${query}`);
                onClose();
              }}
              className="text-xs flex items-center gap-1.5 px-2.5 py-1 bg-[#E5A93C]/15 text-[#E5A93C] hover:bg-[#E5A93C]/25 border border-[#E5A93C]/30 rounded-md transition-all font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI Muse
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto py-2">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-[#606675]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No creative assets found for &quot;{query}&quot;</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Try searching by title, category, character, or studio</p>
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={`${item.section}-${item.name}-${idx}`}
                  onClick={() => handleSelect(item.href)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#1C202C] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#181B24] border border-[#262B3A] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#E5A93C] group-hover:border-[#E5A93C]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F4F4F6] truncate group-hover:text-white">
                        {item.name}
                      </p>
                      {item.sub && (
                        <p className="text-xs text-[#606675] truncate">{item.sub}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#161922] text-[#606675] border border-[#232734]">
                    {item.section}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#232734] bg-[#0E1015] flex items-center justify-between text-[11px] text-[#606675]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#191D27] border border-[#2B3041] text-[#9CA3AF]">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#191D27] border border-[#2B3041] text-[#9CA3AF]">↵</kbd> to select</span>
          </div>
          <span className="text-[#E5A93C]/80 font-serif italic">Every idea deserves to become a story</span>
        </div>
      </div>
    </div>
  );
}
