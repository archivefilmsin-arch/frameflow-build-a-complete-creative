'use client';

import { useState, useEffect, Suspense } from 'react';
import { SidebarNav } from './SidebarNav';
import { TopNavbar } from './TopNavbar';
import { CommandPalette } from './CommandPalette';
import { AICreativeAssistantDrawer } from '../ai/AICreativeAssistantDrawer';
import { NewProjectModal } from '../projects/NewProjectModal';
import { QuickIdeaModal } from '../journal/QuickIdeaModal';

interface FrameFlowShellProps {
  children: React.ReactNode;
}

export function FrameFlowShell({ children }: FrameFlowShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectCategory, setNewProjectCategory] = useState<string | undefined>();
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Keyboard shortcut for command palette: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAI = (prompt?: string) => {
    setAiPrompt(prompt);
    setIsAIOpen(true);
  };

  const handleOpenNewProject = (category?: string) => {
    setNewProjectCategory(category);
    setIsNewProjectOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-[#090A0D] text-[#F4F4F6] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Suspense fallback={<div className="w-64 bg-[#0E1015]" />}>
          <SidebarNav
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            onOpenAI={() => handleOpenAI()}
          />
        </Suspense>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 z-50">
            <Suspense fallback={<div className="w-64 bg-[#0E1015]" />}>
              <SidebarNav
                collapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
                onOpenAI={() => {
                  setMobileOpen(false);
                  handleOpenAI();
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Suspense fallback={<div className="h-16 bg-[#0B0D12]" />}>
          <TopNavbar
            onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
            onOpenCommandPalette={() => setIsCommandOpen(true)}
            onOpenAI={() => handleOpenAI()}
            onOpenNewProject={handleOpenNewProject}
            onOpenIdeaModal={() => setIsIdeaModalOpen(true)}
          />
        </Suspense>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenAI={handleOpenAI}
      />

      <AICreativeAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialPrompt={aiPrompt}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        defaultCategory={newProjectCategory}
      />

      <QuickIdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
      />
    </div>
  );
}
