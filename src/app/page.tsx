'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Camera,
  Film,
  Video,
  FileText,
  Lightbulb,
  Palette,
  ArrowRight,
  Clock,
  FolderKanban,
  CheckCircle2,
  Calendar,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

const CREATIVE_QUOTES = [
  { quote: 'Every story is a journey into the dark with a lantern that only casts light three steps ahead.', author: 'Robert McKee' },
  { quote: 'A photograph is the pause button on life. Cinema is life running at 24 frames per second.', author: 'Agnès Varda' },
  { quote: 'If it can be written, or thought, it can be filmed.', author: 'Stanley Kubrick' },
  { quote: 'The camera sees more than the eye, so why not make use of it?', author: 'Edward Weston' },
  { quote: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', author: 'Marcel Proust' },
];

export default function HomeDashboard() {
  const router = useRouter();
  const {
    settings,
    projects,
    photos,
    scripts,
    researchNotes,
    journal,
    activities,
    challenge,
  } = useFrameFlow();

  const [greeting, setGreeting] = useState('Welcome');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17 && hour < 22) setGreeting('Good evening');
    else setGreeting('Night session');

    // Random quote or day based
    const qIdx = Math.floor(Math.random() * CREATIVE_QUOTES.length);
    setQuoteIndex(qIdx);
  }, []);

  const activeProjects = projects.filter((p) => p.status !== 'Completed' && p.status !== 'Archived');
  const recentProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 4);

  const completedChallenges = challenge.submissions.filter((s) => s.completed).length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* 1. Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141822] via-[#10131A] to-[#0D0F14] border border-[#232734] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5A93C]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/25 text-[#E5A93C] text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Workspace Active</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F4F4F6] tracking-tight leading-tight">
            {greeting}, <span className="text-[#E5A93C]">{settings.creatorName.split(' ')[0]}</span>.
          </h1>

          <blockquote className="border-l-2 border-[#E5A93C]/40 pl-4 py-1 text-sm md:text-base italic text-[#9CA3AF] font-serif">
            &ldquo;{CREATIVE_QUOTES[quoteIndex].quote}&rdquo;
            <span className="block not-italic text-xs text-[#606675] font-sans mt-1">
              — {CREATIVE_QUOTES[quoteIndex].author}
            </span>
          </blockquote>

          {/* Quick-Create Launcher */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              href="/photography"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs font-medium text-[#F4F4F6] hover:border-[#E5A93C]/50 hover:text-[#E5A93C] transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
              New Photography Session
            </Link>
            <Link
              href="/scripts"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs font-medium text-[#F4F4F6] hover:border-[#E5A93C]/50 hover:text-[#E5A93C] transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-[#E5A93C]" />
              Open Screenplay Editor
            </Link>
            <Link
              href="/production"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs font-medium text-[#F4F4F6] hover:border-[#E5A93C]/50 hover:text-[#E5A93C] transition-all"
            >
              <Film className="w-3.5 h-3.5 text-[#E5A93C]" />
              Film Production Board
            </Link>
            <Link
              href="/documentary"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs font-medium text-[#F4F4F6] hover:border-[#E5A93C]/50 hover:text-[#E5A93C] transition-all"
            >
              <Video className="w-3.5 h-3.5 text-[#E5A93C]" />
              Documentary Vault
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Creative Overview Metrics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#9CA3AF]">
            Creative Overview
          </h2>
          <span className="text-xs text-[#606675]">Real-time synchronized</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 md:gap-4">
          <div className="p-4 rounded-xl bg-[#11131A] border border-[#202430] hover:border-[#32394C] transition-all">
            <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
              <span className="text-xs">Active Projects</span>
              <FolderKanban className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#F4F4F6]">
              {activeProjects.length}
            </div>
            <div className="text-[11px] text-[#606675] mt-1 truncate">
              {projects.length} lifetime projects
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#11131A] border border-[#202430] hover:border-[#32394C] transition-all">
            <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
              <span className="text-xs">Photographs</span>
              <Camera className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#F4F4F6]">
              {photos.length}
            </div>
            <div className="text-[11px] text-[#606675] mt-1 truncate">
              Day {completedChallenges}/100 streak
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#11131A] border border-[#202430] hover:border-[#32394C] transition-all">
            <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
              <span className="text-xs">Scripts In Progress</span>
              <FileText className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#F4F4F6]">
              {scripts.length}
            </div>
            <div className="text-[11px] text-[#606675] mt-1 truncate">
              Fountain formatted
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#11131A] border border-[#202430] hover:border-[#32394C] transition-all">
            <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
              <span className="text-xs">Documentaries</span>
              <Video className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#F4F4F6]">
              {researchNotes.length}
            </div>
            <div className="text-[11px] text-[#606675] mt-1 truncate">
              Research investigations
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#11131A] border border-[#202430] hover:border-[#32394C] transition-all col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
              <span className="text-xs">Ideas Captured</span>
              <Lightbulb className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#F4F4F6]">
              {journal.length}
            </div>
            <div className="text-[11px] text-[#606675] mt-1 truncate">
              Journal & sparks saved
            </div>
          </div>
        </div>
      </section>

      {/* 3. Continue Creating (Recently Accessed Projects) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#F4F4F6]">
              Continue Creating
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Pick up where your last creative spark left off
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs text-[#E5A93C] hover:underline flex items-center gap-1 group font-medium"
          >
            All Projects
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map((p) => {
            const formattedDate = new Date(p.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] hover:shadow-xl transition-all"
              >
                {/* Cover Image Container */}
                <div className="relative h-40 w-full overflow-hidden bg-[#181B24]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-xs text-[#E5A93C] border border-black/40">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-xs text-[#9CA3AF]">
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#F4F4F6] group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  {/* Progress & Meta */}
                  <div className="space-y-2 pt-2 border-t border-[#1C202C]">
                    <div className="flex items-center justify-between text-[11px] text-[#606675]">
                      <span>Progress</span>
                      <span className="font-mono text-[#E5A93C]">{p.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#191D26] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B87E20] to-[#E5A93C] rounded-full transition-all duration-300"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#606675] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      <span>{p.tags.slice(0, 2).join(' • ')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Split Section: Quick Actions & Recent Creative Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <section className="lg:col-span-1 rounded-2xl bg-[#11131A] border border-[#202430] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            <h2 className="text-base font-serif font-bold text-[#F4F4F6]">
              Quick Creative Actions
            </h2>
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Launch immediately into any creative studio discipline
          </p>

          <div className="space-y-2">
            <Link
              href="/photography"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    New Photography Project
                  </h4>
                  <p className="text-[11px] text-[#606675]">Upload library & plan shoot</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/production"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    New Film Production
                  </h4>
                  <p className="text-[11px] text-[#606675]">Shot lists & storyboards</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/documentary"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    New Documentary
                  </h4>
                  <p className="text-[11px] text-[#606675]">Research & interview planner</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/scripts"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    New Screenplay
                  </h4>
                  <p className="text-[11px] text-[#606675]">Industry-standard formatting</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/journal"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    Capture an Idea
                  </h4>
                  <p className="text-[11px] text-[#606675]">Observations & diary prompts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/inspiration"
              className="flex items-center justify-between p-3 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#232734] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F4F6] group-hover:text-[#E5A93C]">
                    Create a Moodboard
                  </h4>
                  <p className="text-[11px] text-[#606675]">Visual inspiration board</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#606675] group-hover:text-white transition-colors" />
            </Link>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="lg:col-span-2 rounded-2xl bg-[#11131A] border border-[#202430] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-[#F4F4F6]">
                Recent Creative Activity
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Chronological log of project milestones, script revisions, and archive additions
              </p>
            </div>
            <span className="text-xs font-mono text-[#E5A93C] bg-[#E5A93C]/10 px-2.5 py-1 rounded border border-[#E5A93C]/20">
              Live Feed
            </span>
          </div>

          <div className="divide-y divide-[#1D212C]">
            {activities.slice(0, 7).map((act) => {
              return (
                <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#E5A93C] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F4F4F6] truncate">
                        <span className="text-[#9CA3AF]">{act.action}:</span>{' '}
                        <span className="text-white font-semibold">{act.target}</span>
                      </p>
                      <p className="text-[11px] text-[#606675] uppercase font-mono tracking-wider">
                        {act.type} studio
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#606675] shrink-0">{act.timestamp}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
