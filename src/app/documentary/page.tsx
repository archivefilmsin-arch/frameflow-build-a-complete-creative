'use client';

import { useState } from 'react';
import {
  Video,
  Plus,
  Search,
  BookOpen,
  Users,
  Mic,
  GitBranch,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Circle,
  Quote,
  Sparkles,
  Layers,
  FileText,
  X,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { ResearchNote, SubjectProfile, InterviewPlannerItem, NarrativeChapter } from '@/types';

export default function DocumentaryStudioPage() {
  const {
    researchNotes,
    subjects,
    interviews,
    docDev,
    addResearchNote,
    addSubject,
    addInterview,
    updateInterview,
    updateDocDev,
    projects,
  } = useFrameFlow();

  const [activeTab, setActiveTab] = useState<'research' | 'interviews' | 'narrative' | 'timeline'>('research');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddResearchOpen, setIsAddResearchOpen] = useState(false);
  const [isAddInterviewOpen, setIsAddInterviewOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Form states
  const [resTitle, setResTitle] = useState('');
  const [resSource, setResSource] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resFacts, setResFacts] = useState('');
  const [resContext, setResContext] = useState('');

  const [subjName, setSubjName] = useState('');
  const [subjRole, setSubjRole] = useState('');
  const [subjBio, setSubjBio] = useState('');
  const [subjRelevance, setSubjRelevance] = useState('');

  const [intSubject, setIntSubject] = useState('');
  const [intRole, setIntRole] = useState('');
  const [intDate, setIntDate] = useState('');
  const [intQuestions, setIntQuestions] = useState('');
  const [intNotes, setIntNotes] = useState('');

  const handleCreateResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    addResearchNote({
      title: resTitle,
      sourceName: resSource || 'Archival Record',
      sourceUrl: resUrl || undefined,
      importantFacts: resFacts.split('\n').filter((f) => f.trim().length > 0),
      historicalContext: resContext,
      tags: ['Documentary', 'Archive'],
    });
    setResTitle('');
    setResSource('');
    setResUrl('');
    setResFacts('');
    setResContext('');
    setIsAddResearchOpen(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim()) return;
    addSubject({
      name: subjName,
      titleOrRole: subjRole,
      bio: subjBio,
      relevance: subjRelevance,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });
    setSubjName('');
    setSubjRole('');
    setSubjBio('');
    setSubjRelevance('');
    setIsAddSubjectOpen(false);
  };

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intSubject.trim()) return;
    const questionsList = intQuestions
      .split('\n')
      .filter((q) => q.trim().length > 0)
      .map((q, idx) => ({ id: `q-${Date.now()}-${idx}`, question: q.trim(), answered: false }));

    addInterview({
      subjectName: intSubject,
      role: intRole,
      status: 'Scheduled',
      dateScheduled: intDate || new Date().toISOString(),
      questions: questionsList.length > 0 ? questionsList : [{ id: 'q-1', question: 'How did this journey begin?', answered: false }],
      keyQuotes: [],
      followUpQuestions: [],
      recordingNotes: intNotes,
    });
    setIntSubject('');
    setIntRole('');
    setIntDate('');
    setIntQuestions('');
    setIntNotes('');
    setIsAddInterviewOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <Video className="w-3.5 h-3.5" />
            <span>Non-Fiction & Documentary Studio</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            Documentary Studio
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            Investigate reality, organize verified facts, structure narrative thesis chapters, and schedule deep-dive subject interviews
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'research' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddSubjectOpen(true)}
                className="px-3 py-2 rounded-xl bg-[#161922] border border-[#232734] text-xs font-medium text-white hover:border-[#E5A93C]/40"
              >
                + Subject Profile
              </button>
              <button
                onClick={() => setIsAddResearchOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Research</span>
              </button>
            </div>
          )}
          {activeTab === 'interviews' && (
            <button
              onClick={() => setIsAddInterviewOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 border-b border-[#232734] pb-px overflow-x-auto no-scrollbar">
        {[
          { id: 'research', label: `Research & Subject Dossiers (${researchNotes.length})` },
          { id: 'interviews', label: `Interview Planner (${interviews.length})` },
          { id: 'narrative', label: `Narrative Development (${docDev.chapters.length} Chapters)` },
          { id: 'timeline', label: `Chronological Timeline (${docDev.timelineEvents.length} Events)` },
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

      {/* 1. RESEARCH & SUBJECTS TAB */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          {/* Research Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Investigative Research Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchNotes.map((rn) => (
                <div key={rn.id} className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4 hover:border-[#383F52] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                        Source: {rn.sourceName}
                      </span>
                      <h4 className="text-base font-serif font-bold text-white mt-0.5">{rn.title}</h4>
                    </div>
                    {rn.sourceUrl && (
                      <a href={rn.sourceUrl} target="_blank" rel="noreferrer" className="text-[#606675] hover:text-white p-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Facts Checklist */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#606675]">Key Verified Facts:</span>
                    <ul className="space-y-1.5 text-xs text-[#D1D5DB]">
                      {rn.importantFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] shrink-0 mt-1.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141720] border border-[#232734] text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#606675] block mb-1">Historical Context:</span>
                    <p className="text-[#9CA3AF] leading-relaxed">{rn.historicalContext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Profiles Section */}
          <div className="space-y-4 pt-4 border-t border-[#1F232E]">
            <h3 className="text-lg font-serif font-bold text-white">Documentary Subjects & Eyewitnesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] flex gap-4 hover:border-[#383F52] transition-colors">
                  {sub.imageUrl && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#181B24]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <div>
                      <h4 className="text-base font-serif font-bold text-white">{sub.name}</h4>
                      <p className="text-xs text-[#E5A93C] font-mono">{sub.titleOrRole}</p>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">{sub.bio}</p>
                    <div className="text-[11px] text-[#606675] pt-1">
                      <strong className="text-[#9CA3AF]">Narrative Relevance:</strong> {sub.relevance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. INTERVIEW PLANNER TAB */}
      {activeTab === 'interviews' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {interviews.map((int) => (
              <div key={int.id} className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C202C]">
                  <div>
                    <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                      Scheduled Subject Interview
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {int.subjectName}
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">{int.role}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md text-xs font-mono uppercase bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                      {int.status}
                    </span>
                    <span className="text-xs font-mono text-[#606675]">
                      {int.dateScheduled?.split('T')[0]}
                    </span>
                  </div>
                </div>

                {/* Questions Checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-[#E5A93C] font-semibold">
                    Prepared Core Questions ({int.questions.length})
                  </span>
                  <div className="space-y-2">
                    {int.questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          const updated = int.questions.map((item) =>
                            item.id === q.id ? { ...item, answered: !item.answered } : item
                          );
                          updateInterview(int.id, { questions: updated });
                        }}
                        className="p-3 rounded-xl bg-[#141720] border border-[#232734] flex items-start gap-3 cursor-pointer hover:border-[#383F52]"
                      >
                        {q.answered ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#606675] shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs ${q.answered ? 'line-through text-[#606675]' : 'text-[#F4F4F6]'}`}>
                          {q.question}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Quotes */}
                {int.keyQuotes.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#141822] border-l-2 border-[#E5A93C] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#E5A93C] font-semibold">
                      <Quote className="w-3.5 h-3.5" />
                      Recorded Golden Soundbite
                    </div>
                    {int.keyQuotes.map((quote, i) => (
                      <p key={i} className="text-sm font-serif italic text-white leading-relaxed">
                        {quote}
                      </p>
                    ))}
                  </div>
                )}

                {/* Audio Recording Notes */}
                <div className="text-xs text-[#9CA3AF]">
                  <strong className="text-white">Acoustic Recording Setup:</strong> {int.recordingNotes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NARRATIVE DEVELOPMENT TAB */}
      {activeTab === 'narrative' && (
        <div className="space-y-6">
          {/* Central Question & Concept */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#141822] to-[#101217] border border-[#232734] space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#E5A93C]">
              Documentary Narrative Spine
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
              &ldquo;{docDev.centralQuestion}&rdquo;
            </h2>
            <p className="text-sm text-[#9CA3AF] font-serif leading-relaxed max-w-3xl">
              {docDev.concept}
            </p>
          </div>

          {/* Chapters & Sequences Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Four-Movement Progression</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docDev.chapters.map((ch) => (
                <div key={ch.id} className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
                    <span className="text-xs font-mono font-bold text-[#E5A93C]">
                      MOVEMENT {ch.number}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white">{ch.title}</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#606675] block">Sequence Inquiry</span>
                      <p className="text-white font-medium">{ch.centralQuestion}</p>
                    </div>
                    <div>
                      <span className="text-[#606675] block">Visual & Audio Evidence</span>
                      <p className="text-[#9CA3AF]">{ch.evidence}</p>
                    </div>
                    <div>
                      <span className="text-[#606675] block">Dramatic Progression</span>
                      <p className="text-[#9CA3AF]">{ch.progression}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] space-y-6">
          <h3 className="text-lg font-serif font-bold text-white">Historical & Archival Timeline</h3>
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#202430]">
            {docDev.timelineEvents.map((ev) => (
              <div key={ev.id} className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-[#11131A] border-[#E5A93C]" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#E5A93C] px-2 py-0.5 rounded bg-[#181B24]">
                    {ev.dateOrEra}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{ev.event}</h4>
                </div>
                <p className="text-xs text-[#9CA3AF] pl-1">Source / Evidence: {ev.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Research Modal */}
      {isAddResearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Add Documentary Research Note</h3>
              <button onClick={() => setIsAddResearchOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateResearch} className="space-y-3">
              <input
                type="text"
                required
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                placeholder="Research Investigation Title *"
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={resSource}
                  onChange={(e) => setResSource(e.target.value)}
                  placeholder="Source Name / Archive"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
                <input
                  type="url"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder="Source URL (https://...)"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <textarea
                rows={3}
                value={resFacts}
                onChange={(e) => setResFacts(e.target.value)}
                placeholder="Important verified facts (one per line)..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={resContext}
                onChange={(e) => setResContext(e.target.value)}
                placeholder="Historical context & significance..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddResearchOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Save Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Interview Modal */}
      {isAddInterviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Schedule Subject Interview</h3>
              <button onClick={() => setIsAddInterviewOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={intSubject}
                  onChange={(e) => setIntSubject(e.target.value)}
                  placeholder="Subject Name *"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={intRole}
                  onChange={(e) => setIntRole(e.target.value)}
                  placeholder="Role / Title"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <input
                type="date"
                value={intDate}
                onChange={(e) => setIntDate(e.target.value)}
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
              />
              <textarea
                rows={4}
                value={intQuestions}
                onChange={(e) => setIntQuestions(e.target.value)}
                placeholder="Core interview questions (one per line)..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={intNotes}
                onChange={(e) => setIntNotes(e.target.value)}
                placeholder="Recording setup notes (mics, room acoustics)..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddInterviewOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
