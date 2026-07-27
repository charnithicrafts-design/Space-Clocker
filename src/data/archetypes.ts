export type Archetype = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  vibe: string;
  data: any;
  voids?: any[];
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
            { id: "ms-mca-1", title: "Attain AWS Solutions Architect Associate", status: "completed", tasks: [
                      {
                        "id": "task-mca-1-1",
                        "title": "Complete Stephen Maarek's AWS course sections 1-5",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-mca-1-2",
                        "title": "Take 3 practice exams on TutorialsDojo",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-mca-1-3",
                        "title": "Schedule and pass the final certification exam",
                        "completed": true,
                        "weightage": 20,
                        "time": 120
                      }
                    ] },
            { id: "ms-mca-2", title: "Deploy high-availability MERN stack to Kubernetes", status: "completed", tasks: [
                      {
                        "id": "task-mca-2-1",
                        "title": "Containerize React frontend and Node backend with Docker",
                        "completed": true,
                        "weightage": 10,
                        "time": 90
                      },
                      {
                        "id": "task-mca-2-2",
                        "title": "Write Kubernetes deployment and service YAML manifests",
                        "completed": true,
                        "weightage": 10,
                        "time": 90
                      },
                      {
                        "id": "task-mca-2-3",
                        "title": "Configure Ingress controller and TLS certificates",
                        "completed": true,
                        "weightage": 10,
                        "time": 60
                      }
                    ] },
            { id: "ms-mca-3", title: "Construct Multi-Region Disaster Recovery Demo", status: "pending", tasks: [
                      {
                        "id": "task-mca-3-1",
                        "title": "Set up cross-region replication for DynamoDB",
                        "completed": false,
                        "weightage": 10,
                        "time": 60
                      },
                      {
                        "id": "task-mca-3-2",
                        "title": "Configure Route 53 health checks and failover routing",
                        "completed": false,
                        "weightage": 10,
                        "time": 90
                      },
                      {
                        "id": "task-mca-3-3",
                        "title": "Test and document RTO and RPO metrics during simulated failure",
                        "completed": false,
                        "weightage": 20,
                        "time": 120
                      }
                    ] },
            { id: "ms-mca-4", title: "Attain AWS Solutions Architect Professional", status: "pending", tasks: [
                      {
                        "id": "task-mca-4-1",
                        "title": "Deep dive into AWS Organizations and SCPs",
                        "completed": false,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-mca-4-2",
                        "title": "Master advanced networking: Transit Gateway and Direct Connect",
                        "completed": false,
                        "weightage": 15,
                        "time": 180
                      },
                      {
                        "id": "task-mca-4-3",
                        "title": "Complete the 3-hour Professional practice exam",
                        "completed": false,
                        "weightage": 20,
                        "time": 180
                      }
                    ] }
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
        { id: "void-mca-1", text: "Mindless YouTube 'Day in the Life' binge", impact: "high", engagedCount: 0, maxAllowed: 3 },
        { id: "void-mca-2", text: "Tutorial Hell (Watching without building)", impact: "high", engagedCount: 0, maxAllowed: 3 }
      ],
        history: [
              {
                "id": "hist-2024-1",
                "title": "Full Stack Development Internship - Tech Mahindra",
                "date": "2024-06-01",
                "type": "success",
                "category": "internship",
                "description": "Foundational industry experience in software engineering and cloud deployment.",
                "skills": [
                  "Full Stack",
                  "React",
                  "Node.js"
                ]
              },
              {
                "id": "hist-2024-2",
                "title": "India AI Contest - Winner",
                "date": "2024-08-23",
                "type": "success",
                "category": "hackathon",
                "description": "Generative AI model for predictive healthcare analytics using Python.",
                "skills": [
                  "Python",
                  "Generative AI",
                  "Data Science"
                ]
              },
              {
                "id": "hist-2025-1",
                "title": "AWS Certified Cloud Practitioner",
                "date": "2025-02-15",
                "type": "success",
                "category": "certification",
                "description": "Validated foundational understanding of AWS Cloud services and architecture.",
                "skills": [
                  "AWS",
                  "Cloud Computing"
                ]
              }
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
            { id: "ms-phil-1", title: "Distill Core Archetypal Thesis", status: "completed", tasks: [
                      {
                        "id": "task-phil-1-1",
                        "title": "Re-read Jung's Red Book focusing on the shadow archetype",
                        "completed": true,
                        "weightage": 10,
                        "time": 240
                      },
                      {
                        "id": "task-phil-1-2",
                        "title": "Draft the foundational thesis statement and core arguments",
                        "completed": true,
                        "weightage": 15,
                        "time": 180
                      },
                      {
                        "id": "task-phil-1-3",
                        "title": "Present thesis outline to the fellowship committee for review",
                        "completed": true,
                        "weightage": 10,
                        "time": 60
                      }
                    ] },
            { id: "ms-phil-2", title: "Complete 5-year hermeneutic literature review", status: "completed", tasks: [
                      {
                        "id": "task-phil-2-1",
                        "title": "Categorize 150 primary phenomenological texts",
                        "completed": true,
                        "weightage": 20,
                        "time": 300
                      },
                      {
                        "id": "task-phil-2-2",
                        "title": "Synthesize Heideggerian concepts of Dasein with modern existentialism",
                        "completed": true,
                        "weightage": 15,
                        "time": 240
                      },
                      {
                        "id": "task-phil-2-3",
                        "title": "Finalize the 50-page literature review manuscript",
                        "completed": true,
                        "weightage": 15,
                        "time": 300
                      }
                    ] },
            { id: "ms-phil-3", title: "Draft Volume 1: The Descent", status: "completed", tasks: [
                      {
                        "id": "task-phil-3-1",
                        "title": "Write Chapter 1: The Fragmentation of Modern Meaning",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-phil-3-2",
                        "title": "Write Chapter 2: Historical Precedents of Nihilism",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-phil-3-3",
                        "title": "Edit and refine the first 10,000 words",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      }
                    ] },
            { id: "ms-phil-4", title: "Draft Volume 2: The Synthesis", status: "pending", tasks: [
                      {
                        "id": "task-phil-4-1",
                        "title": "Outline the integration phase and cognitive rebirth",
                        "completed": false,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-phil-4-2",
                        "title": "Draft the concluding arguments on meaning-making",
                        "completed": false,
                        "weightage": 15,
                        "time": 180
                      },
                      {
                        "id": "task-phil-4-3",
                        "title": "Submit Volume 2 to the peer-review board",
                        "completed": false,
                        "weightage": 10,
                        "time": 30
                      }
                    ] }
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
            { id: "ms-phil-5", title: "Eliminate all algorithmic dopamine sources", status: "completed", tasks: [
                      {
                        "id": "task-phil-5-1",
                        "title": "Delete all social media applications from mobile devices",
                        "completed": true,
                        "weightage": 5,
                        "time": 15
                      },
                      {
                        "id": "task-phil-5-2",
                        "title": "Install website blockers for news and entertainment sites",
                        "completed": true,
                        "weightage": 5,
                        "time": 30
                      },
                      {
                        "id": "task-phil-5-3",
                        "title": "Replace evening scrolling with contemplative reading",
                        "completed": true,
                        "weightage": 10,
                        "time": 60
                      }
                    ] },
            { id: "ms-phil-6", title: "Maintain 4-hour daily deep work ritual for 90 days", status: "pending", tasks: [
                      {
                        "id": "task-phil-6-1",
                        "title": "Establish the morning isolation protocol (no internet until noon)",
                        "completed": false,
                        "weightage": 10,
                        "time": 60
                      },
                      {
                        "id": "task-phil-6-2",
                        "title": "Track deep work blocks using the physical ledger",
                        "completed": false,
                        "weightage": 5,
                        "time": 15
                      },
                      {
                        "id": "task-phil-6-3",
                        "title": "Complete the 90-day uninterrupted streak",
                        "completed": false,
                        "weightage": 20,
                        "time": 0
                      }
                    ] }
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
        { id: "void-phil-1", text: "Superficial Social Engagements", impact: "high", engagedCount: 0, maxAllowed: 3 },
        { id: "void-phil-2", text: "Reacting to the 24-hour News Cycle", impact: "high", engagedCount: 0, maxAllowed: 3 }
      ],
        history: [
              {
                "id": "hist-phil-1",
                "title": "Published First Peer-Reviewed Essay",
                "date": "2023-10-14",
                "type": "success",
                "category": "publication",
                "description": "A 20-page exploration of existential phenomenology in modern digital spaces.",
                "skills": [
                  "Writing",
                  "Phenomenology",
                  "Research"
                ]
              },
              {
                "id": "hist-phil-2",
                "title": "Completed 10-Day Vipassana Retreat",
                "date": "2024-03-01",
                "type": "success",
                "category": "wellness",
                "description": "Total silence and deep meditation, solidifying the capacity for uninterrupted focus.",
                "skills": [
                  "Focus",
                  "Mindfulness",
                  "Resilience"
                ]
              },
              {
                "id": "hist-phil-3",
                "title": "Rejected by Major Publishing House",
                "date": "2024-11-12",
                "type": "failure",
                "category": "career",
                "description": "First draft of the Magnum Opus was deemed 'too esoteric'. Used the feedback to rebuild the arguments stronger.",
                "skills": [
                  "Resilience",
                  "Editing"
                ]
              }
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
            { id: "ms-astro-1", title: "Master Orbital Rendezvous Simulation", status: "completed", tasks: [
                      {
                        "id": "task-astro-1-1",
                        "title": "Complete 50 hours in the VR docking simulator",
                        "completed": true,
                        "weightage": 10,
                        "time": 3000
                      },
                      {
                        "id": "task-astro-1-2",
                        "title": "Master manual override protocols for thruster failure",
                        "completed": true,
                        "weightage": 15,
                        "time": 120
                      },
                      {
                        "id": "task-astro-1-3",
                        "title": "Pass the final instructor-led rendezvous evaluation",
                        "completed": true,
                        "weightage": 20,
                        "time": 180
                      }
                    ] },
            { id: "ms-astro-2", title: "Pass High-G Centrifuge Qualification", status: "completed", tasks: [
                      {
                        "id": "task-astro-2-1",
                        "title": "Begin customized cardiovascular stress conditioning",
                        "completed": true,
                        "weightage": 10,
                        "time": 60
                      },
                      {
                        "id": "task-astro-2-2",
                        "title": "Complete the 6G sustained centrifuge profile",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-astro-2-3",
                        "title": "Complete the 9G peak centrifuge profile without LOC",
                        "completed": true,
                        "weightage": 20,
                        "time": 120
                      }
                    ] },
            { id: "ms-astro-3", title: "Complete Neutral Buoyancy EVA Training", status: "pending", tasks: [
                      {
                        "id": "task-astro-3-1",
                        "title": "Familiarize with the new xEMU suit mobility",
                        "completed": false,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-astro-3-2",
                        "title": "Execute the 6-hour underwater lunar habitat assembly simulation",
                        "completed": false,
                        "weightage": 15,
                        "time": 360
                      },
                      {
                        "id": "task-astro-3-3",
                        "title": "Pass the emergency suit depressurization drill",
                        "completed": false,
                        "weightage": 10,
                        "time": 120
                      }
                    ] },
            { id: "ms-astro-4", title: "Final Command Module Systems Exam", status: "pending", tasks: [
                      {
                        "id": "task-astro-4-1",
                        "title": "Memorize all 1,200 emergency abort codes",
                        "completed": false,
                        "weightage": 15,
                        "time": 240
                      },
                      {
                        "id": "task-astro-4-2",
                        "title": "Simulate life support systems failure troubleshooting",
                        "completed": false,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-astro-4-3",
                        "title": "Ace the written and practical command module exam",
                        "completed": false,
                        "weightage": 20,
                        "time": 240
                      }
                    ] }
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
        { id: "void-astro-1", text: "Neglecting Bio-Rhythms / Sleep Architecture", impact: "high", engagedCount: 0, maxAllowed: 3 },
        { id: "void-astro-2", text: "Micro-managing ground control engineers", impact: "medium", engagedCount: 0, maxAllowed: 3 }
      ],
        history: [
              {
                "id": "hist-astro-1",
                "title": "Selected for NASA Astronaut Candidate Class",
                "date": "2022-01-10",
                "type": "success",
                "category": "career",
                "description": "Chosen from over 12,000 applicants to join the elite training program.",
                "skills": [
                  "Leadership",
                  "Physical Fitness",
                  "STEM"
                ]
              },
              {
                "id": "hist-astro-2",
                "title": "Survived Winter Survival Training",
                "date": "2023-02-15",
                "type": "success",
                "category": "training",
                "description": "Endured 72 hours in extreme cold weather environments to build team cohesion and survival skills.",
                "skills": [
                  "Survival",
                  "Teamwork",
                  "Resilience"
                ]
              },
              {
                "id": "hist-astro-3",
                "title": "Failed Initial Centrifuge Spin Test",
                "date": "2023-06-20",
                "type": "failure",
                "category": "training",
                "description": "Lost consciousness at 7Gs. Required intense cardiovascular re-conditioning before passing on the second attempt.",
                "skills": [
                  "Physical Endurance",
                  "G-Force Tolerance"
                ]
              }
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
            { id: "ms-sci-1", title: "Secure JWST Observation Time", status: "completed", tasks: [
                      {
                        "id": "task-sci-1-1",
                        "title": "Draft the scientific justification for K2-18b observation",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-sci-1-2",
                        "title": "Perform feasibility calculations for the required exposure time",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-sci-1-3",
                        "title": "Submit the finalized proposal to the allocation committee",
                        "completed": true,
                        "weightage": 10,
                        "time": 30
                      }
                    ] },
            { id: "ms-sci-2", title: "Collect and clean raw spectroscopic data", status: "completed", tasks: [
                      {
                        "id": "task-sci-2-1",
                        "title": "Download the raw telemetry from the deep space network",
                        "completed": true,
                        "weightage": 5,
                        "time": 60
                      },
                      {
                        "id": "task-sci-2-2",
                        "title": "Run the cosmic ray rejection algorithms",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-sci-2-3",
                        "title": "Calibrate the spectra using the host star's baseline",
                        "completed": true,
                        "weightage": 15,
                        "time": 180
                      }
                    ] },
            { id: "ms-sci-3", title: "Analyze atmospheric bio-signatures", status: "pending", tasks: [
                      {
                        "id": "task-sci-3-1",
                        "title": "Fit atmospheric models to the transmission spectrum",
                        "completed": false,
                        "weightage": 15,
                        "time": 240
                      },
                      {
                        "id": "task-sci-3-2",
                        "title": "Calculate the statistical significance of the methane detection",
                        "completed": false,
                        "weightage": 15,
                        "time": 120
                      },
                      {
                        "id": "task-sci-3-3",
                        "title": "Rule out false positives from stellar activity",
                        "completed": false,
                        "weightage": 10,
                        "time": 120
                      }
                    ] },
            { id: "ms-sci-4", title: "Draft NSF Grant Proposal for Phase 2", status: "pending", tasks: [
                      {
                        "id": "task-sci-4-1",
                        "title": "Outline the proposed multi-planet survey methodology",
                        "completed": false,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-sci-4-2",
                        "title": "Draft the budget narrative for postdoctoral support",
                        "completed": false,
                        "weightage": 10,
                        "time": 90
                      },
                      {
                        "id": "task-sci-4-3",
                        "title": "Submit the proposal before the Q3 deadline",
                        "completed": false,
                        "weightage": 10,
                        "time": 30
                      }
                    ] }
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
        { id: "void-sci-2", text: "Failing to back up raw data", impact: "high", engagedCount: 0, maxAllowed: 3 }
      ],
        history: [
              {
                "id": "hist-sci-1",
                "title": "First Co-Author Publication in Nature",
                "date": "2023-09-05",
                "type": "success",
                "category": "publication",
                "description": "Groundbreaking paper on atmospheric modeling of gas giants.",
                "skills": [
                  "Astrophysics",
                  "Data Analysis",
                  "Academic Writing"
                ]
              },
              {
                "id": "hist-sci-2",
                "title": "Awarded Post-Doctoral Fellowship",
                "date": "2024-04-12",
                "type": "success",
                "category": "career",
                "description": "Secured funding for 3 years to independently study exoplanet habitability.",
                "skills": [
                  "Grant Writing",
                  "Research Design"
                ]
              },
              {
                "id": "hist-sci-3",
                "title": "Equipment Failure during Telescope Observation",
                "date": "2025-01-18",
                "type": "failure",
                "category": "research",
                "description": "Lost 14 hours of crucial observational data due to a cryogenic cooling malfunction.",
                "skills": [
                  "Troubleshooting",
                  "Crisis Management"
                ]
              }
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
            { id: "ms-prof-1", title: "Secure $2M Department Funding Grant", status: "completed", tasks: [
                      {
                        "id": "task-prof-1-1",
                        "title": "Draft the preliminary grant narrative",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-prof-1-2",
                        "title": "Gather letters of support from industry partners",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-prof-1-3",
                        "title": "Present the finalized budget to the University Dean",
                        "completed": true,
                        "weightage": 10,
                        "time": 60
                      }
                    ] },
            { id: "ms-prof-2", title: "Design Advanced Cosmology Curriculum", status: "completed", tasks: [
                      {
                        "id": "task-prof-2-1",
                        "title": "Select the primary textbooks and recent journal articles",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      },
                      {
                        "id": "task-prof-2-2",
                        "title": "Design the syllabus and weekly problem sets",
                        "completed": true,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-prof-2-3",
                        "title": "Integrate observational data projects into the curriculum",
                        "completed": true,
                        "weightage": 10,
                        "time": 120
                      }
                    ] },
            { id: "ms-prof-3", title: "Chair the International Astrophysics Symposium", status: "pending", tasks: [
                      {
                        "id": "task-prof-3-1",
                        "title": "Review and select the abstract submissions",
                        "completed": false,
                        "weightage": 10,
                        "time": 180
                      },
                      {
                        "id": "task-prof-3-2",
                        "title": "Finalize the keynote speakers and session chairs",
                        "completed": false,
                        "weightage": 10,
                        "time": 90
                      },
                      {
                        "id": "task-prof-3-3",
                        "title": "Deliver the opening remarks at the symposium",
                        "completed": false,
                        "weightage": 10,
                        "time": 60
                      }
                    ] },
            { id: "ms-prof-4", title: "Lead 3 PhD Candidates to successful defenses", status: "pending", tasks: [
                      {
                        "id": "task-prof-4-1",
                        "title": "Conduct comprehensive review of Candidate A's thesis draft",
                        "completed": false,
                        "weightage": 10,
                        "time": 240
                      },
                      {
                        "id": "task-prof-4-2",
                        "title": "Run mock defense sessions for Candidates B and C",
                        "completed": false,
                        "weightage": 15,
                        "time": 180
                      },
                      {
                        "id": "task-prof-4-3",
                        "title": "Sign the final approval paperwork for all three candidates",
                        "completed": false,
                        "weightage": 20,
                        "time": 30
                      }
                    ] }
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
        { id: "void-prof-1", text: "Engaging in Departmental Politics", impact: "high", engagedCount: 0, maxAllowed: 3 },
        { id: "void-prof-2", text: "Endless Administrative Email Chains", impact: "medium", engagedCount: 0, maxAllowed: 2 }
      ],
        history: [
              {
                "id": "hist-prof-1",
                "title": "Awarded University Teaching Excellence Award",
                "date": "2022-05-20",
                "type": "success",
                "category": "award",
                "description": "Recognized by the student body and faculty for outstanding dedication to mentorship.",
                "skills": [
                  "Public Speaking",
                  "Mentorship",
                  "Pedagogy"
                ]
              },
              {
                "id": "hist-prof-2",
                "title": "First PhD Student Successfully Defends Thesis",
                "date": "2023-08-15",
                "type": "success",
                "category": "mentorship",
                "description": "A deeply rewarding moment validating years of guidance and academic cultivation.",
                "skills": [
                  "Advising",
                  "Academic Leadership"
                ]
              },
              {
                "id": "hist-prof-3",
                "title": "Major Grant Proposal Denied by NSF",
                "date": "2024-02-10",
                "type": "failure",
                "category": "finance",
                "description": "A highly anticipated $1M grant was rejected. Resulted in a complete restructuring of the lab's financial strategy.",
                "skills": [
                  "Grant Writing",
                  "Resilience",
                  "Strategic Planning"
                ]
              }
            ]
    }
  },
  ...mastermindArchetypes
];
