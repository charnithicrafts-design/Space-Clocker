export type Archetype = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  vibe: string;
  data: any;
};

const getToday = () => new Date().toISOString().split('T')[0];

const generateHistoricalTasks = (
  archetypeId: string, 
  ambitionId: string, 
  templates: string[], 
  count: number = 150
) => {
  const tasks = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180) + 1;
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    const dateString = date.toISOString().split('T')[0];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const hour = Math.floor(Math.random() * 14) + 6;
    const timeString = `${hour.toString().padStart(2, '0')}:00`;

    tasks.push({
      id: `hist-${archetypeId}-${i}`,
      title: template,
      completed: true,
      horizon: "daily",
      plannedDate: dateString,
      time: timeString,
      ambitionId: ambitionId
    });
  }
  
  return tasks.sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());
};

import { mastermindArchetypes } from './archetypes/index';

export const curatedArchetypes: Archetype[] = [
  ...mastermindArchetypes,
  {
    id: "mca-student",
    icon: "🚀",
    title: "The Data Artisan (MCA)",
    subtitle: "Construct your trajectory to a Tier-1 Tech Company.",
    vibe: "Aspiring AWS Specialist and Data Analyst. Driven by a genuine ambition to break into the industry.",
    data: {
      profile: {
        name: "Nithya Dharshini",
        level: 12,
        xp: 15400,
        title: "Data Artisan"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 14,
        tasksCompleted: 342,
        totalFocusHours: 420
      },
      ambitions: [
        {
          id: "amb-mca-1",
          title: "Master Cloud Architecture & AWS Specialization (1 Year Horizon)",
          progress: 65,
          xp: 4500,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-mca-1", title: "Attain AWS Solutions Architect Associate", status: "completed", tasks: [] },
            { id: "ms-mca-2", title: "Deploy high-availability MERN stack to Kubernetes", status: "completed", tasks: [] },
            { id: "ms-mca-3", title: "Construct Multi-Region Disaster Recovery Demo", status: "pending", tasks: [] },
            { id: "ms-mca-4", title: "Attain AWS Solutions Architect Professional", status: "pending", tasks: [] }
          ]
        },
        {
          id: "amb-mca-2",
          title: "Crack Tier-1 Tech Product Company (2 Year Horizon)",
          progress: 30,
          xp: 2500,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-mca-5", title: "Complete 300 LeetCode Medium/Hard Patterns", status: "completed", tasks: [] },
            { id: "ms-mca-6", title: "Lead Open Source Microservices Project", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("mca-student", "amb-mca-1", [
          "Review AWS EC2 Autoscaling Docs",
          "Solve 2 LeetCode Mediums (Trees)",
          "Debug Kubernetes Pod CrashLoopBackOff",
          "Watch 1hr System Design Interview (Gaurav Sen)",
          "Write MongoDB Aggregation Pipeline",
          "Refactor Node.js Auth Middleware",
          "Mock Interview: Distributed Caching",
          "Read 'Designing Data-Intensive Applications' Ch. 3",
          "Optimize React Rendering Performance",
          "Implement JWT Refresh Tokens"
        ], 342),
        { id: "task-mca-1", title: "System Design Mock Interview with Mentor", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:00", ambitionId: "amb-mca-2" },
        { id: "task-mca-2", title: "Implement Rate Limiting using Redis for Side-Project", completed: false, horizon: "daily", plannedDate: getToday(), time: "11:00", ambitionId: "amb-mca-1" },
        { id: "task-mca-3", title: "Solve 3 Dynamic Programming problems (Stasis Backlog)", completed: false, horizon: "daily", plannedDate: getToday(), time: "18:00", ambitionId: "amb-mca-2" }
      ],
      voids: [
        { id: "void-mca-1", text: "Mindless YouTube 'Day in the Life' binge", impact: "high", engagedCount: 0, maxAllowed: 0 },
        { id: "void-mca-2", text: "Tutorial Hell (Watching without building)", impact: "high", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "philosopher",
    icon: "🏛️",
    title: "The Scholar of Solitude",
    subtitle: "Construct your Bollingen Tower.",
    vibe: "Deep, uncompromising focus. Pursuing a post-doctoral fellowship in Phenomenology.",
    data: {
      profile: {
        name: "Dr. Arthur",
        level: 24,
        xp: 42000,
        title: "Scholar of Solitude"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'void'
      },
      stats: {
        streak: 112,
        tasksCompleted: 1045,
        totalFocusHours: 1820
      },
      ambitions: [
        {
          id: "amb-phil-1",
          title: "Construct The Bollingen Tower (3 Year Magnum Opus)",
          progress: 80,
          xp: 15000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-phil-1", title: "Distill Core Archetypal Thesis", status: "completed", tasks: [] },
            { id: "ms-phil-2", title: "Complete 5-year hermeneutic literature review", status: "completed", tasks: [] },
            { id: "ms-phil-3", title: "Draft Volume 1: The Descent", status: "completed", tasks: [] },
            { id: "ms-phil-4", title: "Draft Volume 2: The Synthesis", status: "pending", tasks: [] }
          ]
        },
        {
          id: "amb-phil-2",
          title: "Establish Absolute Mental Synchronization (6 Month Horizon)",
          progress: 50,
          xp: 3000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-phil-5", title: "Eliminate all algorithmic dopamine sources", status: "completed", tasks: [] },
            { id: "ms-phil-6", title: "Maintain 4-hour daily deep work ritual for 90 days", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("philosopher", "amb-phil-1", [
          "Draft 1000 words on Jungian Shadows",
          "Read Nietzsche's Beyond Good & Evil (2 hours)",
          "Meditate on the concept of 'Amor Fati'",
          "Review hermeneutic literature (1980-1990)",
          "Revise Chapter 3: The Collective Unconscious",
          "Analyze dream journal entries for recurring motifs",
          "Write critique of modern existentialism",
          "Nature walk: Active Imagination exercise"
        ], 1045),
        { id: "task-phil-1", title: "4 Hours Uninterrupted Contemplation (No WiFi)", completed: false, horizon: "daily", plannedDate: getToday(), time: "05:00", ambitionId: "amb-phil-2" },
        { id: "task-phil-2", title: "Drafting Chapter 12: The Shadow Integration", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:00", ambitionId: "amb-phil-1" }
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
    vibe: "Extreme discipline and synergy of mind/body. Aerospace engineer and astronaut candidate.",
    data: {
      profile: {
        name: "Capt. Sarah",
        level: 35,
        xp: 85000,
        title: "Apex Pilot"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 242,
        tasksCompleted: 3210,
        totalFocusHours: 4350
      },
      ambitions: [
        {
          id: "amb-astro-1",
          title: "Selection for Artemis Lunar Mission (2 Year Horizon)",
          progress: 90,
          xp: 25000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-astro-1", title: "Master Orbital Rendezvous Simulation", status: "completed", tasks: [] },
            { id: "ms-astro-2", title: "Pass High-G Centrifuge Qualification", status: "completed", tasks: [] },
            { id: "ms-astro-3", title: "Complete Neutral Buoyancy EVA Training", status: "pending", tasks: [] },
            { id: "ms-astro-4", title: "Final Command Module Systems Exam", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("astronaut", "amb-astro-1", [
          "1hr High-G Centrifuge Acclimatization",
          "Review Command Module Schematics",
          "3hr Russian Language Immersion",
          "Neutral Buoyancy Lab: Payload Deployment",
          "Cardio Interval Training (V02 Max focus)",
          "Simulate Orbital Rendezvous Failure Scenario",
          "Spacecraft Systems Cross-training (Life Support)",
          "Astronavigation & Star Tracking Drill"
        ], 3210),
        { id: "task-astro-1", title: "4-Hour Neutral Buoyancy Lab Simulation", completed: false, horizon: "daily", plannedDate: getToday(), time: "06:00", ambitionId: "amb-astro-1" },
        { id: "task-astro-2", title: "Review Command Module Diagnostics Telemetry", completed: false, horizon: "daily", plannedDate: getToday(), time: "14:00", ambitionId: "amb-astro-1" },
        { id: "task-astro-3", title: "2hr Cardiovascular Capacity Training", completed: false, horizon: "daily", plannedDate: getToday(), time: "16:00", ambitionId: "amb-astro-1" }
      ],
      voids: [
        { id: "void-astro-1", text: "Neglecting Bio-Rhythms / Sleep Architecture", impact: "high", engagedCount: 0, maxAllowed: 0 },
        { id: "void-astro-2", text: "Micro-managing ground control engineers", impact: "medium", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "space-scientist",
    icon: "🔭",
    title: "The Cosmic Decoder",
    subtitle: "Secure JWST Observation Time.",
    vibe: "Analytical, patient, methodical. Post-doc astrophysicist hunting for exoplanetary bio-signatures.",
    data: {
      profile: {
        name: "Dr. Aris",
        level: 21,
        xp: 35200,
        title: "Cosmic Decoder"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 58,
        tasksCompleted: 885,
        totalFocusHours: 1190
      },
      ambitions: [
        {
          id: "amb-sci-1",
          title: "Publish Exoplanet Findings in Nature (1 Year Horizon)",
          progress: 60,
          xp: 12200,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-sci-1", title: "Secure JWST Observation Time", status: "completed", tasks: [] },
            { id: "ms-sci-2", title: "Collect and clean raw spectroscopic data", status: "completed", tasks: [] },
            { id: "ms-sci-3", title: "Analyze atmospheric bio-signatures", status: "pending", tasks: [] },
            { id: "ms-sci-4", title: "Draft NSF Grant Proposal for Phase 2", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("space-scientist", "amb-sci-1", [
          "Calibrate JWST Spectrometer Data",
          "Run Atmospheric Model Simulations (Python)",
          "Draft methods section for Nature paper",
          "Review grant proposal peer feedback",
          "Analyze K2-18b transit light curves",
          "Meet with Post-docs regarding spectral anomalies",
          "Write data reduction pipeline script",
          "Literature Review: Exoplanet Habitability"
        ], 885),
        { id: "task-sci-1", title: "Run Python Spectral Analysis pipeline on Sector 4 data", completed: false, horizon: "daily", plannedDate: getToday(), time: "09:30", ambitionId: "amb-sci-1" },
        { id: "task-sci-2", title: "Literature Review: Atmospheric Signatures of K2-18b", completed: false, horizon: "daily", plannedDate: getToday(), time: "13:00", ambitionId: "amb-sci-1" },
        { id: "task-sci-3", title: "Meeting with co-authors to finalize methodology", completed: false, horizon: "daily", plannedDate: getToday(), time: "15:00", ambitionId: "amb-sci-1" }
      ],
      voids: [
        { id: "void-sci-1", text: "Over-optimizing Python scripts instead of writing", impact: "medium", engagedCount: 0, maxAllowed: 1 },
        { id: "void-sci-2", text: "Failing to back up raw data", impact: "high", engagedCount: 0, maxAllowed: 0 }
      ]
    }
  },
  {
    id: "professor",
    icon: "🎓",
    title: "The Stellar Mentor",
    subtitle: "Cultivate the next generation.",
    vibe: "Wisdom, legacy, and balancing heavy workloads. Tenured academic researcher managing a busy lab.",
    data: {
      profile: {
        name: "Prof. Elena",
        level: 28,
        xp: 56100,
        title: "Stellar Mentor"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 95,
        tasksCompleted: 2140,
        totalFocusHours: 2585
      },
      ambitions: [
        {
          id: "amb-prof-1",
          title: "Achieve Tenure & Cultivate Post-Docs (3 Year Horizon)",
          progress: 85,
          xp: 24000,
          horizon: "yearly",
          linkedSkills: [],
          milestones: [
            { id: "ms-prof-1", title: "Secure $2M Department Funding Grant", status: "completed", tasks: [] },
            { id: "ms-prof-2", title: "Design Advanced Cosmology Curriculum", status: "completed", tasks: [] },
            { id: "ms-prof-3", title: "Chair the International Astrophysics Symposium", status: "pending", tasks: [] },
            { id: "ms-prof-4", title: "Lead 3 PhD Candidates to successful defenses", status: "pending", tasks: [] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("professor", "amb-prof-1", [
          "Grade Advanced Cosmology midterms",
          "Review PhD Candidate's Draft Thesis",
          "Faculty meeting: Departmental Budget",
          "Draft Keynote Speech for Symposium",
          "Write Letter of Recommendation for Post-Doc",
          "Peer Review: Astrophysical Journal submission",
          "Update Cosmology 401 Syllabus",
          "Meet with NSF Grant Committee"
        ], 2140),
        { id: "task-prof-1", title: "Peer Review Nature Submission (Dr. Aris's paper)", completed: false, horizon: "daily", plannedDate: getToday(), time: "10:00", ambitionId: "amb-prof-1" },
        { id: "task-prof-2", title: "Mentor Meeting with PhD Candidates (Thesis Defense Prep)", completed: false, horizon: "daily", plannedDate: getToday(), time: "13:30", ambitionId: "amb-prof-1" },
        { id: "task-prof-3", title: "Drafting the Keynote for the Astrophysics Symposium", completed: false, horizon: "daily", plannedDate: getToday(), time: "16:00", ambitionId: "amb-prof-1" }
      ],
      voids: [
        { id: "void-prof-1", text: "Engaging in Departmental Politics", impact: "high", engagedCount: 0, maxAllowed: 0 },
        { id: "void-prof-2", text: "Endless Administrative Email Chains", impact: "medium", engagedCount: 0, maxAllowed: 2 }
      ]
    }
  }
];
