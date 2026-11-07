'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Project,
  Task,
  Milestone,
  ProjectNote,
  ProjectDocument,
  ProjectFile,
  PhotoItem,
  PhotoAlbum,
  ShootPlannerItem,
  EquipmentItem,
  PhotoChallenge,
  Script,
  ResearchNote,
  SubjectProfile,
  InterviewPlannerItem,
  DocumentaryDev,
  StoryboardFrame,
  ShotListItem,
  LocationItem,
  ProductionPlannerData,
  InspirationItem,
  MoodboardItem,
  JournalEntry,
  AppSettings,
  ActivityItem,
  AIMessage,
} from '@/types';
import {
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MILESTONES,
  INITIAL_PROJECT_NOTES,
  INITIAL_PROJECT_DOCS,
  INITIAL_PROJECT_FILES,
  INITIAL_PHOTOS,
  INITIAL_ALBUMS,
  INITIAL_SHOOT_PLANS,
  INITIAL_EQUIPMENT,
  INITIAL_CHALLENGE,
  INITIAL_SCRIPTS,
  INITIAL_DOC_RESEARCH,
  INITIAL_SUBJECT_PROFILES,
  INITIAL_INTERVIEWS,
  INITIAL_DOC_DEV,
  INITIAL_STORYBOARD,
  INITIAL_SHOT_LIST,
  INITIAL_LOCATIONS,
  INITIAL_PROD_PLANNER,
  INITIAL_INSPIRATION,
  INITIAL_MOODBOARDS,
  INITIAL_JOURNAL,
  INITIAL_ACTIVITIES,
} from '@/data/initialData';

export interface FrameFlowState {
  settings: AppSettings;
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  notes: ProjectNote[];
  documents: ProjectDocument[];
  files: ProjectFile[];
  photos: PhotoItem[];
  albums: PhotoAlbum[];
  shootPlans: ShootPlannerItem[];
  equipment: EquipmentItem[];
  challenge: PhotoChallenge;
  scripts: Script[];
  researchNotes: ResearchNote[];
  subjects: SubjectProfile[];
  interviews: InterviewPlannerItem[];
  docDev: DocumentaryDev;
  storyboards: StoryboardFrame[];
  shotList: ShotListItem[];
  locations: LocationItem[];
  productionPlanner: ProductionPlannerData;
  inspiration: InspirationItem[];
  moodboards: MoodboardItem[];
  journal: JournalEntry[];
  activities: ActivityItem[];
  aiMessages: AIMessage[];
}

const STORAGE_KEY = 'frameflow_state_v1';

// Shared state container for single-source-of-truth across components
let globalState: FrameFlowState = {
  settings: INITIAL_SETTINGS,
  projects: INITIAL_PROJECTS,
  tasks: INITIAL_TASKS,
  milestones: INITIAL_MILESTONES,
  notes: INITIAL_PROJECT_NOTES,
  documents: INITIAL_PROJECT_DOCS,
  files: INITIAL_PROJECT_FILES,
  photos: INITIAL_PHOTOS,
  albums: INITIAL_ALBUMS,
  shootPlans: INITIAL_SHOOT_PLANS,
  equipment: INITIAL_EQUIPMENT,
  challenge: INITIAL_CHALLENGE,
  scripts: INITIAL_SCRIPTS,
  researchNotes: INITIAL_DOC_RESEARCH,
  subjects: INITIAL_SUBJECT_PROFILES,
  interviews: INITIAL_INTERVIEWS,
  docDev: INITIAL_DOC_DEV,
  storyboards: INITIAL_STORYBOARD,
  shotList: INITIAL_SHOT_LIST,
  locations: INITIAL_LOCATIONS,
  productionPlanner: INITIAL_PROD_PLANNER,
  inspiration: INITIAL_INSPIRATION,
  moodboards: INITIAL_MOODBOARDS,
  journal: INITIAL_JOURNAL,
  activities: INITIAL_ACTIVITIES,
  aiMessages: [
    {
      id: 'ai-init',
      role: 'assistant',
      content: 'Welcome back to FrameFlow, Julian. All creative studios are synchronized. What story or shoot shall we develop today?',
      timestamp: '2026-11-07T12:00:00Z',
      category: 'general',
    },
  ],
};

const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
  listeners.forEach((listener) => listener());
}

// Load from storage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      globalState = { ...globalState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load FrameFlow state:', e);
  }
}

export function useFrameFlow() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Rehydrate if storage has updated
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        globalState = { ...globalState, ...parsed };
      }
    } catch {}

    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  // Log activity helper
  const logActivity = useCallback((action: string, target: string, type: ActivityItem['type'], projectId?: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      action,
      target,
      timestamp: 'Just now',
      type,
      projectId,
    };
    globalState.activities = [newAct, ...globalState.activities.slice(0, 49)];
    notify();
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    globalState.settings = { ...globalState.settings, ...updates };
    notify();
  }, []);

  // Projects CRUD
  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      ...project,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    globalState.projects = [newProj, ...globalState.projects];
    logActivity('Created Project', newProj.title, 'project', id);
    notify();
    return id;
  }, [logActivity]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    globalState.projects = globalState.projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    const p = globalState.projects.find((item) => item.id === id);
    if (p) logActivity('Updated Project', p.title, 'project', id);
    notify();
  }, [logActivity]);

  const deleteProject = useCallback((id: string) => {
    const p = globalState.projects.find((item) => item.id === id);
    globalState.projects = globalState.projects.filter((item) => item.id !== id);
    if (p) logActivity('Deleted Project', p.title, 'project');
    notify();
  }, [logActivity]);

  const archiveProject = useCallback((id: string) => {
    globalState.projects = globalState.projects.map((p) =>
      p.id === id ? { ...p, status: 'Archived', archived: true, updatedAt: new Date().toISOString() } : p
    );
    const p = globalState.projects.find((item) => item.id === id);
    if (p) logActivity('Archived Project', p.title, 'project', id);
    notify();
  }, [logActivity]);

  const restoreProject = useCallback((id: string) => {
    globalState.projects = globalState.projects.map((p) =>
      p.id === id ? { ...p, status: 'In Production', archived: false, updatedAt: new Date().toISOString() } : p
    );
    const p = globalState.projects.find((item) => item.id === id);
    if (p) logActivity('Restored Project', p.title, 'project', id);
    notify();
  }, [logActivity]);

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: `t-${Date.now()}` };
    globalState.tasks = [...globalState.tasks, newTask];
    logActivity('Added Task', newTask.title, 'project', newTask.projectId);
    notify();
  }, [logActivity]);

  const toggleTask = useCallback((id: string) => {
    globalState.tasks = globalState.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    notify();
  }, []);

  const deleteTask = useCallback((id: string) => {
    globalState.tasks = globalState.tasks.filter((t) => t.id !== id);
    notify();
  }, []);

  // Milestones
  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    const newM: Milestone = { ...milestone, id: `m-${Date.now()}` };
    globalState.milestones = [...globalState.milestones, newM];
    notify();
  }, []);

  const toggleMilestone = useCallback((id: string) => {
    globalState.milestones = globalState.milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    notify();
  }, []);

  // Notes
  const addNote = useCallback((note: Omit<ProjectNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: ProjectNote = {
      ...note,
      id: `pn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    globalState.notes = [newNote, ...globalState.notes];
    logActivity('Added Project Note', newNote.title, 'project', newNote.projectId);
    notify();
  }, [logActivity]);

  const updateNote = useCallback((id: string, updates: Partial<ProjectNote>) => {
    globalState.notes = globalState.notes.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    );
    notify();
  }, []);

  const deleteNote = useCallback((id: string) => {
    globalState.notes = globalState.notes.filter((n) => n.id !== id);
    notify();
  }, []);

  // Documents
  const addDocument = useCallback((doc: Omit<ProjectDocument, 'id' | 'updatedAt'>) => {
    const newDoc: ProjectDocument = {
      ...doc,
      id: `pd-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    globalState.documents = [newDoc, ...globalState.documents];
    notify();
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<ProjectDocument>) => {
    globalState.documents = globalState.documents.map((d) =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    );
    notify();
  }, []);

  // Photography Studio
  const addPhoto = useCallback((photo: Omit<PhotoItem, 'id'>) => {
    const newPhoto: PhotoItem = { ...photo, id: `ph-${Date.now()}` };
    globalState.photos = [newPhoto, ...globalState.photos];
    logActivity('Added Photograph', newPhoto.title, 'photo');
    notify();
  }, [logActivity]);

  const deletePhoto = useCallback((id: string) => {
    globalState.photos = globalState.photos.filter((p) => p.id !== id);
    notify();
  }, []);

  const addAlbum = useCallback((album: Omit<PhotoAlbum, 'id' | 'createdAt'>) => {
    const newAlbum: PhotoAlbum = {
      ...album,
      id: `alb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      photoCount: 0,
    };
    globalState.albums = [...globalState.albums, newAlbum];
    logActivity('Created Album', newAlbum.title, 'photo');
    notify();
  }, [logActivity]);

  const addShootPlan = useCallback((plan: Omit<ShootPlannerItem, 'id'>) => {
    const newPlan: ShootPlannerItem = { ...plan, id: `sp-${Date.now()}` };
    globalState.shootPlans = [newPlan, ...globalState.shootPlans];
    logActivity('Planned Photo Shoot', newPlan.title, 'photo');
    notify();
  }, [logActivity]);

  const updateShootPlan = useCallback((id: string, updates: Partial<ShootPlannerItem>) => {
    globalState.shootPlans = globalState.shootPlans.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    notify();
  }, []);

  const addEquipment = useCallback((item: Omit<EquipmentItem, 'id'>) => {
    const newItem: EquipmentItem = { ...item, id: `eq-${Date.now()}` };
    globalState.equipment = [...globalState.equipment, newItem];
    notify();
  }, []);

  const updateEquipment = useCallback((id: string, updates: Partial<EquipmentItem>) => {
    globalState.equipment = globalState.equipment.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    notify();
  }, []);

  const updateChallengeSubmission = useCallback((day: number, photoUrl: string, notes?: string) => {
    const subs = globalState.challenge.submissions.map((s) =>
      s.day === day
        ? { ...s, photoUrl, notes: notes || s.notes, completed: true, submittedAt: new Date().toISOString().split('T')[0] }
        : s
    );
    globalState.challenge = { ...globalState.challenge, submissions: subs };
    logActivity('Completed Daily Photo Challenge', `Day ${day}`, 'photo');
    notify();
  }, [logActivity]);

  // Scriptwriting Studio
  const updateScript = useCallback((id: string, updates: Partial<Script>) => {
    globalState.scripts = globalState.scripts.map((s) =>
      s.id === id ? { ...s, ...updates, lastEdited: new Date().toISOString() } : s
    );
    notify();
  }, []);

  const addScript = useCallback((title: string, projectId?: string) => {
    const newScript: Script = {
      id: `script-${Date.now()}`,
      projectId,
      title,
      version: 'Draft 1.0',
      lastEdited: new Date().toISOString(),
      elements: [
        { id: `el-head`, type: 'scene-heading', text: 'EXT. UNTITLED LOCATION - DAY' },
        { id: `el-act`, type: 'action', text: 'Begin describing your world and atmosphere...' },
      ],
      development: {
        logline: '',
        synopsis: '',
        storyConcept: '',
        act1: '',
        act2a: '',
        act2b: '',
        act3: '',
        plotPoints: [],
        themes: [],
        ending: '',
      },
      characters: [],
      scenes: [],
      versions: [{ version: '1.0', savedAt: new Date().toISOString(), note: 'Initial draft created', lineCount: 2 }],
    };
    globalState.scripts = [newScript, ...globalState.scripts];
    logActivity('Created Screenplay', title, 'script', projectId);
    notify();
    return newScript.id;
  }, [logActivity]);

  // Documentary Studio
  const addResearchNote = useCallback((note: Omit<ResearchNote, 'id' | 'updatedAt'>) => {
    const newNote: ResearchNote = {
      ...note,
      id: `rn-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    globalState.researchNotes = [newNote, ...globalState.researchNotes];
    logActivity('Saved Research Note', newNote.title, 'doc', newNote.projectId);
    notify();
  }, [logActivity]);

  const addSubject = useCallback((subject: Omit<SubjectProfile, 'id'>) => {
    const newSubject: SubjectProfile = { ...subject, id: `sub-${Date.now()}` };
    globalState.subjects = [newSubject, ...globalState.subjects];
    notify();
  }, []);

  const addInterview = useCallback((interview: Omit<InterviewPlannerItem, 'id'>) => {
    const newInt: InterviewPlannerItem = { ...interview, id: `int-${Date.now()}` };
    globalState.interviews = [newInt, ...globalState.interviews];
    logActivity('Created Interview Plan', newInt.subjectName, 'doc', newInt.projectId);
    notify();
  }, [logActivity]);

  const updateInterview = useCallback((id: string, updates: Partial<InterviewPlannerItem>) => {
    globalState.interviews = globalState.interviews.map((i) =>
      i.id === id ? { ...i, ...updates } : i
    );
    notify();
  }, []);

  const updateDocDev = useCallback((updates: Partial<DocumentaryDev>) => {
    globalState.docDev = { ...globalState.docDev, ...updates };
    notify();
  }, []);

  // Film Production Studio
  const addStoryboardFrame = useCallback((frame: Omit<StoryboardFrame, 'id'>) => {
    const newFrame: StoryboardFrame = { ...frame, id: `sb-${Date.now()}` };
    globalState.storyboards = [...globalState.storyboards, newFrame];
    logActivity('Added Storyboard Frame', `Scene ${newFrame.sceneNumber} Frame ${newFrame.frameNumber}`, 'production', newFrame.projectId);
    notify();
  }, [logActivity]);

  const updateStoryboardFrame = useCallback((id: string, updates: Partial<StoryboardFrame>) => {
    globalState.storyboards = globalState.storyboards.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    notify();
  }, []);

  const deleteStoryboardFrame = useCallback((id: string) => {
    globalState.storyboards = globalState.storyboards.filter((f) => f.id !== id);
    notify();
  }, []);

  const addShot = useCallback((shot: Omit<ShotListItem, 'id'>) => {
    const newShot: ShotListItem = { ...shot, id: `sh-${Date.now()}` };
    globalState.shotList = [...globalState.shotList, newShot];
    notify();
  }, []);

  const updateShot = useCallback((id: string, updates: Partial<ShotListItem>) => {
    globalState.shotList = globalState.shotList.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    notify();
  }, []);

  const deleteShot = useCallback((id: string) => {
    globalState.shotList = globalState.shotList.filter((s) => s.id !== id);
    notify();
  }, []);

  const addLocation = useCallback((loc: Omit<LocationItem, 'id'>) => {
    const newLoc: LocationItem = { ...loc, id: `loc-${Date.now()}` };
    globalState.locations = [newLoc, ...globalState.locations];
    logActivity('Scouted Location', newLoc.name, 'production', newLoc.projectId);
    notify();
  }, [logActivity]);

  const updateProductionPlanner = useCallback((updates: Partial<ProductionPlannerData>) => {
    globalState.productionPlanner = { ...globalState.productionPlanner, ...updates };
    notify();
  }, []);

  // Inspiration Vault
  const addInspiration = useCallback((item: Omit<InspirationItem, 'id' | 'createdAt'>) => {
    const newItem: InspirationItem = {
      ...item,
      id: `insp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    globalState.inspiration = [newItem, ...globalState.inspiration];
    logActivity('Saved Inspiration', newItem.title, 'vault', newItem.projectId);
    notify();
  }, [logActivity]);

  const deleteInspiration = useCallback((id: string) => {
    globalState.inspiration = globalState.inspiration.filter((i) => i.id !== id);
    notify();
  }, []);

  const addMoodboard = useCallback((board: Omit<MoodboardItem, 'id' | 'createdAt'>) => {
    const newBoard: MoodboardItem = {
      ...board,
      id: `mb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    globalState.moodboards = [newBoard, ...globalState.moodboards];
    logActivity('Created Moodboard', newBoard.title, 'vault');
    notify();
  }, [logActivity]);

  // Creative Journal
  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    globalState.journal = [newEntry, ...globalState.journal];
    logActivity('Wrote Journal Entry', newEntry.title, 'journal', newEntry.linkedProjectId);
    notify();
  }, [logActivity]);

  const updateJournalEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    globalState.journal = globalState.journal.map((j) =>
      j.id === id ? { ...j, ...updates } : j
    );
    notify();
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    globalState.journal = globalState.journal.filter((j) => j.id !== id);
    notify();
  }, []);

  // AI Assistant Messages
  const addAIMessage = useCallback((message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMsg: AIMessage = {
      ...message,
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: '2026-11-07T12:00:00Z',
    };
    globalState.aiMessages = [...globalState.aiMessages, newMsg];
    notify();
    return newMsg;
  }, []);

  // Reset to initial
  const resetToFactoryData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }, []);

  // Export / Import
  const exportAllData = useCallback(() => {
    return JSON.stringify(globalState, null, 2);
  }, []);

  const importAllData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      globalState = { ...globalState, ...parsed };
      notify();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }, []);

  return {
    ...globalState,
    updateSettings,
    addProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    toggleMilestone,
    addNote,
    updateNote,
    deleteNote,
    addDocument,
    updateDocument,
    addPhoto,
    deletePhoto,
    addAlbum,
    addShootPlan,
    updateShootPlan,
    addEquipment,
    updateEquipment,
    updateChallengeSubmission,
    addScript,
    updateScript,
    addResearchNote,
    addSubject,
    addInterview,
    updateInterview,
    updateDocDev,
    addStoryboardFrame,
    updateStoryboardFrame,
    deleteStoryboardFrame,
    addShot,
    updateShot,
    deleteShot,
    addLocation,
    updateProductionPlanner,
    addInspiration,
    deleteInspiration,
    addMoodboard,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addAIMessage,
    resetToFactoryData,
    exportAllData,
    importAllData,
  };
}
