'use client';

import { useState } from 'react';
import {
  Clapperboard,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  MapPin,
  Calendar,
  Users,
  Camera,
  Film,
  Layers,
  Sparkles,
  Sliders,
  MoveRight,
  Shield,
  Clock,
  Trash2,
  X,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { StoryboardFrame, ShotListItem, LocationItem } from '@/types';

export default function FilmProductionPage() {
  const {
    storyboards,
    shotList,
    locations,
    productionPlanner,
    addStoryboardFrame,
    deleteStoryboardFrame,
    addShot,
    updateShot,
    deleteShot,
    addLocation,
    updateProductionPlanner,
  } = useFrameFlow();

  const [activeTab, setActiveTab] = useState<'storyboard' | 'shots' | 'locations' | 'schedule'>('storyboard');
  const [shotFilterStatus, setShotFilterStatus] = useState<string>('All');

  // Modals state
  const [isAddFrameOpen, setIsAddFrameOpen] = useState(false);
  const [isAddShotOpen, setIsAddShotOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);

  // Form states - Frame
  const [frameScene, setFrameScene] = useState('1');
  const [frameImage, setFrameImage] = useState('');
  const [frameDesc, setFrameDesc] = useState('');
  const [frameAngle, setFrameAngle] = useState<StoryboardFrame['cameraAngle']>('Wide');
  const [frameMovement, setFrameMovement] = useState<StoryboardFrame['cameraMovement']>('Static');
  const [frameAudio, setFrameAudio] = useState('');

  // Form states - Shot
  const [shotNumber, setShotNumber] = useState('1D');
  const [shotScene, setShotScene] = useState('1');
  const [shotType, setShotType] = useState<ShotListItem['shotType']>('MCU');
  const [shotAngle, setShotAngle] = useState('Eye Level');
  const [shotMovement, setShotMovement] = useState('Slow Push In');
  const [shotLens, setShotLens] = useState('Cooke 40mm Anamorphic');
  const [shotLighting, setShotLighting] = useState('Golden Hour Dusk');
  const [shotDesc, setShotDesc] = useState('');

  // Form states - Location
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locCoords, setLocCoords] = useState('');
  const [locNotes, setLocNotes] = useState('');
  const [locLighting, setLocLighting] = useState('');
  const [locRequirements, setLocRequirements] = useState('');
  const [locImage, setLocImage] = useState('');
  const [locPermit, setLocPermit] = useState(true);

  const handleCreateFrame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frameDesc.trim()) return;
    addStoryboardFrame({
      sceneNumber: frameScene,
      frameNumber: storyboards.length + 1,
      imageUrl: frameImage || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      description: frameDesc,
      cameraAngle: frameAngle,
      cameraMovement: frameMovement,
      audioCue: frameAudio,
    });
    setFrameDesc('');
    setFrameImage('');
    setFrameAudio('');
    setIsAddFrameOpen(false);
  };

  const handleCreateShot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shotNumber.trim()) return;
    addShot({
      shotNumber,
      sceneNumber: shotScene,
      shotType,
      cameraAngle: shotAngle,
      cameraMovement: shotMovement,
      lens: shotLens,
      lighting: shotLighting,
      description: shotDesc,
      status: 'To Shoot',
    });
    setShotDesc('');
    setIsAddShotOpen(false);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName.trim()) return;
    addLocation({
      name: locName,
      address: locAddress,
      coordinates: locCoords,
      scoutingNotes: locNotes,
      lightingNotes: locLighting,
      shootingRequirements: locRequirements,
      images: [locImage || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'],
      permitRequired: locPermit,
    });
    setLocName('');
    setLocAddress('');
    setLocCoords('');
    setLocNotes('');
    setLocLighting('');
    setLocRequirements('');
    setLocImage('');
    setIsAddLocationOpen(false);
  };

  const filteredShots = shotList.filter((s) => {
    if (shotFilterStatus === 'All') return true;
    return s.status === shotFilterStatus;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Pre-Production & Production Planning</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            Film Production Studio
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            Sequential storyboards, camera coverage shot lists, scouted location dossiers, and shooting schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'storyboard' && (
            <button
              onClick={() => setIsAddFrameOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Storyboard Frame</span>
            </button>
          )}
          {activeTab === 'shots' && (
            <button
              onClick={() => setIsAddShotOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
            >
              <Plus className="w-4 h-4" />
              <span>New Shot Setup</span>
            </button>
          )}
          {activeTab === 'locations' && (
            <button
              onClick={() => setIsAddLocationOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65]"
            >
              <Plus className="w-4 h-4" />
              <span>Scout Location</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 border-b border-[#232734] pb-px overflow-x-auto no-scrollbar">
        {[
          { id: 'storyboard', label: `Storyboard Frames (${storyboards.length})` },
          { id: 'shots', label: `Camera Shot List (${shotList.length})` },
          { id: 'locations', label: `Location Scout Library (${locations.length})` },
          { id: 'schedule', label: `Call Sheet & Logistics (${productionPlanner.shootDates.length} Days)` },
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

      {/* 1. STORYBOARD STUDIO */}
      {activeTab === 'storyboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storyboards.map((frame) => (
              <div
                key={frame.id}
                className="group rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Frame Image Container */}
                  <div className="relative aspect-[16/9] w-full bg-[#181B24] overflow-hidden">
                    {frame.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={frame.imageUrl}
                        alt={`Scene ${frame.sceneNumber} Frame ${frame.frameNumber}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/75 text-[#E5A93C] font-bold">
                        SCENE {frame.sceneNumber} • #{frame.frameNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteStoryboardFrame(frame.id)}
                      className="absolute top-2.5 right-2.5 p-1 rounded bg-black/75 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#E5A93C]">{frame.cameraAngle}</span>
                      <span className="text-[#9CA3AF]">{frame.cameraMovement}</span>
                    </div>
                    <p className="text-xs text-[#D1D5DB] leading-relaxed line-clamp-3">
                      {frame.description}
                    </p>
                  </div>
                </div>

                {frame.audioCue && (
                  <div className="px-4 py-2 bg-[#141720] border-t border-[#1C202C] text-[10px] text-[#606675]">
                    <span className="font-mono uppercase text-[#9CA3AF]">Audio: </span>
                    {frame.audioCue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CAMERA SHOT LIST TABLE */}
      {activeTab === 'shots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#606675]">Filter Status:</span>
              {['All', 'To Shoot', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setShotFilterStatus(st)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    shotFilterStatus === st
                      ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-[#606675]">
              {filteredShots.length} shots displayed
            </span>
          </div>

          <div className="rounded-2xl border border-[#202430] bg-[#11131A] overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1C202C] bg-[#141720] text-[#606675] font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Shot #</th>
                  <th className="py-3 px-3">Scene</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Angle & Movement</th>
                  <th className="py-3 px-3">Lens & Lighting</th>
                  <th className="py-3 px-4">Action Description</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C202C]">
                {filteredShots.map((shot) => (
                  <tr key={shot.id} className="hover:bg-[#151821] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#E5A93C]">{shot.shotNumber}</td>
                    <td className="py-3 px-3 font-mono">{shot.sceneNumber}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#181B24] font-mono text-[10px] text-white">
                        {shot.shotType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#9CA3AF]">
                      {shot.cameraAngle} • {shot.cameraMovement}
                    </td>
                    <td className="py-3 px-3 text-[#9CA3AF]">
                      {shot.lens} • {shot.lighting}
                    </td>
                    <td className="py-3 px-4 text-[#F4F4F6] max-w-sm leading-relaxed">
                      {shot.description}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={shot.status}
                        onChange={(e) => updateShot(shot.id, { status: e.target.value as any })}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded bg-[#181B24] border outline-none ${
                          shot.status === 'Completed'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : 'text-[#E5A93C] border-[#E5A93C]/30'
                        }`}
                      >
                        <option value="To Shoot">To Shoot</option>
                        <option value="Completed">Completed</option>
                        <option value="Alternative Shot">Alternative</option>
                        <option value="Reshoot Needed">Reshoot</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteShot(shot.id)}
                        className="text-[#606675] hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LOCATION SCOUT LIBRARY */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] transition-colors flex flex-col justify-between"
              >
                <div>
                  {loc.images[0] && (
                    <div className="h-48 w-full bg-[#181B24] relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={loc.images[0]} alt={loc.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase ${
                          loc.permitRequired ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {loc.permitRequired ? 'Permit Required' : 'No Permit'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white">{loc.name}</h3>
                      <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                        {loc.address}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[#606675] uppercase font-mono text-[10px] block">Scouting Notes</span>
                        <p className="text-[#D1D5DB] leading-relaxed">{loc.scoutingNotes}</p>
                      </div>
                      <div>
                        <span className="text-[#606675] uppercase font-mono text-[10px] block">Lighting & Golden Hour</span>
                        <p className="text-[#E5A93C] font-mono text-[11px]">{loc.lightingNotes}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#141720] border-t border-[#1C202C] flex items-center justify-between text-xs text-[#606675]">
                  <span>Contact: {loc.contactPerson || 'Direct scouting'}</span>
                  <span className="font-mono text-[#9CA3AF]">{loc.coordinates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CALL SHEET & SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-8">
          {/* Shoot Days Timeline */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-white">Shooting Schedule & Call Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productionPlanner.shootDates.map((day, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C202C]">
                    <span className="text-xs font-mono text-[#E5A93C] font-bold">DAY {i + 1}</span>
                    <span className="text-xs font-mono text-white">{day.date}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-white font-medium">{day.location}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#9CA3AF] pt-1">
                      <span>Call: {day.callTime}</span>
                      <span>Wrap: {day.wrapTime}</span>
                    </div>
                    <p className="text-[11px] text-[#606675] pt-1">{day.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cast & Crew Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cast */}
            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
              <h3 className="text-base font-serif font-bold text-white">Cast Directory</h3>
              <div className="divide-y divide-[#1C202C]">
                {productionPlanner.cast.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{c.characterName}</p>
                      <p className="text-[#9CA3AF]">{c.actorName}</p>
                    </div>
                    <span className="font-mono text-[#E5A93C]">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew */}
            <div className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4">
              <h3 className="text-base font-serif font-bold text-white">Key Crew Department</h3>
              <div className="divide-y divide-[#1C202C]">
                {productionPlanner.crew.map((cr) => (
                  <div key={cr.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{cr.role}</p>
                      <p className="text-[#9CA3AF]">{cr.name}</p>
                    </div>
                    <span className="font-mono text-[#606675]">{cr.rateOrNotes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Storyboard Frame Modal */}
      {isAddFrameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Add Storyboard Frame</h3>
              <button onClick={() => setIsAddFrameOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFrame} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Scene Number</label>
                  <input
                    type="text"
                    value={frameScene}
                    onChange={(e) => setFrameScene(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Frame Reference Image URL</label>
                  <input
                    type="url"
                    value={frameImage}
                    onChange={(e) => setFrameImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Camera Angle</label>
                  <select
                    value={frameAngle}
                    onChange={(e) => setFrameAngle(e.target.value as any)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="Wide">Wide</option>
                    <option value="Medium">Medium</option>
                    <option value="Close-Up">Close-Up</option>
                    <option value="Extreme Close-Up">Extreme Close-Up</option>
                    <option value="Dutch Angle">Dutch Angle</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Camera Movement</label>
                  <select
                    value={frameMovement}
                    onChange={(e) => setFrameMovement(e.target.value as any)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="Static">Static</option>
                    <option value="Pan">Pan</option>
                    <option value="Tilt">Tilt</option>
                    <option value="Dolly / Push In">Dolly / Push In</option>
                    <option value="Steadicam">Steadicam</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Visual Composition & Action *</label>
                <textarea
                  rows={3}
                  required
                  value={frameDesc}
                  onChange={(e) => setFrameDesc(e.target.value)}
                  placeholder="Describe framing, blocking, light, and subject motion..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Audio Cue (Optional)</label>
                <input
                  type="text"
                  value={frameAudio}
                  onChange={(e) => setFrameAudio(e.target.value)}
                  placeholder="Foley, sound effect, musical swell..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddFrameOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Save Frame
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Shot Modal */}
      {isAddShotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Create Camera Shot Setup</h3>
              <button onClick={() => setIsAddShotOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShot} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={shotNumber}
                  onChange={(e) => setShotNumber(e.target.value)}
                  placeholder="Shot # (e.g. 1D)"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={shotScene}
                  onChange={(e) => setShotScene(e.target.value)}
                  placeholder="Scene #"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
                <select
                  value={shotType}
                  onChange={(e) => setShotType(e.target.value as any)}
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="ECU">ECU</option>
                  <option value="CU">CU</option>
                  <option value="MCU">MCU</option>
                  <option value="MS">MS</option>
                  <option value="WS">WS</option>
                  <option value="EWS">EWS</option>
                  <option value="OTS">OTS</option>
                  <option value="POV">POV</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={shotLens}
                  onChange={(e) => setShotLens(e.target.value)}
                  placeholder="Lens (e.g. Cooke 40mm)"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={shotLighting}
                  onChange={(e) => setShotLighting(e.target.value)}
                  placeholder="Lighting setup"
                  className="bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <textarea
                rows={3}
                required
                value={shotDesc}
                onChange={(e) => setShotDesc(e.target.value)}
                placeholder="Shot action, camera movement, and blocking..."
                className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg p-2.5 text-xs text-white outline-none"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-[#232734]">
                <button type="button" onClick={() => setIsAddShotOpen(false)} className="px-3 py-1.5 text-xs text-[#9CA3AF]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs">
                  Save Shot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
