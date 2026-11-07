'use client';

import { useState } from 'react';
import {
  Camera,
  Plus,
  Search,
  LayoutGrid,
  Maximize2,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Circle,
  Eye,
  X,
  Sliders,
  Sparkles,
  Info,
  MapPin,
  Cpu,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useFrameFlow } from '@/lib/store/useFrameFlowStore';
import { PhotoItem, ShootPlannerItem, EquipmentItem } from '@/types';

export default function PhotographyStudioPage() {
  const {
    photos,
    albums,
    shootPlans,
    equipment,
    challenge,
    addPhoto,
    deletePhoto,
    addAlbum,
    addShootPlan,
    updateShootPlan,
    addEquipment,
    updateEquipment,
    updateChallengeSubmission,
  } = useFrameFlow();

  const [activeTab, setActiveTab] = useState<'library' | 'planner' | 'equipment' | 'challenge' | 'portfolio'>('library');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Full-screen photo viewer state
  const [activeViewerPhoto, setActiveViewerPhoto] = useState<PhotoItem | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewShootModalOpen, setIsNewShootModalOpen] = useState(false);
  const [isNewGearModalOpen, setIsNewGearModalOpen] = useState(false);
  const [selectedChallengeDay, setSelectedChallengeDay] = useState<number | null>(null);
  const [challengePhotoUrl, setChallengePhotoUrl] = useState('');
  const [challengeNotes, setChallengeNotes] = useState('');

  // Upload Photo Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoCamera, setPhotoCamera] = useState('Leica M11');
  const [photoLens, setPhotoLens] = useState('Summilux-M 35mm f/1.4 ASPH');
  const [photoAperture, setPhotoAperture] = useState('f/1.4');
  const [photoShutter, setPhotoShutter] = useState('1/125s');
  const [photoIso, setPhotoIso] = useState('400');
  const [photoLocation, setPhotoLocation] = useState('');
  const [photoTags, setPhotoTags] = useState('');

  // Shoot Planner Form State
  const [shootTitle, setShootTitle] = useState('');
  const [shootLocation, setShootLocation] = useState('');
  const [shootDate, setShootDate] = useState('');
  const [shootConcept, setShootConcept] = useState('');
  const [shootLighting, setShootLighting] = useState('');
  const [shootGear, setShootGear] = useState('');
  const [shootNotes, setShootNotes] = useState('');

  // Gear Form State
  const [gearName, setGearName] = useState('');
  const [gearCategory, setGearCategory] = useState<EquipmentItem['category']>('Camera Body');
  const [gearSerial, setGearSerial] = useState('');
  const [gearNotes, setGearNotes] = useState('');

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    const matchesAlbum = selectedAlbumId === 'all' || p.albumId === selectedAlbumId;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      (p.camera && p.camera.toLowerCase().includes(search.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase()));
    return matchesAlbum && matchesSearch;
  });

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;

    addPhoto({
      title: photoTitle,
      url: photoUrl,
      caption: photoCaption,
      camera: photoCamera,
      lens: photoLens,
      aperture: photoAperture,
      shutterSpeed: photoShutter,
      iso: photoIso,
      location: photoLocation,
      dateTaken: new Date().toISOString().split('T')[0],
      tags: photoTags.split(',').map((t) => t.trim()).filter(Boolean),
      rating: 5,
      isFeatured: true,
      albumId: selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
    });

    setPhotoTitle('');
    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoLocation('');
    setPhotoTags('');
    setIsUploadModalOpen(false);
  };

  const handleCreateShoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shootTitle.trim()) return;

    addShootPlan({
      title: shootTitle,
      location: shootLocation,
      date: shootDate || new Date().toISOString().split('T')[0],
      concept: shootConcept,
      lightingConditions: shootLighting,
      cameraAndLens: shootGear,
      notes: shootNotes,
      shotList: [
        { id: `sl-1`, text: 'Establish wide environment plate at golden hour', done: false },
        { id: `sl-2`, text: 'Medium character portrait with practical rim lighting', done: false },
      ],
      referenceImages: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      ],
      status: 'planned',
    });

    setShootTitle('');
    setShootLocation('');
    setShootConcept('');
    setShootLighting('');
    setShootGear('');
    setShootNotes('');
    setIsNewShootModalOpen(false);
  };

  const handleCreateGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gearName.trim()) return;

    addEquipment({
      name: gearName,
      category: gearCategory,
      serialNumber: gearSerial || undefined,
      status: 'Available',
      notes: gearNotes,
      purchaseDate: new Date().toISOString().split('T')[0],
    });

    setGearName('');
    setGearSerial('');
    setGearNotes('');
    setIsNewGearModalOpen(false);
  };

  const completedChallenges = challenge.submissions.filter((s) => s.completed).length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F232E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E5A93C] mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Arts Discipline</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#F4F4F6]">
            Photography Studio
          </h1>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1">
            Archive high-resolution stills, engineer lighting schematics, manage cinema optics, and run creative streaks
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'library' && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photograph</span>
            </button>
          )}
          {activeTab === 'planner' && (
            <button
              onClick={() => setIsNewShootModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Shoot Session</span>
            </button>
          )}
          {activeTab === 'equipment' && (
            <button
              onClick={() => setIsNewGearModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs hover:bg-[#F3BE65] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-[#232734] pb-px overflow-x-auto no-scrollbar">
        {[
          { id: 'library', label: `Photography Library (${photos.length})` },
          { id: 'planner', label: `Shoot Planner (${shootPlans.length})` },
          { id: 'equipment', label: `Equipment Locker (${equipment.length})` },
          { id: 'challenge', label: `100 Days Challenge (${completedChallenges}/100)` },
          { id: 'portfolio', label: 'Public Portfolio View' },
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

      {/* 1. LIBRARY SUB-SECTION */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Controls: Search, Album Filters, Layout Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#606675] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by camera, location, tag..."
                  className="w-full bg-[#12151D] border border-[#232734] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F4F6] placeholder-[#606675] outline-none focus:border-[#E5A93C]/60"
                />
              </div>

              {/* Album Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedAlbumId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedAlbumId === 'all'
                      ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40'
                      : 'text-[#9CA3AF] hover:text-white bg-[#12151D]'
                  }`}
                >
                  All Albums ({photos.length})
                </button>
                {albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => setSelectedAlbumId(album.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedAlbumId === album.id
                        ? 'bg-[#1C202C] text-[#E5A93C] border border-[#E5A93C]/40'
                        : 'text-[#9CA3AF] hover:text-white bg-[#12151D]'
                    }`}
                  >
                    {album.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout switch */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs text-[#606675]">Layout:</span>
              <div className="flex items-center rounded-lg bg-[#12151D] border border-[#232734] p-0.5">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-md ${layoutMode === 'grid' ? 'bg-[#1E2330] text-[#E5A93C]' : 'text-[#606675]'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('masonry')}
                  className={`p-1.5 rounded-md ${layoutMode === 'masonry' ? 'bg-[#1E2330] text-[#E5A93C]' : 'text-[#606675]'}`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
            }
          >
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActiveViewerPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden bg-[#11131A] border border-[#202430] hover:border-[#383F52] cursor-pointer transition-all hover:shadow-2xl break-inside-avoid"
              >
                {/* Photo Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#181B24]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <span className="p-2 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#E5A93C] font-mono">{photo.camera}</p>
                      <p className="text-sm font-semibold text-white truncate">{photo.title}</p>
                      <p className="text-[11px] text-[#9CA3AF] line-clamp-1">{photo.location}</p>
                    </div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm text-[#F4F4F6] truncate">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-[#E5A93C]">
                      {Array.from({ length: photo.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  {photo.caption && (
                    <p className="text-xs text-[#9CA3AF] line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#606675] pt-2 border-t border-[#1C202C]">
                    <span>{photo.lens || photo.focalLength}</span>
                    <span>{photo.aperture} • {photo.shutterSpeed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SHOOT PLANNER SUB-SECTION */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shootPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-6 rounded-2xl bg-[#11131A] border border-[#202430] space-y-4 hover:border-[#383F52] transition-colors"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E5A93C] block">
                      Shoot Session
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#F4F4F6]">
                      {plan.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                    {plan.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{plan.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{plan.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    <Cpu className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{plan.cameraAndLens}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141720] border border-[#232734] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#606675]">
                    Lighting Condition
                  </span>
                  <p className="text-xs text-[#D1D5DB]">{plan.lightingConditions}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141720] border border-[#232734] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#606675]">
                    Concept Brief
                  </span>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">{plan.concept}</p>
                </div>

                {/* Shot Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-[#9CA3AF]">
                    Planned Shots ({plan.shotList.length})
                  </span>
                  <div className="space-y-1.5">
                    {plan.shotList.map((shot) => (
                      <div
                        key={shot.id}
                        onClick={() => {
                          const updated = plan.shotList.map((s) =>
                            s.id === shot.id ? { ...s, done: !s.done } : s
                          );
                          updateShootPlan(plan.id, { shotList: updated });
                        }}
                        className="flex items-center gap-2 text-xs p-2 rounded-lg bg-[#161922] cursor-pointer hover:bg-[#1C202C]"
                      >
                        {shot.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#606675]" />
                        )}
                        <span className={shot.done ? 'line-through text-[#606675]' : 'text-[#F4F4F6]'}>
                          {shot.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EQUIPMENT LOCKER SUB-SECTION */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#11131A] border border-[#202430] space-y-3 hover:border-[#383F52] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181B24] text-[#E5A93C] border border-[#262B3A]">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.status === 'In Use'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#F4F4F6]">{item.name}</h3>
                {item.notes && <p className="text-xs text-[#9CA3AF] leading-relaxed">{item.notes}</p>}

                <div className="pt-2 border-t border-[#1C202C] flex items-center justify-between text-[11px] text-[#606675]">
                  <span>Serial: {item.serialNumber || 'N/A'}</span>
                  <span>{item.purchaseDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PHOTOGRAPHY CHALLENGE SUB-SECTION */}
      {activeTab === 'challenge' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141822] to-[#101217] border border-[#232734] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#E5A93C] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  100 Days of Visual Discovery
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  Creative Discipline & Visual Daily Habit
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-[#E5A93C]">
                    {completedChallenges}%
                  </span>
                  <span className="text-xs text-[#9CA3AF] block">Completion</span>
                </div>
              </div>
            </div>

            <div className="w-full h-2 bg-[#191D26] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B87E20] to-[#E5A93C] rounded-full"
                style={{ width: `${completedChallenges}%` }}
              />
            </div>
          </div>

          {/* Submissions Calendar / Prompt Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3">
            {challenge.submissions.map((sub) => (
              <div
                key={sub.day}
                onClick={() => {
                  setSelectedChallengeDay(sub.day);
                  setChallengePhotoUrl(sub.photoUrl || '');
                  setChallengeNotes(sub.notes || '');
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-36 ${
                  sub.completed
                    ? 'bg-[#141820] border-[#E5A93C]/40 hover:border-[#E5A93C]'
                    : 'bg-[#101218] border-[#202430] hover:border-[#383F52]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#E5A93C]">DAY {sub.day}</span>
                    {sub.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-[#F4F4F6] font-medium mt-1 line-clamp-2">
                    {sub.prompt}
                  </p>
                </div>

                {sub.photoUrl ? (
                  <div className="h-14 w-full rounded-md overflow-hidden bg-[#181B24] mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sub.photoUrl} alt={`Day ${sub.day}`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-[10px] text-[#606675] italic">Pending capture</span>
                )}
              </div>
            ))}
          </div>

          {/* Submit / Edit Challenge Day Modal */}
          {selectedChallengeDay !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
              <div className="w-full max-w-md bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-white">
                    Day {selectedChallengeDay} Submission
                  </h3>
                  <button onClick={() => setSelectedChallengeDay(null)} className="p-1 text-[#9CA3AF]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Photograph Image URL</label>
                  <input
                    type="url"
                    value={challengePhotoUrl}
                    onChange={(e) => setChallengePhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Observation & Lighting Notes</label>
                  <textarea
                    rows={3}
                    value={challengeNotes}
                    onChange={(e) => setChallengeNotes(e.target.value)}
                    placeholder="Notes on composition, light angle, or camera setup..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedChallengeDay(null)}
                    className="px-3 py-1.5 text-xs text-[#9CA3AF]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateChallengeSubmission(selectedChallengeDay, challengePhotoUrl, challengeNotes);
                      setSelectedChallengeDay(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-semibold"
                  >
                    Record Submission
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PUBLIC PORTFOLIO VIEW SUB-SECTION */}
      {activeTab === 'portfolio' && (
        <div className="space-y-8 p-6 md:p-10 rounded-2xl bg-[#090A0E] border border-[#232734]">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E5A93C]">
              Julian Vance • Selected Archive
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Light, Stillness & The Architecture of Solitude
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed font-serif">
              A curated photographic monograph spanning high-desert fault lines, rain-slicked Tokyo nocturnes, and analog mechanical preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photos.filter((p) => p.isFeatured).map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="aspect-[3/2] w-full rounded-xl overflow-hidden bg-[#141720]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-serif font-bold text-white">{item.title}</h3>
                  <span className="text-xs font-mono text-[#E5A93C]">{item.camera}</span>
                </div>
                {item.caption && <p className="text-xs text-[#9CA3AF] leading-relaxed">{item.caption}</p>}
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#606675]">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>{item.dateTaken}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox Modal with EXIF Metadata */}
      {activeViewerPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col lg:flex-row bg-[#0D0F14] border border-[#232734] rounded-2xl overflow-hidden shadow-2xl">
            {/* Image Preview */}
            <div className="flex-1 bg-black flex items-center justify-center p-4 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeViewerPhoto.url}
                alt={activeViewerPhoto.title}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* EXIF & Details Drawer */}
            <div className="w-full lg:w-80 p-6 bg-[#11131A] border-t lg:border-t-0 lg:border-l border-[#232734] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#E5A93C]">EXIF Metadata</span>
                  <button
                    onClick={() => setActiveViewerPhoto(null)}
                    className="p-1 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1E2330]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {activeViewerPhoto.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-1">{activeViewerPhoto.caption}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1C202C] text-xs">
                  <div>
                    <span className="text-[#606675] block">Camera Body</span>
                    <span className="text-[#F4F4F6] font-mono">{activeViewerPhoto.camera || 'Leica M11'}</span>
                  </div>
                  <div>
                    <span className="text-[#606675] block">Optics / Lens</span>
                    <span className="text-[#F4F4F6] font-mono">{activeViewerPhoto.lens || '35mm Summilux'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2 rounded bg-[#161922] border border-[#232734]">
                      <span className="text-[10px] text-[#606675] block">Aperture</span>
                      <span className="font-mono text-[#E5A93C] font-semibold">{activeViewerPhoto.aperture || 'f/1.4'}</span>
                    </div>
                    <div className="p-2 rounded bg-[#161922] border border-[#232734]">
                      <span className="text-[10px] text-[#606675] block">Shutter</span>
                      <span className="font-mono text-[#E5A93C] font-semibold">{activeViewerPhoto.shutterSpeed || '1/125s'}</span>
                    </div>
                    <div className="p-2 rounded bg-[#161922] border border-[#232734]">
                      <span className="text-[10px] text-[#606675] block">ISO</span>
                      <span className="font-mono text-[#E5A93C] font-semibold">{activeViewerPhoto.iso || '400'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#606675] block">Location</span>
                    <span className="text-[#F4F4F6]">{activeViewerPhoto.location || 'Unknown Coordinates'}</span>
                  </div>
                  <div>
                    <span className="text-[#606675] block">Date Archived</span>
                    <span className="text-[#F4F4F6] font-mono">{activeViewerPhoto.dateTaken}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#232734] flex items-center justify-between">
                <button
                  onClick={() => {
                    deletePhoto(activeViewerPhoto.id);
                    setActiveViewerPhoto(null);
                  }}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Photo
                </button>
                <button
                  onClick={() => setActiveViewerPhoto(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photograph Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Add Photograph to Library</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Dusk Over the Obsidian Ridge"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Atmosphere and context..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Camera Body</label>
                  <input
                    type="text"
                    value={photoCamera}
                    onChange={(e) => setPhotoCamera(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Lens</label>
                  <input
                    type="text"
                    value={photoLens}
                    onChange={(e) => setPhotoLens(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Aperture</label>
                  <input
                    type="text"
                    value={photoAperture}
                    onChange={(e) => setPhotoAperture(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Shutter</label>
                  <input
                    type="text"
                    value={photoShutter}
                    onChange={(e) => setPhotoShutter(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">ISO</label>
                  <input
                    type="text"
                    value={photoIso}
                    onChange={(e) => setPhotoIso(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Location</label>
                <input
                  type="text"
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  placeholder="Mojave National Preserve, California"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={photoTags}
                  onChange={(e) => setPhotoTags(e.target.value)}
                  placeholder="Desert, Twilight, HDR"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#232734]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9CA3AF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs"
                >
                  Add to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Shoot Modal */}
      {isNewShootModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Plan Photography Session</h3>
              <button onClick={() => setIsNewShootModalOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShoot} className="space-y-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Shoot Title *</label>
                <input
                  type="text"
                  required
                  value={shootTitle}
                  onChange={(e) => setShootTitle(e.target.value)}
                  placeholder="e.g. Dawn Mist at Kelso Ridge"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Location</label>
                  <input
                    type="text"
                    value={shootLocation}
                    onChange={(e) => setShootLocation(e.target.value)}
                    placeholder="Location / GPS..."
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">Date</label>
                  <input
                    type="date"
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Shoot Concept</label>
                <textarea
                  rows={2}
                  value={shootConcept}
                  onChange={(e) => setShootConcept(e.target.value)}
                  placeholder="Visual concept, composition intent..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Lighting Conditions</label>
                <input
                  type="text"
                  value={shootLighting}
                  onChange={(e) => setShootLighting(e.target.value)}
                  placeholder="Low-raking golden light, practical tungsten..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Camera & Lens Pairing</label>
                <input
                  type="text"
                  value={shootGear}
                  onChange={(e) => setShootGear(e.target.value)}
                  placeholder="Hasselblad 907X + 45mm"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#232734]">
                <button
                  type="button"
                  onClick={() => setIsNewShootModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9CA3AF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs"
                >
                  Save Shoot Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {isNewGearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#12151D] border border-[#232734] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Add Equipment to Locker</h3>
              <button onClick={() => setIsNewGearModalOpen(false)} className="p-1 text-[#9CA3AF]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGear} className="space-y-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Gear Name *</label>
                <input
                  type="text"
                  required
                  value={gearName}
                  onChange={(e) => setGearName(e.target.value)}
                  placeholder="e.g. Leica Summilux-M 50mm f/1.4"
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Category</label>
                <select
                  value={gearCategory}
                  onChange={(e) => setGearCategory(e.target.value as any)}
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="Camera Body">Camera Body</option>
                  <option value="Lens">Lens</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Audio">Audio</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Filter">Filter</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Serial Number</label>
                <input
                  type="text"
                  value={gearSerial}
                  onChange={(e) => setGearSerial(e.target.value)}
                  placeholder="Optional serial #..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={gearNotes}
                  onChange={(e) => setGearNotes(e.target.value)}
                  placeholder="Condition, optical characteristics..."
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#232734]">
                <button
                  type="button"
                  onClick={() => setIsNewGearModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9CA3AF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E5A93C] text-black font-semibold text-xs"
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
