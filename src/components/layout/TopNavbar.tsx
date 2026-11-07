'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Sparkles,
  Menu,
  Camera,
  Film,
  Video,
  FileText,
  Lightbulb,
  Palette,
  ChevronDown,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenAI: () => void;
  onOpenNewProject: (defaultCategory?: string) => void;
  onOpenIdeaModal: () => void;
}

export function TopNavbar({
  onToggleMobileMenu,
  onOpenCommandPalette,
  onOpenAI,
  onOpenNewProject,
  onOpenIdeaModal,
}: TopNavbarProps) {
  const router = useRouter();
  const { settings } = useFrameFlow();
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  return (
    <header className="h-16 px-4 md:px-6 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#1F232E] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#181B24]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141720] border border-[#232734] hover:border-[#383F52] text-xs text-[#9CA3AF] hover:text-[#F4F4F6] transition-colors w-48 sm:w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="truncate">Search or jump to...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#1C202C] border border-[#2B3041] text-[10px] font-mono text-[#606675]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* FrameFlow Muse AI Trigger */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] hover:bg-[#E5A93C]/20 transition-all text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Ask Muse</span>
        </button>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickOpen(!isQuickOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isQuickOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-[#12151D] border border-[#262B3A] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsQuickOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#606675]">
                Quick Create
              </div>
              <button
                onClick={() => onOpenNewProject('Photography')}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
                New Photography Project
              </button>
              <button
                onClick={() => onOpenNewProject('Short Film')}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <Film className="w-3.5 h-3.5 text-[#E5A93C]" />
                New Film Project
              </button>
              <button
                onClick={() => onOpenNewProject('Documentary')}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <Video className="w-3.5 h-3.5 text-[#E5A93C]" />
                New Documentary
              </button>
              <button
                onClick={() => onOpenNewProject('Screenplay')}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#E5A93C]" />
                New Script
              </button>
              <div className="my-1 border-t border-[#1F232E]" />
              <button
                onClick={onOpenIdeaModal}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Capture an Idea
              </button>
              <button
                onClick={() => router.push('/inspiration')}
                className="w-full px-3 py-2 text-left text-xs text-[#F4F4F6] hover:bg-[#1A1E29] flex items-center gap-2.5"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                Create a Moodboard
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 group"
          title="Creator Profile & Settings"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2B3041] group-hover:border-[#E5A93C] transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={settings.creatorName}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
