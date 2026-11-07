'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Key,
  Database,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Check,
  Code,
  Copy,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    exportAllData,
    importAllData,
    resetToFactoryData,
  } = useFrameFlow();

  const [creatorName, setCreatorName] = useState(settings.creatorName);
  const [creatorBio, setCreatorBio] = useState(settings.creatorBio);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl);
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(settings.supabaseAnonKey || '');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      creatorName,
      creatorBio,
      avatarUrl,
      openaiApiKey: apiKey,
      supabaseUrl,
      supabaseAnonKey: supabaseKey,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frameflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          alert('Workspace imported successfully!');
        } else {
          alert('Failed to parse backup file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#1F232E]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
          Studio Settings
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
          Configure creator profile, secure external AI keys, Supabase backend sync, and workspace data portability
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* 1. Creator Identity */}
        <section className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#1C202C]">
            <User className="w-4 h-4 text-[#E5A93C]" />
            <h2 className="text-base font-serif font-bold text-white">Creator Dossier</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#2B3041] bg-[#181B24]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={creatorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] text-[#606675]">Creator Avatar</span>
            </div>

            <div className="sm:col-span-2 space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Creator Name</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3.5 py-2 text-sm text-white outline-none focus:border-[#E5A93C]/60"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3.5 py-2 text-sm text-white outline-none focus:border-[#E5A93C]/60"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Artist Statement / Bio</label>
                <textarea
                  rows={3}
                  value={creatorBio}
                  onChange={(e) => setCreatorBio(e.target.value)}
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-3 text-xs text-white leading-relaxed outline-none focus:border-[#E5A93C]/60"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. AI Creative Assistant API Credentials */}
        <section className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#1C202C]">
            <Key className="w-4 h-4 text-[#E5A93C]" />
            <div>
              <h2 className="text-base font-serif font-bold text-white">AI Creative Assistant (FrameFlow Muse)</h2>
              <p className="text-xs text-[#9CA3AF]">
                Use the built-in intelligent creative engine, or provide your custom OpenAI API key for live GPT-4o-mini generation
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9CA3AF] block mb-1">OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-[#E5A93C]/60"
            />
            <p className="text-[11px] text-[#606675] mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Credentials remain strictly on your client / secure server environment variables.
            </p>
          </div>
        </section>

        {/* 3. Supabase Cloud Sync Configuration */}
        <section className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#1C202C]">
            <Database className="w-4 h-4 text-[#E5A93C]" />
            <div>
              <h2 className="text-base font-serif font-bold text-white">Supabase Cloud Database Sync</h2>
              <p className="text-xs text-[#9CA3AF]">
                Optional PostgreSQL cloud sync with Row Level Security (RLS)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#E5A93C]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1">Supabase Anon Public Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#E5A93C]/60"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F232E] space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#E5A93C] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                PostgreSQL Database Schema & RLS
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`-- FRAMEFLOW DB SCHEMA INCLUDED IN src/lib/supabase/schema.sql`);
                  setCopiedSchema(true);
                  setTimeout(() => setCopiedSchema(false), 2000);
                }}
                className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#606675]">
              Schema file is located at <code className="text-[#E5A93C]">src/lib/supabase/schema.sql</code> with 21 relational tables, foreign keys, timestamps, indexes, and full Row Level Security policies.
            </p>
          </div>
        </section>

        {/* Save Settings Trigger */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Preferences saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-all shadow-md"
          >
            Save Studio Settings
          </button>
        </div>
      </form>

      {/* 4. Data Portability & Workspace Reset */}
      <section className="p-6 md:p-8 rounded-2xl bg-[#11131A] border border-[#202430] space-y-5">
        <h2 className="text-base font-serif font-bold text-white">Workspace Data Portability</h2>
        <p className="text-xs text-[#9CA3AF]">
          FrameFlow is offline-first. Export your complete archive as a single portable JSON file anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181B24] border border-[#262B3A] text-xs font-semibold text-white hover:border-[#E5A93C]/50 transition-colors"
          >
            <Download className="w-4 h-4 text-[#E5A93C]" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181B24] border border-[#262B3A] text-xs font-semibold text-white hover:border-[#E5A93C]/50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#E5A93C]" />
            <span>Restore Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset FrameFlow to factory seed data? This will clear local changes.')) {
                resetToFactoryData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/30 border border-red-900/50 text-xs font-semibold text-rose-300 hover:bg-red-900/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Factory Data</span>
          </button>
        </div>
      </section>
    </div>
  );
}
