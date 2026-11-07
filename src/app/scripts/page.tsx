'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Plus,
  Save,
  Download,
  Clock,
  Sparkles,
  Users,
  Film,
  BookOpen,
  Trash2,
  ChevronDown,
  Check,
  Printer,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { ScreenplayElementType, ScriptLine, CharacterItem, SceneBreakdownItem } from '@/types';

export default function ScriptwritingStudioPage() {
  const {
    scripts,
    updateScript,
    addScript,
    projects,
  } = useFrameFlow();

  const [activeScriptId, setActiveScriptId] = useState<string>(scripts[0]?.id || '');
  const [studioTab, setStudioTab] = useState<'editor' | 'development' | 'characters' | 'scenes'>('editor');
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string>('All changes saved');

  // New element draft state
  const [newElementType, setNewElementType] = useState<ScreenplayElementType>('action');
  const [newElementText, setNewElementText] = useState('');

  // Character Form state
  const [isAddingChar, setIsAddingChar] = useState(false);
  const [charName, setCharName] = useState('');
  const [charAge, setCharAge] = useState('');
  const [charRole, setCharRole] = useState<CharacterItem['role']>('Protagonist');
  const [charPersonality, setCharPersonality] = useState('');
  const [charMotivation, setCharMotivation] = useState('');
  const [charArc, setCharArc] = useState('');
  const [charImage, setCharImage] = useState('');

  // Scene Breakdown Form state
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [sceneHeading, setSceneHeading] = useState('EXT. DESERT OUTPOST - DUSK');
  const [sceneLocation, setSceneLocation] = useState('Mojave Highway');
  const [sceneIntExt, setSceneIntExt] = useState<'INT' | 'EXT' | 'INT/EXT'>('EXT');
  const [sceneDayNight, setSceneDayNight] = useState<'DAY' | 'NIGHT' | 'DUSK' | 'DAWN'>('DUSK');
  const [sceneCharacters, setSceneCharacters] = useState('Jesse Vance, Elena');
  const [sceneDescription, setSceneDescription] = useState('');
  const [sceneNotes, setSceneNotes] = useState('');

  const currentScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  const handleUpdateLine = (lineId: string, text: string) => {
    if (!currentScript) return;
    const updated = currentScript.elements.map((el) =>
      el.id === lineId ? { ...el, text } : el
    );
    updateScript(currentScript.id, { elements: updated });
    triggerAutoSave();
  };

  const handleUpdateLineType = (lineId: string, type: ScreenplayElementType) => {
    if (!currentScript) return;
    const updated = currentScript.elements.map((el) =>
      el.id === lineId ? { ...el, type } : el
    );
    updateScript(currentScript.id, { elements: updated });
    triggerAutoSave();
  };

  const handleDeleteLine = (lineId: string) => {
    if (!currentScript) return;
    const updated = currentScript.elements.filter((el) => el.id !== lineId);
    updateScript(currentScript.id, { elements: updated });
    triggerAutoSave();
  };

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElementText.trim() || !currentScript) return;

    const newLine: ScriptLine = {
      id: `el-${Date.now()}`,
      type: newElementType,
      text: newElementText,
    };

    updateScript(currentScript.id, {
      elements: [...currentScript.elements, newLine],
    });

    setNewElementText('');
    // Automatically transition to next logical screenplay element
    if (newElementType === 'scene-heading') setNewElementType('action');
    else if (newElementType === 'character') setNewElementType('dialogue');
    else if (newElementType === 'dialogue') setNewElementType('character');

    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setSavedStatus('Saving...');
    setTimeout(() => {
      setSavedStatus('Saved');
      setTimeout(() => setSavedStatus('All changes saved'), 2000);
    }, 400);
  };

  const handleSaveSnapshot = () => {
    if (!currentScript) return;
    const newVer = (parseFloat(currentScript.version.replace(/[^0-9.]/g, '')) + 0.1).toFixed(1);
    const updatedVersions = [
      {
        version: newVer,
        savedAt: new Date().toISOString(),
        note: 'Manual revision checkpoint',
        lineCount: currentScript.elements.length,
      },
      ...currentScript.versions,
    ];
    updateScript(currentScript.id, {
      version: `Draft ${newVer}`,
      versions: updatedVersions,
    });
    alert(`Snapshot saved as Draft ${newVer}!`);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charName.trim() || !currentScript) return;

    const newChar: CharacterItem = {
      id: `char-${Date.now()}`,
      name: charName,
      age: charAge,
      role: charRole,
      appearance: 'Screenplay character dossier',
      personality: charPersonality,
      background: 'Detailed profile',
      motivation: charMotivation,
      characterArc: charArc,
      referenceImage: charImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    };

    updateScript(currentScript.id, {
      characters: [...currentScript.characters, newChar],
    });

    setCharName('');
    setCharAge('');
    setCharPersonality('');
    setCharMotivation('');
    setCharArc('');
    setCharImage('');
    setIsAddingChar(false);
  };

  const handleAddScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneHeading.trim() || !currentScript) return;

    const newScene: SceneBreakdownItem = {
      id: `sc-${Date.now()}`,
      scriptId: currentScript.id,
      sceneNumber: currentScript.scenes.length + 1,
      heading: sceneHeading,
      location: sceneLocation,
      intExt: sceneIntExt,
      dayNight: sceneDayNight,
      characters: sceneCharacters.split(',').map((c) => c.trim()),
      description: sceneDescription,
      dialogueSnippet: '',
      productionNotes: sceneNotes,
    };

    updateScript(currentScript.id, {
      scenes: [...currentScript.scenes, newScene],
    });

    setSceneDescription('');
    setSceneNotes('');
    setIsAddingScene(false);
  };

  return (
    <div className={`p-6 md:p-10 max-w-7xl mx-auto space-y-6 ${isDistractionFree ? 'fixed inset-0 z-50 bg-[#090A0D] p-4 overflow-y-auto max-w-none' : ''}`}>
      {/* Studio Header & Script Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Screenwriting & Narrative Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={activeScriptId}
              onChange={(e) => setActiveScriptId(e.target.value)}
              className="font-serif font-bold text-2xl md:text-3xl text-[#F4F4F6] bg-transparent outline-none cursor-pointer hover:text-[#E5A93C] transition-colors border-b border-transparent hover:border-[#E5A93C]"
            >
              {scripts.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#12151D] text-white">
                  {s.title}
                </option>
              ))}
            </select>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
              {currentScript?.version}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#606675] hidden md:inline">
            {savedStatus}
          </span>
          <button
            onClick={handleSaveSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 text-xs text-[#9CA3AF] hover:text-white transition-all"
            title="Create Version Snapshot"
          >
            <Save className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="hidden sm:inline">Checkpoint</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 text-xs text-[#9CA3AF] hover:text-white transition-all"
            title="Export / Print Screenplay"
          >
            <Printer className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={() => setIsDistractionFree(!isDistractionFree)}
            className="p-2 rounded-lg bg-[#161922] border border-[#232734] hover:border-[#E5A93C]/40 text-xs text-[#9CA3AF] hover:text-white transition-all"
            title={isDistractionFree ? 'Exit Full Screen' : 'Distraction-Free Mode'}
          >
            {isDistractionFree ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              const title = prompt('Enter screenplay title:', 'UNTITLED SCREENPLAY');
              if (title) {
                const newId = addScript(title);
                setActiveScriptId(newId);
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Script</span>
          </button>
        </div>
      </div>

      {/* Workspace Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-[#232734] pb-px overflow-x-auto no-scrollbar">
        {[
          { id: 'editor', label: 'Screenplay Editor' },
          { id: 'development', label: 'Story Development & 3-Act Structure' },
          { id: 'characters', label: `Character Dossiers (${currentScript?.characters?.length || 0})` },
          { id: 'scenes', label: `Scene Breakdown (${currentScript?.scenes?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStudioTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
              studioTab === tab.id
                ? 'border-[#E5A93C] text-[#E5A93C] font-semibold bg-[#13161F]'
                : 'border-transparent text-[#9CA3AF] hover:text-white hover:bg-[#11131A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SCREENPLAY WRITING EDITOR */}
      {studioTab === 'editor' && currentScript && (
        <div className="space-y-6">
          {/* Screenplay Formatting Toolbar */}
          <div className="p-2.5 rounded-xl bg-[#12151D] border border-[#232734] flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#606675] px-2">Format:</span>
            {[
              { type: 'scene-heading', label: 'Scene Heading', shortcut: '⌘1' },
              { type: 'action', label: 'Action', shortcut: '⌘2' },
              { type: 'character', label: 'Character', shortcut: '⌘3' },
              { type: 'parenthetical', label: 'Parenthetical', shortcut: '⌘4' },
              { type: 'dialogue', label: 'Dialogue', shortcut: '⌘5' },
              { type: 'transition', label: 'Transition', shortcut: '⌘6' },
            ].map((fmt) => (
              <button
                key={fmt.type}
                type="button"
                onClick={() => setNewElementType(fmt.type as any)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                  newElementType === fmt.type
                    ? 'bg-[#E5A93C] text-black font-bold shadow-xs'
                    : 'bg-[#181B24] text-[#9CA3AF] hover:text-white hover:bg-[#1E2330]'
                }`}
              >
                <span>{fmt.label}</span>
                <span className="opacity-50 text-[9px]">{fmt.shortcut}</span>
              </button>
            ))}
          </div>

          {/* Screenplay Page Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-[820px] bg-[#0C0D12] border border-[#232734] rounded-2xl p-8 md:p-14 shadow-2xl space-y-4 font-mono min-h-[600px]">
              {/* Script Title Page Header */}
              <div className="text-center pb-8 border-b border-[#1E2330] space-y-1">
                <h2 className="text-xl uppercase font-bold tracking-widest text-[#F4F4F6]">
                  {currentScript.title}
                </h2>
                <p className="text-xs text-[#606675] tracking-widest uppercase">
                  Written by Julian Vance • {currentScript.version}
                </p>
              </div>

              {/* Elements Stream */}
              <div className="space-y-3 pt-4">
                {currentScript.elements.map((el) => {
                  let styleClass = '';
                  if (el.type === 'scene-heading') styleClass = 'font-bold uppercase tracking-wider text-[#E5A93C] mt-6 mb-2';
                  else if (el.type === 'action') styleClass = 'text-[#D1D5DB] leading-relaxed mb-3';
                  else if (el.type === 'character') styleClass = 'font-bold uppercase text-white text-center w-3/5 mx-auto mt-4 mb-0.5';
                  else if (el.type === 'parenthetical') styleClass = 'italic text-[#9CA3AF] text-center w-2/5 mx-auto mb-0.5';
                  else if (el.type === 'dialogue') styleClass = 'text-[#F3F4F6] text-center w-4/5 mx-auto mb-3 leading-relaxed';
                  else if (el.type === 'transition') styleClass = 'font-bold uppercase text-right text-[#9CA3AF] mt-4 mb-4';

                  return (
                    <div key={el.id} className="group relative flex items-start gap-2">
                      <div className="flex-1">
                        <textarea
                          rows={Math.max(1, Math.ceil(el.text.length / 65))}
                          value={el.text}
                          onChange={(e) => handleUpdateLine(el.id, e.target.value)}
                          className={`w-full bg-transparent resize-none outline-none border-b border-transparent focus:border-[#E5A93C]/40 transition-colors ${styleClass}`}
                        />
                      </div>

                      {/* Element Type pill & Delete button on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 pt-1">
                        <select
                          value={el.type}
                          onChange={(e) => handleUpdateLineType(el.id, e.target.value as any)}
                          className="bg-[#181B24] border border-[#262B3A] text-[9px] rounded px-1.5 py-0.5 text-[#9CA3AF] outline-none"
                        >
                          <option value="scene-heading">HEADING</option>
                          <option value="action">ACTION</option>
                          <option value="character">CHARACTER</option>
                          <option value="parenthetical">PAREN</option>
                          <option value="dialogue">DIALOGUE</option>
                          <option value="transition">TRANSITION</option>
                        </select>
                        <button
                          onClick={() => handleDeleteLine(el.id)}
                          className="text-[#606675] hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Line Input */}
              <form onSubmit={handleAddLine} className="pt-6 border-t border-[#1C202C] flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#E5A93C] px-2 py-1 rounded bg-[#181B24] shrink-0">
                  {newElementType}
                </span>
                <input
                  type="text"
                  value={newElementText}
                  onChange={(e) => setNewElementText(e.target.value)}
                  placeholder={`Type next ${newElementType} line... (Press Enter to append)`}
                  className="flex-1 bg-[#141720] border border-[#232734] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#E5A93C]/60"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
                >
                  Append
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. STORY DEVELOPMENT TAB */}
      {studioTab === 'development' && currentScript && (
        <div className="space-y-6">
          {/* Logline & Story Concept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
              <span className="text-xs font-mono uppercase text-[#E5A93C] font-semibold">
                Central Logline
              </span>
              <textarea
                rows={4}
                value={currentScript.development.logline}
                onChange={(e) =>
                  updateScript(currentScript.id, {
                    development: { ...currentScript.development, logline: e.target.value },
                  })
                }
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-xl p-3 text-sm text-[#F4F4F6] font-serif leading-relaxed outline-none"
              />
            </div>

            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
              <span className="text-xs font-mono uppercase text-[#E5A93C] font-semibold">
                Core Story Concept & Paradox
              </span>
              <textarea
                rows={4}
                value={currentScript.development.storyConcept}
                onChange={(e) =>
                  updateScript(currentScript.id, {
                    development: { ...currentScript.development, storyConcept: e.target.value },
                  })
                }
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-xl p-3 text-sm text-[#F4F4F6] font-serif leading-relaxed outline-none"
              />
            </div>
          </div>

          {/* 3-Act Structure Cards */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-white">Three-Act Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-2">
                <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                  Act I: Setup & Inciting Incident
                </span>
                <textarea
                  rows={6}
                  value={currentScript.development.act1}
                  onChange={(e) =>
                    updateScript(currentScript.id, {
                      development: { ...currentScript.development, act1: e.target.value },
                    })
                  }
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-[#D1D5DB] outline-none"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-2">
                <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                  Act IIA: Rising Complications
                </span>
                <textarea
                  rows={6}
                  value={currentScript.development.act2a}
                  onChange={(e) =>
                    updateScript(currentScript.id, {
                      development: { ...currentScript.development, act2a: e.target.value },
                    })
                  }
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-[#D1D5DB] outline-none"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-2">
                <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                  Act IIB: Midpoint to All Is Lost
                </span>
                <textarea
                  rows={6}
                  value={currentScript.development.act2b}
                  onChange={(e) =>
                    updateScript(currentScript.id, {
                      development: { ...currentScript.development, act2b: e.target.value },
                    })
                  }
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-[#D1D5DB] outline-none"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-2">
                <span className="text-[10px] font-mono text-[#E5A93C] uppercase block">
                  Act III: Climax & Resolution
                </span>
                <textarea
                  rows={6}
                  value={currentScript.development.act3}
                  onChange={(e) =>
                    updateScript(currentScript.id, {
                      development: { ...currentScript.development, act3: e.target.value },
                    })
                  }
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-[#D1D5DB] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Themes & Ending */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
              <span className="text-xs font-mono uppercase text-[#E5A93C] font-semibold">
                Major Themes
              </span>
              <div className="flex flex-wrap gap-2">
                {currentScript.development.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[#181B24] text-xs font-mono text-[#F4F4F6] border border-[#262B3A]"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
              <span className="text-xs font-mono uppercase text-[#E5A93C] font-semibold">
                Ending & Lingering Resonance
              </span>
              <p className="text-xs text-[#D1D5DB] font-serif leading-relaxed">
                {currentScript.development.ending}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHARACTER LIBRARY TAB */}
      {studioTab === 'characters' && currentScript && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Character Dossiers</h3>
              <p className="text-xs text-[#9CA3AF]">
                Motivations, fatal flaws, appearances, and psychological arcs
              </p>
            </div>
            <button
              onClick={() => setIsAddingChar(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Character
            </button>
          </div>

          {isAddingChar && (
            <form onSubmit={handleAddCharacter} className="p-6 rounded-2xl bg-[#12151D] border border-[#E5A93C]/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  placeholder="Character Name *"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={charAge}
                  onChange={(e) => setCharAge(e.target.value)}
                  placeholder="Age (e.g. 58)"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
                <select
                  value={charRole}
                  onChange={(e) => setCharRole(e.target.value as any)}
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Protagonist">Protagonist</option>
                  <option value="Antagonist">Antagonist</option>
                  <option value="Supporting">Supporting</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>

              <textarea
                rows={2}
                value={charPersonality}
                onChange={(e) => setCharPersonality(e.target.value)}
                placeholder="Personality & fatal flaw..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={charMotivation}
                onChange={(e) => setCharMotivation(e.target.value)}
                placeholder="Primary Dramatic Want vs. Unconscious Need..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={charArc}
                onChange={(e) => setCharArc(e.target.value)}
                placeholder="Character transformation arc..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddingChar(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold">
                  Save Character
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentScript.characters.map((char) => (
              <div
                key={char.id}
                className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] flex flex-col sm:flex-row gap-5 hover:border-[#383F52] transition-colors"
              >
                {char.referenceImage && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#181B24]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.referenceImage} alt={char.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-serif font-bold text-white">{char.name}</h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C]">
                      {char.role} • Age {char.age}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF]"><strong className="text-white">Personality:</strong> {char.personality}</p>
                  <p className="text-xs text-[#9CA3AF]"><strong className="text-white">Motivation:</strong> {char.motivation}</p>
                  <p className="text-xs text-[#9CA3AF]"><strong className="text-white">Arc:</strong> {char.characterArc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SCENE BREAKDOWN TAB */}
      {studioTab === 'scenes' && currentScript && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Scene Breakdown Cards</h3>
              <p className="text-xs text-[#9CA3AF]">
                Locations, day/night flags, characters in scene, and production notes
              </p>
            </div>
            <button
              onClick={() => setIsAddingScene(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#F3BE65]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Scene Card
            </button>
          </div>

          {isAddingScene && (
            <form onSubmit={handleAddScene} className="p-6 rounded-2xl bg-[#12151D] border border-[#E5A93C]/40 space-y-3">
              <input
                type="text"
                required
                value={sceneHeading}
                onChange={(e) => setSceneHeading(e.target.value)}
                placeholder="Scene Heading (e.g. EXT. MOJAVE BASIN - TWILIGHT)"
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none"
              />
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={sceneIntExt}
                  onChange={(e) => setSceneIntExt(e.target.value as any)}
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="INT">INT</option>
                  <option value="EXT">EXT</option>
                  <option value="INT/EXT">INT/EXT</option>
                </select>
                <select
                  value={sceneDayNight}
                  onChange={(e) => setSceneDayNight(e.target.value as any)}
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="DAY">DAY</option>
                  <option value="NIGHT">NIGHT</option>
                  <option value="DUSK">DUSK</option>
                  <option value="DAWN">DAWN</option>
                </select>
                <input
                  type="text"
                  value={sceneCharacters}
                  onChange={(e) => setSceneCharacters(e.target.value)}
                  placeholder="Characters in scene"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <textarea
                rows={2}
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder="Scene dramatic event description..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <textarea
                rows={2}
                value={sceneNotes}
                onChange={(e) => setSceneNotes(e.target.value)}
                placeholder="Production requirements, lighting, stunts..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddingScene(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold">
                  Add Scene Card
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {currentScript.scenes.map((sc) => (
              <div
                key={sc.id}
                className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3 hover:border-[#383F52] transition-colors"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1C202C]">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-xs font-mono font-bold text-[#E5A93C]">
                      {sc.sceneNumber}
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white uppercase">{sc.heading}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C]">{sc.intExt}</span>
                    <span className="px-2 py-0.5 rounded bg-[#181B24] text-[#9CA3AF]">{sc.dayNight}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[10px] text-[#606675] uppercase font-mono">Scene Action</span>
                    <p className="text-[#D1D5DB] leading-relaxed">{sc.description}</p>
                    {sc.dialogueSnippet && (
                      <p className="text-[#E5A93C] italic font-serif pt-1">{sc.dialogueSnippet}</p>
                    )}
                  </div>
                  <div className="space-y-1 sm:border-l sm:border-[#1C202C] sm:pl-4">
                    <span className="text-[10px] text-[#606675] uppercase font-mono">Production Notes</span>
                    <p className="text-[#9CA3AF]">{sc.productionNotes || 'None'}</p>
                    <div className="pt-2">
                      <span className="text-[10px] text-[#606675] uppercase font-mono block">Characters</span>
                      <span className="text-white font-mono text-[11px]">{sc.characters.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
