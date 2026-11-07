'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Camera,
  FileText,
  Video,
  Clapperboard,
  Lightbulb,
  BookOpen,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAI: () => void;
}

export function SidebarNav({ collapsed, onToggleCollapse, onOpenAI }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'My Projects', href: '/projects', icon: FolderKanban },
    { name: 'Photography Studio', href: '/photography', icon: Camera },
    { name: 'Scriptwriting Studio', href: '/scripts', icon: FileText },
    { name: 'Documentary Studio', href: '/documentary', icon: Video },
    { name: 'Film Production', href: '/production', icon: Clapperboard },
    { name: 'Inspiration Vault', href: '/inspiration', icon: Lightbulb },
    { name: 'Creative Journal', href: '/journal', icon: BookOpen },
    { name: 'Archive', href: '/archive', icon: Archive },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col h-screen bg-[#0E1015] border-r border-[#1F232E] transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#1F232E]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5A93C] to-[#996515] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-serif font-black text-black text-lg tracking-tight">F</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col transition-opacity duration-200">
              <span className="font-serif font-bold text-base tracking-wider text-[#F4F4F6] leading-none">
                FRAMEFLOW
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#9CA3AF] mt-1 font-mono">
                Creative OS
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded text-[#606675] hover:text-white hover:bg-[#1A1D27] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Assistant Quick Trigger */}
      <div className="p-3 border-b border-[#1A1D27]">
        <button
          onClick={onOpenAI}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] transition-all group ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open AI Creative Assistant (Muse)"
        >
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          {!collapsed && (
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="text-xs font-semibold leading-tight">FrameFlow Muse</span>
              <span className="text-[10px] text-[#D4A373] truncate">AI Creative Assistant</span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#181B24] text-[#E5A93C] border border-[#2B3041] shadow-xs'
                  : 'text-[#9CA3AF] hover:text-[#F4F4F6] hover:bg-[#151720]'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E5A93C]' : 'text-[#6B7280]'}`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Tagline / Creator status */}
      {!collapsed && (
        <div className="p-4 border-t border-[#1F232E] text-[11px] text-[#606675]">
          <p className="font-serif italic text-[#9CA3AF]/80">
            &ldquo;Every idea deserves to become a story.&rdquo;
          </p>
          <p className="mt-1 text-[10px] uppercase font-mono tracking-wider text-[#606675]">
            FrameFlow v2.4 • Offline-First
          </p>
        </div>
      )}
    </aside>
  );
}
