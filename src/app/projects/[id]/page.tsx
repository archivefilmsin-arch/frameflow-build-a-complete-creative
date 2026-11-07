'use client';

import { useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  Circle,
  Plus,
  FileText,
  FileDown,
  Trash2,
  Edit3,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
  Archive,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#9CA3AF]">Initializing Project Workspace...</p>
        </div>
      }
    >
      <ProjectWorkspaceContent params={params} />
    </Suspense>
  );
}

function ProjectWorkspaceContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const {
    projects,
    tasks,
    milestones,
    notes,
    documents,
    files,
    inspiration,
    activities,
    updateProject,
    archiveProject,
    deleteProject,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    toggleMilestone,
    addNote,
    deleteNote,
    addDocument,
    updateDocument,
  } = useFrameFlow();

  const project = projects.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'documents' | 'references' | 'tasks' | 'timeline' | 'files' | 'activity'
  >('overview');

  // Form states
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Cinematography');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<'treatment' | 'pitch_deck' | 'contract' | 'outline'>('treatment');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-serif text-[#F4F4F6]">Project Workspace Not Found</h2>
        <p className="text-sm text-[#9CA3AF]">This project may have been deleted or archived.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Projects
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const projectMilestones = milestones.filter((m) => m.projectId === projectId);
  const projectNotes = notes.filter((n) => n.projectId === projectId);
  const projectDocs = documents.filter((d) => d.projectId === projectId);
  const projectFiles = files.filter((f) => f.projectId === projectId);
  const projectInspirations = inspiration.filter((i) => i.projectId === projectId);
  const projectActivities = activities.filter((a) => a.projectId === projectId);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    addNote({
      projectId,
      title: newNoteTitle,
      content: newNoteContent,
      category: newNoteCategory,
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      projectId,
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      stage: 'Production',
    });
    setNewTaskTitle('');
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    addDocument({
      projectId,
      title: newDocTitle,
      type: newDocType,
      content: newDocContent,
    });
    setNewDocTitle('');
    setNewDocContent('');
    setIsAddingDoc(false);
  };

  return (
    <div className="pb-16 space-y-6">
      {/* 1. Cinematic Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden border-b border-[#232734]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/70 to-black/30" />

        {/* Back Link & Quick Actions */}
        <div className="absolute top-6 inset-x-6 flex items-center justify-between z-10">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#F4F4F6] hover:bg-black/80 transition-all font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E5A93C]" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                archiveProject(projectId);
                router.push('/archive');
              }}
              className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#9CA3AF] hover:text-white hover:bg-black/80 transition-all flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this project workspace?')) {
                  deleteProject(projectId);
                  router.push('/projects');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 backdrop-blur-md border border-red-900/50 text-xs text-rose-300 hover:bg-red-900/60 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Title & Metadata Over Banner */}
        <div className="absolute bottom-6 inset-x-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#E5A93C] text-black font-bold">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-black/60 backdrop-blur-xs text-[#9CA3AF] border border-white/10">
                {project.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] block">
                Completion
              </span>
              <span className="text-lg font-mono font-bold text-[#E5A93C]">
                {project.progress}%
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] block">
                Target Date
              </span>
              <span className="text-sm font-mono text-white">
                {project.targetDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Workspace Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#232734] pb-px no-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'notes', label: `Notes (${projectNotes.length})` },
            { id: 'documents', label: `Documents (${projectDocs.length})` },
            { id: 'references', label: `References (${projectInspirations.length})` },
            { id: 'tasks', label: `Tasks (${projectTasks.filter((t) => !t.completed).length})` },
            { id: 'timeline', label: `Timeline (${projectMilestones.length})` },
            { id: 'files', label: `Files (${projectFiles.length})` },
            { id: 'activity', label: 'Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#E5A93C] text-[#E5A93C] font-semibold bg-[#13161F]'
                  : 'border-transparent text-[#9CA3AF] hover:text-white hover:bg-[#11131A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="max-w-7xl mx-auto px-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Premise & Synopsis */}
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#E5A93C]">
                  Premise & Logline
                </h3>
                <p className="text-sm text-[#F4F4F6] leading-relaxed font-serif text-base">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#161922] text-[#9CA3AF] border border-[#262B3A]"
                    >
                      <Tag className="w-3 h-3 text-[#E5A93C]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Slider */}
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[#9CA3AF]">
                    Production Progress
                  </h3>
                  <span className="font-mono text-sm text-[#E5A93C] font-bold">
                    {project.progress}% Complete
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress}
                  onChange={(e) => updateProject(projectId, { progress: parseInt(e.target.value) })}
                  className="w-full accent-[#E5A93C] cursor-pointer"
                />
              </div>

              {/* Quick Studio Jump */}
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#9CA3AF]">
                  Connected Production Studios
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/scripts"
                    className="p-3.5 rounded-xl bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#E5A93C]">
                        Screenplay Editor
                      </h4>
                      <p className="text-[11px] text-[#606675]">Draft scene dialogue</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#606675] group-hover:text-white" />
                  </Link>

                  <Link
                    href="/production"
                    className="p-3.5 rounded-xl bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#E5A93C]">
                        Film Storyboard & Shots
                      </h4>
                      <p className="text-[11px] text-[#606675]">Setup camera moves</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#606675] group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#9CA3AF]">
                  Workspace Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#606675] block">Start Date</span>
                    <span className="text-[#F4F4F6] font-mono">{project.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[#606675] block">Target Wrap</span>
                    <span className="text-[#F4F4F6] font-mono">{project.targetDate}</span>
                  </div>
                  <div>
                    <span className="text-[#606675] block">Status Stage</span>
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(projectId, { status: e.target.value as any })}
                      className="mt-1 w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-2.5 py-1.5 text-xs text-[#E5A93C] outline-none"
                    >
                      <option value="Idea">Idea</option>
                      <option value="Pre-Production">Pre-Production</option>
                      <option value="In Production">In Production</option>
                      <option value="Post-Production">Post-Production</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks Summary */}
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[#9CA3AF]">
                    Priority Tasks
                  </h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-[#E5A93C] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {projectTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-2.5 rounded-lg bg-[#161922] border border-[#202430] flex items-center gap-2.5 cursor-pointer hover:border-[#383F52]"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#606675] shrink-0" />
                      )}
                      <span className={`text-xs truncate ${task.completed ? 'line-through text-[#606675]' : 'text-[#F4F4F6]'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
                  Project Notes & Creative Journaling
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Directorial notes, character motives, and technical specifications
                </p>
              </div>
              <button
                onClick={() => setIsAddingNote(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Note
              </button>
            </div>

            {isAddingNote && (
              <form onSubmit={handleCreateNote} className="p-5 rounded-2xl bg-[#12151D] border border-[#E5A93C]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-[#E5A93C] font-bold">New Note</h4>
                  <button type="button" onClick={() => setIsAddingNote(false)} className="text-xs text-[#9CA3AF]">Cancel</button>
                </div>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none"
                />
                <textarea
                  rows={4}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your creative thoughts..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none"
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold">
                    Save Note
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectNotes.map((note) => (
                <div key={note.id} className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3 hover:border-[#383F52] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                      {note.category || 'General'}
                    </span>
                    <button onClick={() => deleteNote(note.id)} className="text-[#606675] hover:text-rose-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-base font-serif font-bold text-white">{note.title}</h4>
                  <p className="text-xs text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
                  Treatments, Pitch Decks & Proposals
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Official documents, grant proposals, and script outlines
                </p>
              </div>
              <button
                onClick={() => setIsAddingDoc(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
              >
                <Plus className="w-3.5 h-3.5" />
                New Document
              </button>
            </div>

            {isAddingDoc && (
              <form onSubmit={handleCreateDoc} className="p-5 rounded-2xl bg-[#12151D] border border-[#E5A93C]/40 space-y-3">
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Document Title (e.g. Directors Treatment)..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] outline-none"
                />
                <textarea
                  rows={6}
                  required
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Document body..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-sm text-[#F4F4F6] font-mono outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingDoc(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold">
                    Create Document
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {projectDocs.map((doc) => (
                <div key={doc.id} className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#E5A93C]" />
                      <div>
                        <h4 className="text-base font-serif font-bold text-white">{doc.title}</h4>
                        <span className="text-[10px] font-mono uppercase text-[#606675]">{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0C0D12] border border-[#1A1D26] text-xs font-mono text-[#D1D5DB] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {doc.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERENCES & IMAGES TAB */}
        {activeTab === 'references' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
                  Visual References & Moodboards
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Cinematographic stills, color palettes, and lighting references linked to this project
                </p>
              </div>
              <Link
                href="/inspiration"
                className="px-3 py-2 rounded-lg bg-[#181B24] border border-[#262B3A] text-xs text-[#E5A93C] hover:bg-[#1E2330]"
              >
                Open Inspiration Vault
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectInspirations.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden bg-[#11131A] border border-[#202430]">
                  {item.content.startsWith('http') && (
                    <div className="h-44 w-full bg-[#181B24]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.content} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    {item.description && <p className="text-xs text-[#9CA3AF] line-clamp-2">{item.description}</p>}
                    {item.palette && (
                      <div className="flex items-center gap-1 pt-1">
                        {item.palette.map((color, idx) => (
                          <div key={idx} className="w-5 h-5 rounded-md" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
                  Production Tasks & Milestones
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Track pre-production, filming logistics, and post milestones
                </p>
              </div>
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleCreateTask} className="flex gap-2">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new production task..."
                className="flex-1 bg-[#12151D] border border-[#232734] rounded-lg px-3.5 py-2 text-xs text-[#F4F4F6] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
              >
                Add Task
              </button>
            </form>

            <div className="rounded-xl bg-[#11131A] border border-[#202430] divide-y divide-[#1D212C]">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 flex items-center justify-between hover:bg-[#151821] transition-colors"
                >
                  <div
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#606675] shrink-0" />
                    )}
                    <span className={`text-xs ${t.completed ? 'line-through text-[#606675]' : 'text-[#F4F4F6]'}`}>
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      t.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-[#181B24] text-[#9CA3AF]'
                    }`}>
                      {t.priority}
                    </span>
                    <button onClick={() => deleteTask(t.id)} className="text-[#606675] hover:text-rose-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-6">
            <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
              Milestone Roadmap
            </h3>
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#202430]">
              {projectMilestones.map((m) => (
                <div key={m.id} className="relative space-y-1">
                  <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                    m.completed ? 'bg-emerald-400 border-emerald-400' : 'bg-[#11131A] border-[#E5A93C]'
                  }`} />
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                    <span className="text-xs font-mono text-[#E5A93C]">{m.targetDate}</span>
                  </div>
                  {m.description && <p className="text-xs text-[#9CA3AF]">{m.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILES TAB */}
        {activeTab === 'files' && (
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
              Project Assets & Production Files
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projectFiles.map((f) => (
                <div key={f.id} className="p-4 rounded-xl bg-[#161922] border border-[#232734] space-y-2">
                  <FolderOpen className="w-5 h-5 text-[#E5A93C]" />
                  <h4 className="text-xs font-semibold text-white truncate">{f.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-[#606675]">
                    <span>{f.size}</span>
                    <span>{f.uploadedAt.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
              Workspace Audit Trail
            </h3>
            <div className="divide-y divide-[#1D212C]">
              {projectActivities.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#9CA3AF]">{a.action}: </span>
                    <span className="text-white font-medium">{a.target}</span>
                  </div>
                  <span className="text-[#606675] font-mono">{a.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
