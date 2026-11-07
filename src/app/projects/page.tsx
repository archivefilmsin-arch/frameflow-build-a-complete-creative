'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Columns,
  Clock,
  Sparkles,
  Tag,
  ArrowRight,
  Archive,
  Trash2,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { ProjectCategory, ProjectStatus } from '@/types';
import { NewProjectModal } from '@/components/projects/NewProjectModal';

export default function ProjectsPage() {
  const { projects, archiveProject, deleteProject } = useFrameFlow();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories: (ProjectCategory | 'All')[] = [
    'All',
    'Photography',
    'Short Film',
    'Feature Film',
    'Documentary',
    'Screenplay',
    'Travel Story',
    'Personal Creative Project',
  ];

  const statuses: (ProjectStatus | 'All')[] = [
    'All',
    'Idea',
    'Pre-Production',
    'In Production',
    'Post-Production',
    'Completed',
  ];

  // Filter projects (exclude archived in main view)
  const filtered = projects.filter((p) => {
    if (p.archived || p.status === 'Archived') return false;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Central Management</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            My Projects
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            The heart of FrameFlow — every creative ambition organized in a dedicated workspace
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-all shadow-md shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Control Bar: Search, Category Filters, Views */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative min-w-[240px] sm:w-64">
            <Search className="w-4 h-4 text-[#606675] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, tag, theme..."
              className="w-full bg-[#12151D] border border-[#232734] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
            />
          </div>

          {/* Category Dropdown on small, horizontal scroll on larger */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40 shadow-xs'
                    : 'text-[#9CA3AF] hover:text-white bg-[#12151D] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher & Status Filter */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#12151D] border border-[#232734] rounded-lg px-3 py-1.5 text-xs text-[#9CA3AF] outline-none"
          >
            <option value="All">All Statuses</option>
            {statuses.filter((s) => s !== 'All').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg bg-[#12151D] border border-[#232734] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[#1E2330] text-[#E5A93C]' : 'text-[#606675] hover:text-[#9CA3AF]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[#1E2330] text-[#E5A93C]' : 'text-[#606675] hover:text-[#9CA3AF]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'kanban' ? 'bg-[#1E2330] text-[#E5A93C]' : 'text-[#606675] hover:text-[#9CA3AF]'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Render Based on View Mode */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#11131A] border border-[#202430]">
          <FolderKanban className="w-10 h-10 mx-auto text-[#606675] mb-3 opacity-60" />
          <h3 className="text-base font-serif font-semibold text-[#F4F4F6]">
            No projects matched your criteria
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, or launch a brand new creative workspace.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-colors"
          >
            Create New Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] hover:shadow-2xl transition-all"
            >
              {/* Cover Card */}
              <div className="relative h-48 w-full overflow-hidden bg-[#181B24]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-transparent opacity-85" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-xs text-[#E5A93C] border border-[#E5A93C]/30">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/70 backdrop-blur-xs text-[#9CA3AF]">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="font-serif font-bold text-lg text-[#F4F4F6] group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress Bar & Details */}
                <div className="space-y-3 pt-3 border-t border-[#1C202C]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#606675]">Milestone Progress</span>
                    <span className="font-mono text-[#E5A93C] font-semibold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#191D26] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B87E20] to-[#E5A93C] rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#606675] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Target: {project.targetDate}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => archiveProject(project.id)}
                        className="hover:text-amber-400 p-1 transition-colors"
                        title="Archive project"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="hover:text-rose-400 p-1 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-[#E5A93C] hover:underline flex items-center gap-1 font-medium pl-2"
                      >
                        Enter
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="rounded-xl border border-[#202430] bg-[#11131A] overflow-hidden divide-y divide-[#1D212C]">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#151821] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#181B24]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-serif font-bold text-base text-[#F4F4F6] hover:text-[#E5A93C] transition-colors truncate"
                    >
                      {project.title}
                    </Link>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] truncate mt-0.5 max-w-xl">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end">
                <div className="w-32 hidden sm:block">
                  <div className="flex items-center justify-between text-[11px] text-[#606675] mb-1">
                    <span>{project.progress}%</span>
                    <span>{project.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#191D26] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E5A93C] rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => archiveProject(project.id)}
                    className="text-[#606675] hover:text-amber-400 p-1"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/projects/${project.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs text-[#E5A93C] hover:bg-[#E5A93C] hover:text-black transition-colors font-medium"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {(['Idea', 'Pre-Production', 'In Production', 'Completed'] as ProjectStatus[]).map((statusCol) => {
            const colProjects = filtered.filter((p) => p.status === statusCol);
            return (
              <div key={statusCol} className="rounded-xl bg-[#101218] border border-[#202430] p-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1C202C]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF]">
                    {statusCol}
                  </span>
                  <span className="text-xs font-mono text-[#E5A93C] bg-[#181B24] px-2 py-0.5 rounded">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="block p-3.5 rounded-lg bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 transition-all group shadow-sm"
                    >
                      <span className="text-[10px] font-mono text-[#E5A93C] uppercase block mb-1">
                        {p.category}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-[#F4F4F6] group-hover:text-[#E5A93C] line-clamp-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1">
                        {p.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-[#202430] flex items-center justify-between text-[11px] text-[#606675]">
                        <span>Progress: {p.progress}%</span>
                        <span>{p.targetDate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
