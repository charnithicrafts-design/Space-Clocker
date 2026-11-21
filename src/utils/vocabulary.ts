import { useTrackStore } from '../store/useTrackStore';

export type VocabularyMode = 'original' | 'people';

export interface VocabularyTerms {
  // Navigation
  navTactical: string;
  navStrategic: string;
  navCommunications: string;
  navMomentum: string;
  navOrbit: string;
  navNebula: string;
  navTimeline: string;
  navSkills: string;
  navProfile: string;
  navHorizon: string;
  navDocs: string;
  navTransmission: string;
  navSettings: string;
  
  // Dashboard / Momentum Engine
  momentumTitle: string;
  momentumSubtitle: string;
  cognitiveSyncTitle: string;
  activeTrajectoryTitle: string;
  stellarTimelineTitle: string;
  quickAddTask: string;

  // Orbit / Scheduler
  orbitTitle: string;
  orbitSubtitle: string;
  subOrbits: string;
  voidProtocolTitle: string;
  voidProtocolSubtitle: string;
  addVoid: string;
  trajectorySelector: string;

  // Nebula / Goals
  nebulaTitle: string;
  nebulaSubtitle: string;
  milestonesTitle: string;
  ambitionNew: string;

  // Skills
  skillsTitle: string;
  skillsSubtitle: string;
  brightStars: string;

  // Horizon / Analytics
  horizonTitle: string;
  horizonSubtitle: string;
  gravityWells: string;
  cryosleepRest: string;

  // Settings & Sync
  settingsTitle: string;
  pilotProfile: string;
  neuralLinkTitle: string;
  neuralLinkSubtitle: string;
  systemManifestTitle: string;
  vocabularyModeTitle: string;
  vocabularyModeDesc: string;
  originalModeLabel: string;
  originalModeDesc: string;
  peopleModeLabel: string;
  peopleModeDesc: string;
}

export const VOCABULARY_DICTIONARY: Record<VocabularyMode, VocabularyTerms> = {
  original: {
    navTactical: 'Tactical Sector',
    navStrategic: 'Strategic Sector',
    navCommunications: 'Communications',
    navMomentum: 'Momentum',
    navOrbit: 'Orbit',
    navNebula: 'Nebula',
    navTimeline: 'Timeline',
    navSkills: 'Skills',
    navProfile: 'Profile',
    navHorizon: 'Horizon',
    navDocs: 'Docs',
    navTransmission: 'Transmission',
    navSettings: 'System Config',

    momentumTitle: 'Momentum Engine',
    momentumSubtitle: 'Real-time telemetry and trajectory acceleration.',
    cognitiveSyncTitle: 'Cognitive Sync',
    activeTrajectoryTitle: 'Active Trajectory',
    stellarTimelineTitle: 'Stellar Timeline',
    quickAddTask: 'Initiate Sub-Orbit Task',

    orbitTitle: 'Orbit Scheduler',
    orbitSubtitle: 'Daily mission execution and task synchronization.',
    subOrbits: 'Sub-Orbits',
    voidProtocolTitle: 'The Void Protocol',
    voidProtocolSubtitle: 'Active countermeasures against temporal decay.',
    addVoid: 'Identify Void Anomaly',
    trajectorySelector: 'Assigned Trajectory',

    nebulaTitle: 'Nebula Architect',
    nebulaSubtitle: 'Macro-ambition decomposition and star system mapping.',
    milestonesTitle: 'Stellar Milestones',
    ambitionNew: 'Ignite New Ambition',

    skillsTitle: 'Stellar Matrix',
    skillsSubtitle: 'Competency radar and proficiency constellations.',
    brightStars: 'Bright Stars',

    horizonTitle: 'Trajectory Horizon',
    horizonSubtitle: 'Telemetry analytics, velocity curves, and drift tracking.',
    gravityWells: 'Gravity Wells',
    cryosleepRest: 'Cryosleep Stasis',

    settingsTitle: 'System Protocol',
    pilotProfile: 'Pilot Profile',
    neuralLinkTitle: 'Neural Link Array',
    neuralLinkSubtitle: 'Establish cross-device quantum state synchronization.',
    systemManifestTitle: 'System Manifest',
    vocabularyModeTitle: 'Terminology Interface',
    vocabularyModeDesc: 'Select your preferred language model: sci-fi telemetry or friendly everyday vocabulary.',
    originalModeLabel: 'Original Mode (Cosmic)',
    originalModeDesc: 'Immersive space-themed telemetry: Nebulae, Orbits, Void Protocol & Chronos Core.',
    peopleModeLabel: 'People Mode (Everyday)',
    peopleModeDesc: 'Clear, universal productivity terms: Goals, Daily Tasks, Habits to Avoid & Cloud Sync.'
  },
  people: {
    navTactical: 'Daily Focus',
    navStrategic: 'Long-Term Planning',
    navCommunications: 'Resources & Reports',
    navMomentum: 'Daily Progress',
    navOrbit: 'Daily Tasks',
    navNebula: 'Goals & Ambitions',
    navTimeline: 'Calendar Schedule',
    navSkills: 'Skills Radar',
    navProfile: 'Your Profile',
    navHorizon: 'Weekly Insights',
    navDocs: 'User Guides',
    navTransmission: 'Progress Reports',
    navSettings: 'App Settings',

    momentumTitle: 'Progress Dashboard',
    momentumSubtitle: 'Your daily focus, energy rhythm, and goal velocity.',
    cognitiveSyncTitle: 'Focus Rhythm',
    activeTrajectoryTitle: 'Current Priority Goal',
    stellarTimelineTitle: 'Activity Timeline',
    quickAddTask: 'Add New Task',

    orbitTitle: 'Daily To-Do List',
    orbitSubtitle: 'Organize and complete your tasks for today.',
    subOrbits: 'Subtasks',
    voidProtocolTitle: 'Habits to Avoid',
    voidProtocolSubtitle: 'Your distraction blocker and mindful boundaries.',
    addVoid: 'Add Habit to Avoid',
    trajectorySelector: 'Associated Goal',

    nebulaTitle: 'Goals & Ambitions',
    nebulaSubtitle: 'Break down your big ambitions into clear milestones.',
    milestonesTitle: 'Key Milestones',
    ambitionNew: 'Create New Goal',

    skillsTitle: 'Skills Matrix',
    skillsSubtitle: 'Your strengths, proficiencies, and learning paths.',
    brightStars: 'Top Strengths',

    horizonTitle: 'Performance Insights',
    horizonSubtitle: 'Weekly trends, deep work hours, and recovery rhythms.',
    gravityWells: 'Challenging Days',
    cryosleepRest: 'Rest & Recharge Days',

    settingsTitle: 'App Settings',
    pilotProfile: 'User Profile',
    neuralLinkTitle: 'Cloud Backup & Sync',
    neuralLinkSubtitle: 'Keep your data securely synced across your phone and computers.',
    systemManifestTitle: 'App Information',
    vocabularyModeTitle: 'Language & Terminology',
    vocabularyModeDesc: 'Choose how Space-Clocker speaks to you: original space-themed lore or clear everyday words.',
    originalModeLabel: 'Original Mode (Space-Themed)',
    originalModeDesc: 'Full sci-fi experience: Nebulae, Orbits, Void Protocol & Chronos Core.',
    peopleModeLabel: 'People Mode (Clear & Friendly)',
    peopleModeDesc: 'Everyday productivity language: Goals, Tasks, Habits to Avoid & Cloud Sync.'
  }
};

export const getStoredVocabularyMode = (): VocabularyMode => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
    try {
      const stored = localStorage.getItem('spaceclocker_vocabulary_mode');
      if (stored === 'people' || stored === 'original') {
        return stored;
      }
    } catch {
      // Ignore
    }
  }
  return 'original';
};

export const useVocabulary = () => {
  const store = useTrackStore();
  const rawMode = store.preferences?.vocabularyMode;
  const mode: VocabularyMode = (rawMode === 'people' || rawMode === 'original') 
    ? rawMode 
    : getStoredVocabularyMode();

  const setVocabularyMode = (newMode: VocabularyMode) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
      try {
        localStorage.setItem('spaceclocker_vocabulary_mode', newMode);
      } catch {
        // Ignore
      }
    }
    store.updatePreferences({ vocabularyMode: newMode });
  };

  const toggleVocabularyMode = () => {
    setVocabularyMode(mode === 'people' ? 'original' : 'people');
  };

  const t = (key: keyof VocabularyTerms): string => {
    return VOCABULARY_DICTIONARY[mode]?.[key] ?? VOCABULARY_DICTIONARY.original[key] ?? key;
  };

  return {
    mode,
    isPeopleMode: mode === 'people',
    isOriginalMode: mode === 'original',
    setVocabularyMode,
    toggleVocabularyMode,
    t,
    terms: VOCABULARY_DICTIONARY[mode]
  };
};
