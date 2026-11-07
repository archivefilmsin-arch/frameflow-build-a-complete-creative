export type ProjectCategory =
  | 'Photography'
  | 'Short Film'
  | 'Feature Film'
  | 'Documentary'
  | 'Screenplay'
  | 'Travel Story'
  | 'Personal Creative Project'
  | 'Other';

export type ProjectStatus =
  | 'Idea'
  | 'Pre-Production'
  | 'In Production'
  | 'Post-Production'
  | 'Completed'
  | 'Archived';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  stage?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  targetDate: string;
  completed: boolean;
  description?: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  type: 'treatment' | 'pitch_deck' | 'contract' | 'research' | 'outline' | 'other';
  content: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'project' | 'script' | 'photo' | 'doc' | 'production' | 'journal' | 'vault';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  coverImage: string;
  startDate: string;
  targetDate: string;
  status: ProjectStatus;
  tags: string[];
  progress: number;
  updatedAt: string;
  createdAt: string;
  archived?: boolean;
}

// Photography Studio
export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  caption?: string;
  description?: string;
  albumId?: string;
  tags: string[];
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
  dateTaken: string;
  rating: number; // 1-5
  isFeatured?: boolean; // for portfolio
}

export interface PhotoAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  photoCount?: number;
}

export interface ShootPlannerItem {
  id: string;
  projectId?: string;
  title: string;
  location: string;
  date: string;
  concept: string;
  lightingConditions: string;
  cameraAndLens: string;
  shotList: { id: string; text: string; done: boolean }[];
  referenceImages: string[];
  notes: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Camera Body' | 'Lens' | 'Lighting' | 'Audio' | 'Accessory' | 'Filter';
  serialNumber?: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Wishlist';
  notes?: string;
  purchaseDate?: string;
  imageUrl?: string;
}

export interface PhotoChallengeSubmission {
  day: number;
  prompt: string;
  photoUrl?: string;
  notes?: string;
  submittedAt?: string;
  completed: boolean;
}

export interface PhotoChallenge {
  id: string;
  title: string;
  totalDays: number;
  startDate: string;
  submissions: PhotoChallengeSubmission[];
}

// Scriptwriting Studio
export type ScreenplayElementType =
  | 'scene-heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'general';

export interface ScriptLine {
  id: string;
  type: ScreenplayElementType;
  text: string;
}

export interface CharacterItem {
  id: string;
  projectId?: string;
  name: string;
  age: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Minor';
  appearance: string;
  personality: string;
  background: string;
  motivation: string;
  characterArc: string;
  referenceImage?: string;
}

export interface SceneBreakdownItem {
  id: string;
  scriptId: string;
  sceneNumber: number;
  heading: string;
  location: string;
  intExt: 'INT' | 'EXT' | 'INT/EXT';
  dayNight: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN';
  characters: string[];
  description: string;
  dialogueSnippet: string;
  productionNotes: string;
}

export interface StoryDevelopmentData {
  logline: string;
  synopsis: string;
  storyConcept: string;
  act1: string;
  act2a: string;
  act2b: string;
  act3: string;
  plotPoints: { id: string; title: string; beat: string; description: string }[];
  themes: string[];
  ending: string;
}

export interface Script {
  id: string;
  projectId?: string;
  title: string;
  version: string;
  lastEdited: string;
  elements: ScriptLine[];
  development: StoryDevelopmentData;
  characters: CharacterItem[];
  scenes: SceneBreakdownItem[];
  versions: { version: string; savedAt: string; note: string; lineCount: number }[];
}

// Documentary Studio
export interface ResearchNote {
  id: string;
  projectId?: string;
  title: string;
  sourceUrl?: string;
  sourceName: string;
  importantFacts: string[];
  historicalContext: string;
  tags: string[];
  updatedAt: string;
}

export interface SubjectProfile {
  id: string;
  projectId?: string;
  name: string;
  titleOrRole: string;
  bio: string;
  relevance: string;
  contactInfo?: string;
  imageUrl?: string;
}

export interface InterviewPlannerItem {
  id: string;
  projectId?: string;
  subjectName: string;
  role: string;
  status: 'Identified' | 'Contacted' | 'Scheduled' | 'Conducted' | 'Transcribed';
  dateScheduled?: string;
  questions: { id: string; question: string; answered: boolean; responseSnippet?: string }[];
  keyQuotes: string[];
  followUpQuestions: string[];
  recordingNotes: string;
}

export interface NarrativeChapter {
  id: string;
  number: number;
  title: string;
  centralQuestion: string;
  evidence: string;
  progression: string;
}

export interface DocumentaryDev {
  id: string;
  projectId?: string;
  concept: string;
  centralQuestion: string;
  narrativeStructure: string;
  chapters: NarrativeChapter[];
  timelineEvents: { id: string; dateOrEra: string; event: string; evidence: string }[];
}

// Film Production Studio
export interface StoryboardFrame {
  id: string;
  projectId?: string;
  sceneNumber: string;
  frameNumber: number;
  imageUrl?: string;
  description: string;
  cameraAngle: 'Wide' | 'Medium' | 'Close-Up' | 'Extreme Close-Up' | 'Low Angle' | 'High Angle' | 'Bird\'s Eye' | 'Dutch Angle';
  cameraMovement: 'Static' | 'Pan' | 'Tilt' | 'Dolly / Push In' | 'Tracking' | 'Steadicam' | 'Crane / Jib' | 'Handheld' | 'Drone';
  audioCue?: string;
}

export interface ShotListItem {
  id: string;
  projectId?: string;
  shotNumber: string;
  sceneNumber: string;
  shotType: 'ECU' | 'CU' | 'MCU' | 'MS' | 'MLS' | 'WS' | 'EWS' | 'OTS' | 'POV';
  cameraAngle: string;
  cameraMovement: string;
  lens: string;
  lighting: string;
  description: string;
  status: 'To Shoot' | 'Completed' | 'Alternative Shot' | 'Reshoot Needed';
}

export interface LocationItem {
  id: string;
  projectId?: string;
  name: string;
  address: string;
  coordinates?: string;
  scoutingNotes: string;
  lightingNotes: string;
  shootingRequirements: string;
  images: string[];
  contactPerson?: string;
  permitRequired: boolean;
}

export interface ProductionPlannerData {
  id: string;
  projectId?: string;
  shootDates: { date: string; callTime: string; wrapTime: string; location: string; notes: string }[];
  cast: { id: string; characterName: string; actorName: string; phone: string; status: string }[];
  crew: { id: string; role: string; name: string; contact: string; rateOrNotes: string }[];
  equipmentChecklist: { id: string; item: string; checked: boolean; category: string }[];
  productionTasks: { id: string; task: string; assignee: string; dueDate: string; done: boolean }[];
}

// Inspiration Vault
export interface InspirationItem {
  id: string;
  projectId?: string;
  collectionId?: string;
  title: string;
  type: 'image' | 'film_still' | 'quote' | 'link' | 'video' | 'concept';
  content: string; // url, text, or link
  description?: string;
  tags: string[];
  authorOrSource?: string;
  createdAt: string;
  palette?: string[]; // hex codes
}

export interface MoodboardItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  elements: {
    id: string;
    imageUrl: string;
    caption?: string;
    x?: number;
    y?: number;
    width?: number;
  }[];
  createdAt: string;
}

// Creative Journal
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  category: 'Observation' | 'Travel Experience' | 'Creative Thought' | 'Writing Prompt' | 'Milestone' | 'Random Spark';
  content: string;
  mood?: string;
  tags: string[];
  linkedProjectId?: string;
  createdAt: string;
}

// AI Assistant
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  category?: 'photography' | 'screenwriting' | 'documentary' | 'production' | 'general';
  suggestedAction?: {
    type: 'insert' | 'replace' | 'create_shot' | 'create_idea';
    payload: any;
    label: string;
  };
}

// Settings
export interface AppSettings {
  creatorName: string;
  creatorBio: string;
  avatarUrl: string;
  openaiApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  portfolioPublic: boolean;
  themePreference: 'dark' | 'midnight' | 'noir';
  fontSize: 'standard' | 'large';
  autoSaveInterval: number; // seconds
}
