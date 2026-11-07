-- FRAMEFLOW — Creative Operating System Database Schema
-- Production PostgreSQL with Row Level Security (RLS), Foreign Keys & Timestamps

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles / Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    creator_name TEXT NOT NULL DEFAULT 'Julian Vance',
    bio TEXT,
    avatar_url TEXT,
    openai_api_key TEXT,
    theme_preference TEXT DEFAULT 'dark',
    portfolio_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Photography', 'Short Film', 'Feature Film', 'Documentary', 
        'Screenplay', 'Travel Story', 'Personal Creative Project', 'Other'
    )),
    cover_image TEXT,
    start_date DATE,
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'Idea' CHECK (status IN (
        'Idea', 'Pre-Production', 'In Production', 'Post-Production', 'Completed', 'Archived'
    )),
    tags TEXT[] DEFAULT '{}',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Project Notes
CREATE TABLE IF NOT EXISTS public.project_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tasks & Milestones
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Photography Studio
CREATE TABLE IF NOT EXISTS public.photo_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photographs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    album_id UUID REFERENCES public.photo_albums(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    camera TEXT,
    lens TEXT,
    focal_length TEXT,
    aperture TEXT,
    shutter_speed TEXT,
    iso TEXT,
    location TEXT,
    date_taken DATE,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shoot_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    shoot_date TIMESTAMPTZ,
    concept TEXT,
    lighting_conditions TEXT,
    camera_and_lens TEXT,
    shot_list JSONB DEFAULT '[]'::jsonb,
    reference_images TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photography_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Camera Body', 'Lens', 'Lighting', 'Audio', 'Accessory', 'Filter')),
    serial_number TEXT,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'In Use', 'Maintenance', 'Wishlist')),
    notes TEXT,
    purchase_date DATE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Screenplay Studio
CREATE TABLE IF NOT EXISTS public.scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    version TEXT DEFAULT 'Draft 1.0',
    elements JSONB NOT NULL DEFAULT '[]'::jsonb,
    development JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.script_characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age TEXT,
    role TEXT CHECK (role IN ('Protagonist', 'Antagonist', 'Supporting', 'Minor')),
    appearance TEXT,
    personality TEXT,
    background TEXT,
    motivation TEXT,
    character_arc TEXT,
    reference_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.script_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    heading TEXT NOT NULL,
    location TEXT,
    int_ext TEXT CHECK (int_ext IN ('INT', 'EXT', 'INT/EXT')),
    day_night TEXT CHECK (day_night IN ('DAY', 'NIGHT', 'DUSK', 'DAWN')),
    characters TEXT[] DEFAULT '{}',
    description TEXT,
    dialogue_snippet TEXT,
    production_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Documentary Studio
CREATE TABLE IF NOT EXISTS public.documentary_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    source_url TEXT,
    source_name TEXT,
    important_facts TEXT[] DEFAULT '{}',
    historical_context TEXT,
    tags TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documentary_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    role TEXT,
    status TEXT DEFAULT 'Identified',
    date_scheduled TIMESTAMPTZ,
    questions JSONB DEFAULT '[]'::jsonb,
    key_quotes TEXT[] DEFAULT '{}',
    follow_up_questions TEXT[] DEFAULT '{}',
    recording_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Film Production Studio
CREATE TABLE IF NOT EXISTS public.storyboard_frames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    scene_number TEXT NOT NULL,
    frame_number INTEGER NOT NULL,
    image_url TEXT,
    description TEXT,
    camera_angle TEXT,
    camera_movement TEXT,
    audio_cue TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shot_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    shot_number TEXT NOT NULL,
    scene_number TEXT NOT NULL,
    shot_type TEXT,
    camera_angle TEXT,
    camera_movement TEXT,
    lens TEXT,
    lighting TEXT,
    description TEXT,
    status TEXT DEFAULT 'To Shoot',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.production_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    address TEXT,
    coordinates TEXT,
    scouting_notes TEXT,
    lighting_notes TEXT,
    shooting_requirements TEXT,
    images TEXT[] DEFAULT '{}',
    contact_person TEXT,
    permit_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Inspiration Vault
CREATE TABLE IF NOT EXISTS public.inspiration_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'film_still', 'quote', 'link', 'video', 'concept')),
    content TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    author_or_source TEXT,
    palette TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.moodboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    elements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Creative Journal
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Observation', 'Travel Experience', 'Creative Thought', 
        'Writing Prompt', 'Milestone', 'Random Spark'
    )),
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT[] DEFAULT '{}',
    linked_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Assistant History
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    category TEXT,
    suggested_action JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoot_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photography_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentary_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentary_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storyboard_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shot_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Dynamic RLS policies ensuring users access ONLY their own records
CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notes" ON public.project_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own tasks" ON public.project_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own milestones" ON public.project_milestones FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own albums" ON public.photo_albums FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own photos" ON public.photographs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own shoot plans" ON public.shoot_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own equipment" ON public.photography_equipment FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own scripts" ON public.scripts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own script characters" ON public.script_characters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own script scenes" ON public.script_scenes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own doc research" ON public.documentary_research FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own doc interviews" ON public.documentary_interviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own storyboards" ON public.storyboard_frames FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own shot lists" ON public.shot_lists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own locations" ON public.production_locations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own inspiration" ON public.inspiration_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own moodboards" ON public.moodboards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own AI history" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_photographs_album ON public.photographs(album_id);
CREATE INDEX IF NOT EXISTS idx_photographs_user ON public.photographs(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_project ON public.scripts(project_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_project ON public.storyboard_frames(project_id);
CREATE INDEX IF NOT EXISTS idx_shot_list_project ON public.shot_lists(project_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.journal_entries(date);
