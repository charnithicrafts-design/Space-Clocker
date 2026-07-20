export type Archetype = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  vibe: string;
  data: any;
};

const getToday = () => new Date().toISOString().split('T')[0];

export const curatedArchetypes: Archetype[] = [
  {
    id: "mca-student",
    icon: "🚀",
    title: "The Galactic Voyager",
    subtitle: "Construct your trajectory to ISRO/NASA.",
    vibe: "Unbridled curiosity and raw potential.",
    data: {
      profile: {
        name: "Valentina",
        level: 1,
        xp: 0,
        title: "Galactic Voyager"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 0,
        tasksCompleted: 0,
        totalFocusHours: 0
      },
      ambitions: [
        {
          id: "amb-mca-1",
          title: "Lead Scientist at ISRO/NASA by 2027",
          progress: 5,
          xp: 250,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-mca-1", title: "Complete MCA with Distinction", status: "pending", tasks: [] },
            { id: "ms-mca-2", title: "Publish research on Orbital Mechanics", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        { id: "task-mca-1", title: "Implement 3 Quantum Gates", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:00", ambitionId: "amb-mca-1" },
        { id: "task-mca-2", title: "Read 10 pages of Astrodynamics", completed: false, horizon: "daily", plannedDate: getToday(), time: "11:00", ambitionId: "amb-mca-1" }
      ],
      voids: [
        { id: "void-mca-1", text: "Doomscrolling Space News", impact: "high", engagedCount: 0, maxAllowed: 2 },
        { id: "void-mca-2", text: "Endless Tutorial Hell", impact: "medium", engagedCount: 0, maxAllowed: 1 }
      ]
    }
  },
  {
    id: "philosopher",
    icon: "🏛️",
    title: "The Architect of Solitude",
    subtitle: "Construct your Bollingen Tower.",
    vibe: "Deep, uncompromising focus.",
    data: {
      profile: {
        name: "Carl",
        level: 4,
        xp: 3200,
        title: "Architect of Solitude"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'void'
      },
      stats: {
        streak: 12,
        tasksCompleted: 45,
        totalFocusHours: 120
      },
      ambitions: [
        {
          id: "amb-phil-1",
          title: "Construct The Bollingen Tower",
          progress: 15,
          xp: 1500,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-phil-1", title: "Distill Core Archetypal Thesis", status: "pending", tasks: [] },
            { id: "ms-phil-2", title: "Establish 4-hour daily deep work ritual", status: "completed", tasks: [] }
          ]
        }
      ],
      tasks: [
        { id: "task-phil-1", title: "3 Hours Uninterrupted Contemplation", completed: false, horizon: "daily", plannedDate: getToday(), time: "05:00", ambitionId: "amb-phil-1" },
        { id: "task-phil-2", title: "Manuscript Drafting: Chapter 4", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:00", ambitionId: "amb-phil-1" }
      ],
      voids: [
        { id: "void-phil-1", text: "Superficial Social Engagements", impact: "high", engagedCount: 0, maxAllowed: 0 },
        { id: "void-phil-2", text: "Reacting to the 24-hour News Cycle", impact: "high", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "astronaut",
    icon: "👨‍🚀",
    title: "The Apex Pilot",
    subtitle: "Prepare for the Artemis Lunar Mission.",
    vibe: "Extreme discipline and synergy of mind/body.",
    data: {
      profile: {
        name: "Commander",
        level: 10,
        xp: 8500,
        title: "Apex Pilot"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 42,
        tasksCompleted: 210,
        totalFocusHours: 350
      },
      ambitions: [
        {
          id: "amb-astro-1",
          title: "Selection for Artemis Lunar Mission",
          progress: 60,
          xp: 5000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-astro-1", title: "Pass High-G Centrifuge Qualification", status: "pending", tasks: [] },
            { id: "ms-astro-2", title: "Master Orbital Rendezvous Simulation", status: "completed", tasks: [] }
          ]
        }
      ],
      tasks: [
        { id: "task-astro-1", title: "2hr Cardiovascular Capacity Training", completed: false, horizon: "daily", plannedDate: getToday(), time: "06:00", ambitionId: "amb-astro-1" },
        { id: "task-astro-2", title: "Review Command Module Diagnostics", completed: false, horizon: "daily", plannedDate: getToday(), time: "14:00", ambitionId: "amb-astro-1" }
      ],
      voids: [
        { id: "void-astro-1", text: "Neglecting Bio-Rhythms", impact: "high", engagedCount: 0, maxAllowed: 0 },
        { id: "void-astro-2", text: "Compromising Sleep Architecture", impact: "high", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "space-scientist",
    icon: "🔭",
    title: "The Cosmic Decoder",
    subtitle: "Secure JWST Observation Time.",
    vibe: "Analytical, patient, methodical.",
    data: {
      profile: {
        name: "Dr. Aris",
        level: 7,
        xp: 5200,
        title: "Cosmic Decoder"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 18,
        tasksCompleted: 85,
        totalFocusHours: 190
      },
      ambitions: [
        {
          id: "amb-sci-1",
          title: "Publish Exoplanet Findings in Nature",
          progress: 30,
          xp: 2200,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-sci-1", title: "Draft NSF Grant Proposal", status: "pending", tasks: [] },
            { id: "ms-sci-2", title: "Analyze JWST Spectroscopic Data", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        { id: "task-sci-1", title: "Run Python Spectral Analysis", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:30", ambitionId: "amb-sci-1" },
        { id: "task-sci-2", title: "Literature Review: Atmospheric Signatures", completed: false, horizon: "daily", plannedDate: getToday(), time: "15:00", ambitionId: "amb-sci-1" }
      ],
      voids: [
        { id: "void-sci-1", text: "Over-optimizing scripts instead of writing", impact: "medium", engagedCount: 0, maxAllowed: 1 },
        { id: "void-sci-2", text: "Failing to back up raw data", impact: "high", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "professor",
    icon: "🎓",
    title: "The Stellar Mentor",
    subtitle: "Cultivate the next generation.",
    vibe: "Wisdom, legacy, and balancing heavy workloads.",
    data: {
      profile: {
        name: "Prof. Aldrin",
        level: 8,
        xp: 6100,
        title: "Stellar Mentor"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 5,
        tasksCompleted: 140,
        totalFocusHours: 85
      },
      ambitions: [
        {
          id: "amb-prof-1",
          title: "Achieve Tenure & Cultivate Post-Docs",
          progress: 75,
          xp: 4000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-prof-1", title: "Design Advanced Cosmology Curriculum", status: "pending", tasks: [] },
            { id: "ms-prof-2", title: "Secure Department Funding", status: "completed", tasks: [] }
          ]
        }
      ],
      tasks: [
        { id: "task-prof-1", title: "Peer Review Nature Submission", completed: false, horizon: "daily", plannedDate: getToday(), time: "10:00", ambitionId: "amb-prof-1" },
        { id: "task-prof-2", title: "Mentor Meeting with PhD Candidates", completed: false, horizon: "daily", plannedDate: getToday(), time: "13:30", ambitionId: "amb-prof-1" }
      ],
      voids: [
        { id: "void-prof-1", text: "Engaging in Departmental Politics", impact: "high", engagedCount: 0, maxAllowed: 1 },
        { id: "void-prof-2", text: "Endless Administrative Email Chains", impact: "medium", engagedCount: 0, maxAllowed: 2 }
      ]
    }
  }
];
