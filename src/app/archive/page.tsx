'use client';

import Link from 'next/link';
import {
  Archive,
  RotateCcw,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

export default function ArchivePage() {
  const { projects, restoreProject } = useFrameFlow();

  // Completed or Archived projects
  const archivedProjects = projects.filter((p) => p.status === 'Completed' || p.status === 'Archived' || p.archived);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <Archive className="w-3.5 h-3.5" />
            <span>Permanent Retrospective Vault</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            The Creative Archive
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            A permanent library of completed films, published photographic collections, locked screenplays, and lifetime milestones
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#181B24] border border-[#262B3A] text-xs font-mono text-[#E5A93C]">
          <Award className="w-4 h-4" />
          <span>{archivedProjects.length} Completed Projects</span>
        </div>
      </div>

      {/* Grid of Archived Projects */}
      {archivedProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#11131A] border border-[#202430]">
          <Archive className="w-10 h-10 mx-auto text-[#606675] mb-3 opacity-50" />
          <h3 className="text-base font-serif font-semibold text-white">No Archived Projects Yet</h3>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Completed projects and archived works will be preserved here indefinitely.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedProjects.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="relative h-44 w-full bg-[#181B24] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-black/70 text-[#E5A93C] border border-black/40">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Archived
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#1C202C] flex items-center justify-between">
                <button
                  onClick={() => restoreProject(p.id)}
                  className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#E5A93C] transition-colors"
                  title="Restore back to Active Workspace"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>

                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-1 text-xs text-[#E5A93C] hover:underline font-medium"
                >
                  Revisit
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
