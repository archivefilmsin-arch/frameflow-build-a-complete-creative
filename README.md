# FRAMEFLOW — Creative Operating System

> *"Every idea deserves to become a story."*

**FrameFlow** is a complete, modern, fully functional Creative Operating System designed for photographers, filmmakers, documentary creators, screenwriters, visual storytellers, and creative individuals.

It brings the entire creative journey into one unified workspace — from capturing an ephemeral spark to researching, writing, planning, shooting, editing, and archiving a finished creative work.

---

## 🌟 The Philosophy

FrameFlow combines:
- **Notion’s organizational capabilities** — flexible relational data, notes, checklists, documents, and timelines.
- **Final Cut Pro’s cinematic creative atmosphere** — deep charcoal surfaces (`#090A0D`), warm off-white typography, and vintage brass/amber accents (`#E5A93C`).
- **Pinterest’s visual inspiration experience** — visual-first moodboards, masonry grids, film stills, and palette generators.
- **A professional screenplay writing suite** — Courier Prime formatting, tab/enter auto-advance, scene breakdowns, 3-act beats, and PDF export.
- **A photographer’s personal archive** — EXIF inspection, shoot planners, gear lockers, and 100-day daily streaks.

---

## 🚀 Primary Navigation & Dedicated Studios

| Studio | Path | Core Capabilities |
|---|---|---|
| **Home Dashboard** | `/` | Time-of-day dynamic greeting, creative quote rotation, real-time metrics, Continue Creating carousel, and live audit feed. |
| **My Projects** | `/projects` | Central project management with Grid, List, and Kanban views. Filter by category (Feature Film, Documentary, Photography, Screenplay, etc.) and status. |
| **Project Workspace** | `/projects/[id]` | Dedicated workspace with 8 integrated tabs: Overview, Notes, Documents (Treatments/Proposals), Visual References, Tasks, Milestone Timeline, Production Files, and Activity. |
| **Photography Studio** | `/photography` | Photo Library (Grid/Masonry + Full-screen Lightbox with EXIF metadata), Shoot Planner, Equipment Locker, 100-Day Photo Challenge tracker, and Public Portfolio view. |
| **Scriptwriting Studio** | `/scripts` | Industry-standard Screenplay Editor (Scene Headings, Action, Character, Dialogue, Parenthetical, Transition), Story Development (Logline, Synopsis, 3-Act structure, Themes), Character Library dossiers, Scene Breakdown cards, and PDF export. |
| **Documentary Studio** | `/documentary` | Investigative Research files with fact verification, Subject Profiles & Eyewitnesses, Interview Planner (with recording notes and quote capture), 4-Movement Narrative Development, and Chronological Timeline. |
| **Film Production** | `/production` | Sequential Storyboard frames with camera angles & movements, Production Shot List table, Location Scout Library with scouting notes & lighting, and Call Sheet / Crew schedule. |
| **Inspiration Vault** | `/inspiration` | Pinterest-style masonry feed of film stills with hex color palettes, quotes, links, and Drag-and-Drop moodboards. |
| **Creative Journal** | `/journal` | Daily creative diary, rapid observation capture, travel reflections, writing prompts, and full-text keyword search. |
| **Archive** | `/archive` | Retrospective vault for completed films, locked drafts, finished photography collections, and restore capability. |
| **Studio Settings** | `/settings` | Artist statement, avatar, OpenAI API key configuration, Supabase PostgreSQL cloud sync, and 1-click JSON workspace backup / restore. |
| **FrameFlow Muse (AI)** | Global Drawer | Omnipresent AI creative advisor with domain modes: Photography, Screenplay, Documentary, Production, and General. Preserves original content with explicit user approval. |

---

## ⌨️ Keyboard Shortcuts & Global Tools

- **`⌘K` / `Ctrl+K`**: Opens the universal Command Palette to jump to any project, script, photo, or journal thought instantly.
- **`ESC`**: Closes active modals, lightboxes, and drawers.
- **Ask Muse**: Trigger omnipresent AI creative counsel anytime from the sidebar or top navigation bar.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom cinematic design system variables
- **Typography**: Playfair Display (Headings), Geist (UI Sans), Courier Prime (Screenplays)
- **Icons**: Lucide React
- **Database Architecture**: PostgreSQL schema in `src/lib/supabase/schema.sql` with Row Level Security (RLS)
- **Local Persistence**: Offline-first reactive local cache with instant synchronization to LocalStorage and optional Supabase sync
- **AI Engine**: Modular hybrid architecture supporting built-in domain creative generation + user-configured OpenAI API keys

---

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start
```
