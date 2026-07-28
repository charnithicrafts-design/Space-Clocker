import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const heavyBuilderProfiles: Archetype[] = [
  {
    id: "heavy-blueprint-orchestrator",
    icon: "🏗️",
    title: "",
    voids: [
        {
            id: "void-heavy-blueprint-orchestrator-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-heavy-blueprint-orchestrator-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Marcus | Senior Civil Engineer",
    vibe: "Precise, structured, large-scale vision, foundational.",
    data: {
      profile: {
        name: "Marcus",
        level: 38,
        xp: 75000,
        title: "Senior Civil Engineer"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 85,
        tasksCompleted: 650,
        totalFocusHours: 850
      },
      ambitions: [
        {
          id: "amb-marcus-1",
          title: "Complete City Center Infrastructure Overhaul",
          description: "Design and implement the foundation and utilities network for the new metropolitan district.",
          status: "in-progress",
          milestones: [
            { id: "ms-4cdd7782", title: "Finalize subgrade blueprints: Guarantee 100-year foundation stability", completed: true , tasks: [
                  { id: 'amb-marcus-1-t1', title: 'Consult with geotechnical engineers', completed: true },
                  { id: 'amb-marcus-1-t2', title: 'Review soil boring logs', completed: true },
                  { id: 'amb-marcus-1-t3', title: 'Approve final rebar specifications', completed: true }
                ] },
            { id: "ms-da4e2b8e", title: "Approve deep piling plan: Navigate complex subterranean bedrock", completed: false , tasks: [
                  { id: 'ms-da4e2b8e-t1', title: 'Map bedrock depth across site', completed: true },
                  { id: 'ms-da4e2b8e-t2', title: 'Select pile driving equipment', completed: false },
                  { id: 'ms-da4e2b8e-t3', title: 'Monitor test pile installation', completed: false }
                ] },
            { id: "ms-076fed79", title: "Municipal drainage: Engineer flood-proof storm retention", completed: false , tasks: [
                  { id: 'ms-076fed79-t1', title: 'Calculate 100-year flood volumes', completed: true },
                  { id: 'ms-076fed79-t2', title: 'Design underground retention vaults', completed: false },
                  { id: 'ms-076fed79-t3', title: 'Obtain civil engineering sign-off', completed: false }
                ] }
          ]
        },
        {
          id: "amb-marcus-2",
          title: "Bridge Seismic Retrofit Project",
          description: "Upgrade the old suspension bridge to withstand high magnitude seismic activity.",
          status: "in-progress",
          milestones: [
            { id: "ms-05a2210e", title: "Structural integrity assessment: X-ray the 50-year-old suspension cables", completed: true , tasks: [
                  { id: 'amb-marcus-2-t1', title: 'Deploy ultrasonic testing drones', completed: true },
                  { id: 'amb-marcus-2-t2', title: 'Analyze stress fracture reports', completed: true },
                  { id: 'amb-marcus-2-t3', title: 'Draft maintenance recommendation', completed: true }
                ] },
            { id: "ms-21869cf1", title: "Design damper installations: Absorb 8.0 magnitude seismic shockwaves", completed: false , tasks: [
                  { id: 'ms-21869cf1-t1', title: 'Model seismic loads in software', completed: true },
                  { id: 'ms-21869cf1-t2', title: 'Select tuned mass damper system', completed: false },
                  { id: 'ms-21869cf1-t3', title: 'Supervise installation on top floor', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "heavy-blueprint-orchestrator",
          "amb-marcus-1",
          [
            "Review soil bearing capacity reports",
            "Draft retaining wall schematics",
            "Coordinate with geotechnical consultants",
            "Run stress simulations on main load-bearing columns",
            "Calculate concrete mix specifications for sub-basement",
            "Revise underground utility trenching paths",
            "Approve rebar detailing for continuous footings",
            "Audit environmental impact assessment",
            "Update grading and drainage plans",
            "Inspect site excavation progress",
            "Calculate sheer stress for wind loads",
            "Review surveyor topo maps"
          ],
          650
        ),
        {
          id: "task-marcus-today-1",
          title: "Finalize piling schedule for Sector A",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          tags: ["Planning", "Foundation"]
        },
        {
          id: "task-marcus-today-2",
          title: "Review CAD drafts for storm water retention",
          status: "pending",
          priority: "medium",
          duration: 90,
          date: getToday(),
          tags: ["CAD", "Drainage"]
        },
        {
          id: "task-marcus-today-3",
          title: "Meeting with city planning commission",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          tags: ["Meeting", "Permits"]
        }
      ],
      voids: [
        {
          id: "void-marcus-1",
          title: "Code Compliance Bottlenecks",
          description: "Delays caused by conflicting municipal zoning laws and outdated building codes.",
          impact: "high",
          engagedCount: 14,
          maxAllowed: 0
        },
        {
          id: "void-marcus-2",
          title: "Material Supply Chain Disruptions",
          description: "Unexpected shortages in high-tensile steel delaying structural phases.",
          impact: "medium",
          engagedCount: 8,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233786790-0",
                "name": "Active Listening",
                "currentProficiency": 55,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-1",
                "name": "Deep Work Focus",
                "currentProficiency": 43,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-2",
                "name": "Radical Candor",
                "currentProficiency": 31,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-3",
                "name": "Emotional Resilience",
                "currentProficiency": 53,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-4",
                "name": "Growth Mindset",
                "currentProficiency": 68,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "View every failure as data. Adapt and iterate continuously.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-5",
                "name": "Strategic Empathy",
                "currentProficiency": 36,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786790-6",
                "name": "Time Management",
                "currentProficiency": 78,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233786790-7",
                "name": "Advanced Amb Marcus 1 Tactics 1",
                "currentProficiency": 61,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-marcus-1"
              },
              {
                "id": "skill-a-1785233786790-8",
                "name": "Advanced Amb Marcus 1 Tactics 2",
                "currentProficiency": 42,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-marcus-1"
              },
              {
                "id": "skill-a-1785233786790-9",
                "name": "Advanced Amb Marcus 1 Tactics 3",
                "currentProficiency": 59,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-marcus-1"
              },
              {
                "id": "skill-a-1785233786790-10",
                "name": "Advanced Amb Marcus 2 Tactics 1",
                "currentProficiency": 25,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-marcus-2"
              },
              {
                "id": "skill-a-1785233786791-11",
                "name": "Advanced Amb Marcus 2 Tactics 2",
                "currentProficiency": 79,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-marcus-2"
              },
              {
                "id": "skill-a-1785233786791-12",
                "name": "Advanced Amb Marcus 2 Tactics 3",
                "currentProficiency": 46,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-marcus-2"
              }
            ]
    }
  },
  {
    id: "heavy-structural-titan",
    icon: "👷",
    title: "",
    voids: [
        {
            id: "void-heavy-structural-titan-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-heavy-structural-titan-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Tariq | Heavy Construction PM",
    vibe: "Commanding, deadline-driven, logistics master, unyielding.",
    data: {
      profile: {
        name: "Tariq",
        level: 40,
        xp: 80000,
        title: "Heavy Construction PM"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 92,
        tasksCompleted: 780,
        totalFocusHours: 950
      },
      ambitions: [
        {
          id: "amb-tariq-1",
          title: "Erect Sector 7 Mega-Complex",
          description: "Oversee the end-to-end construction of a 50-story mixed-use commercial tower.",
          status: "in-progress",
          milestones: [
            { id: "ms-657a525e", title: "Pour 10,000 yards of foundation concrete", completed: true , tasks: [
                  { id: 'amb-tariq-1-t1', title: 'Coordinate 100+ cement trucks', completed: true },
                  { id: 'amb-tariq-1-t2', title: 'Monitor concrete curing temperatures', completed: true },
                  { id: 'amb-tariq-1-t3', title: 'Perform slump and strength tests', completed: true }
                ] },
            { id: "ms-9bc3fb77", title: "Complete steel framing up to floor 25", completed: true , tasks: [
                  { id: 'ms-9bc3fb77-t1', title: 'Erect central elevator core', completed: true },
                  { id: 'ms-9bc3fb77-t2', title: 'Weld primary steel girders', completed: true },
                  { id: 'ms-9bc3fb77-t3', title: 'Inspect all high-strength bolt torques', completed: true }
                ] },
            { id: "ms-7508a687", title: "Top out roof structure", completed: false , tasks: [
                  { id: 'ms-7508a687-t1', title: 'Hoist final steel beam', completed: true },
                  { id: 'ms-7508a687-t2', title: 'Host topping out ceremony', completed: false },
                  { id: 'ms-7508a687-t3', title: 'Begin exterior envelope sealing', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "heavy-structural-titan",
          "amb-tariq-1",
          [
            "Approve daily crane lift schedule",
            "Resolve union labor dispute on site",
            "Negotiate with cement suppliers for bulk discount",
            "Inspect formwork for structural columns",
            "Sign off on weekly safety audit",
            "Review budget overrun on steel procurement",
            "Coordinate oversized load deliveries",
            "Update critical path Gantt chart",
            "Approve overtime for ironworkers",
            "Check curing logs for concrete slabs",
            "Conduct foremen coordination meeting"
          ],
          780
        ),
        {
          id: "task-tariq-today-1",
          title: "Walkthrough inspection of floors 20-25",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          tags: ["Site Visit", "Inspection"]
        },
        {
          id: "task-tariq-today-2",
          title: "Review next week's material staging plan",
          status: "pending",
          priority: "medium",
          duration: 60,
          date: getToday(),
          tags: ["Logistics", "Planning"]
        },
        {
          id: "task-tariq-today-3",
          title: "Approve subcontractor invoices for HVAC rough-in",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday(),
          tags: ["Financial", "Admin"]
        }
      ],
      voids: [
        {
          id: "void-tariq-1",
          title: "Weather Delays",
          description: "Severe wind forcing crane shutdowns and delaying steel erection.",
          impact: "high",
          engagedCount: 22,
          maxAllowed: 0
        },
        {
          id: "void-tariq-2",
          title: "Subcontractor Clashes",
          description: "Scheduling overlaps between MEP trades causing on-site conflicts.",
          impact: "high",
          engagedCount: 15,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233786841-0",
                "name": "Emotional Resilience",
                "currentProficiency": 70,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-1",
                "name": "Time Management",
                "currentProficiency": 53,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-2",
                "name": "Deep Work Focus",
                "currentProficiency": 79,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-3",
                "name": "Active Listening",
                "currentProficiency": 44,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-4",
                "name": "Radical Candor",
                "currentProficiency": 33,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-5",
                "name": "Strategic Empathy",
                "currentProficiency": 30,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233786841-6",
                "name": "Cognitive Flexibility",
                "currentProficiency": 71,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The ability to pivot your thinking when the paradigm shifts.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233786841-7",
                "name": "Advanced Amb Tariq 1 Tactics 1",
                "currentProficiency": 21,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-tariq-1"
              },
              {
                "id": "skill-a-1785233786841-8",
                "name": "Advanced Amb Tariq 1 Tactics 2",
                "currentProficiency": 42,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "The Void will try to distract you from this, but the payoff is immense.",
                "ambitionId": "amb-tariq-1"
              },
              {
                "id": "skill-a-1785233786841-9",
                "name": "Advanced Amb Tariq 1 Tactics 3",
                "currentProficiency": 69,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-tariq-1"
              }
            ]
    }
  },
  {
    id: "heavy-plant-maestro",
    icon: "🏭",
    title: "",
    voids: [
        {
            id: "void-heavy-plant-maestro-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-heavy-plant-maestro-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "David | Factory Operations Manager",
    vibe: "Systematic, efficiency-obsessed, process-oriented, steadfast.",
    data: {
      profile: {
        name: "David",
        level: 35,
        xp: 68000,
        title: "Factory Operations Manager"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 70,
        tasksCompleted: 600,
        totalFocusHours: 720
      },
      ambitions: [
        {
          id: "amb-david-1",
          title: "Achieve Six Sigma Certification for Assembly Line 4",
          description: "Optimize production workflow to reduce defect rate to below 3.4 per million.",
          status: "in-progress",
          milestones: [
            { id: "ms-dfd3baa8", title: "Map current value stream: Expose hidden assembly bottlenecks", completed: true , tasks: [
                  { id: 'amb-david-1-t1', title: 'Observe factory floor operations for 3 days', completed: true },
                  { id: 'amb-david-1-t2', title: 'Identify non-value-added activities', completed: true },
                  { id: 'amb-david-1-t3', title: 'Draft current state VSM', completed: true }
                ] },
            { id: "ms-7bb0fef6", title: "Statistical process control: Reduce defect tolerance to Six Sigma", completed: false , tasks: [
                  { id: 'ms-7bb0fef6-t1', title: 'Implement automated optical inspection', completed: true },
                  { id: 'ms-7bb0fef6-t2', title: 'Train operators on control charts', completed: false },
                  { id: 'ms-7bb0fef6-t3', title: 'Achieve 3.4 DPMO target', completed: false }
                ] },
            { id: "ms-a376deb1", title: "Train shift supervisors: Cultivate a Kaizen continuous improvement culture", completed: false , tasks: [
                  { id: 'ms-a376deb1-t1', title: 'Host 5S organizational workshop', completed: true },
                  { id: 'ms-a376deb1-t2', title: 'Implement daily huddle routine', completed: false },
                  { id: 'ms-a376deb1-t3', title: 'Launch employee suggestion program', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "heavy-plant-maestro",
          "amb-david-1",
          [
            "Review daily production yield reports",
            "Conduct root cause analysis on conveyor jam",
            "Approve preventive maintenance schedule for CNC machines",
            "Update SOPs for the packaging division",
            "Evaluate raw material inventory levels",
            "Lead gemba walk on the shop floor",
            "Audit safety lockout/tagout procedures",
            "Optimize shift handover protocol",
            "Review OEE (Overall Equipment Effectiveness) metrics",
            "Resolve bottleneck at quality inspection station"
          ],
          600
        ),
        {
          id: "task-david-today-1",
          title: "Analyze scrap rate data from night shift",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          tags: ["Data Analysis", "Quality"]
        },
        {
          id: "task-david-today-2",
          title: "Meeting with procurement regarding tooling supply",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday(),
          tags: ["Procurement", "Meeting"]
        },
        {
          id: "task-david-today-3",
          title: "Approve layout changes for the new assembly cell",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          tags: ["Layout", "Process"]
        }
      ],
      voids: [
        {
          id: "void-david-1",
          title: "Unexpected Machine Downtime",
          description: "Critical failures on legacy equipment halting production lines.",
          impact: "high",
          engagedCount: 18,
          maxAllowed: 0
        },
        {
          id: "void-david-2",
          title: "Supply Chain Variability",
          description: "Inconsistent delivery times from tier-2 suppliers causing inventory issues.",
          impact: "medium",
          engagedCount: 12,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233787010-0",
                "name": "Active Listening",
                "currentProficiency": 30,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-1",
                "name": "Radical Candor",
                "currentProficiency": 47,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-2",
                "name": "Stress Regulation",
                "currentProficiency": 39,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-3",
                "name": "Emotional Resilience",
                "currentProficiency": 56,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-4",
                "name": "Strategic Empathy",
                "currentProficiency": 39,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-5",
                "name": "Deep Work Focus",
                "currentProficiency": 79,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787010-6",
                "name": "Time Management",
                "currentProficiency": 61,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787010-7",
                "name": "Advanced Amb David 1 Tactics 1",
                "currentProficiency": 27,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "An essential pillar of your trajectory. Cultivate it daily.",
                "ambitionId": "amb-david-1"
              },
              {
                "id": "skill-a-1785233787010-8",
                "name": "Advanced Amb David 1 Tactics 2",
                "currentProficiency": 23,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-david-1"
              },
              {
                "id": "skill-a-1785233787010-9",
                "name": "Advanced Amb David 1 Tactics 3",
                "currentProficiency": 76,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "The Void will try to distract you from this, but the payoff is immense.",
                "ambitionId": "amb-david-1"
              }
            ]
    }
  },
  {
    id: "heavy-machine-whisperer",
    icon: "🦾",
    title: "",
    voids: [
        {
            id: "void-heavy-machine-whisperer-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-heavy-machine-whisperer-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Elena | Robotics & Automation Engineer",
    vibe: "Innovative, highly technical, futuristic, meticulous.",
    data: {
      profile: {
        name: "Elena",
        level: 32,
        xp: 55000,
        title: "Robotics & Automation Engineer"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 65,
        tasksCompleted: 450,
        totalFocusHours: 600
      },
      ambitions: [
        {
          id: "amb-elena-1",
          title: "Deploy Autonomous Material Handlers",
          description: "Integrate a fleet of AGVs (Automated Guided Vehicles) for warehouse logistics.",
          status: "in-progress",
          milestones: [
            { id: "ms-cde68f7f", title: "Map facility for LiDAR: Establish millimeter-perfect AGV routes", completed: true , tasks: [
                  { id: 'amb-elena-1-t1', title: 'Scan entire warehouse with 3D LiDAR', completed: true },
                  { id: 'amb-elena-1-t2', title: 'Define designated exclusion zones', completed: true },
                  { id: 'amb-elena-1-t3', title: 'Upload map to AGV fleet manager', completed: true }
                ] },
            { id: "ms-6e5c340c", title: "Program traffic control: Prevent autonomous vehicle gridlock", completed: false , tasks: [
                  { id: 'ms-6e5c340c-t1', title: 'Implement right-of-way logic', completed: true },
                  { id: 'ms-6e5c340c-t2', title: 'Test bottleneck resolution algorithms', completed: false },
                  { id: 'ms-6e5c340c-t3', title: 'Simulate 50-vehicle operations', completed: false }
                ] },
            { id: "ms-10b66cd4", title: "Full fleet dry run: Execute 24-hour lights-out manufacturing test", completed: false , tasks: [
                  { id: 'ms-10b66cd4-t1', title: 'Power down all manual systems', completed: true },
                  { id: 'ms-10b66cd4-t2', title: 'Monitor AGV battery management', completed: false },
                  { id: 'ms-10b66cd4-t3', title: 'Review efficiency logs post-test', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "heavy-machine-whisperer",
          "amb-elena-1",
          [
            "Calibrate robotic arm end-effectors",
            "Debug PLC logic for packaging cell",
            "Update firmware on vision inspection cameras",
            "Tune PID controllers on servo motors",
            "Design custom 3D-printed gripper jaws",
            "Write safety interlock testing scripts",
            "Analyze telemetry data from AGV fleet",
            "Configure HMI (Human-Machine Interface) dashboards",
            "Resolve communication fault on PROFINET network",
            "Simulate kinematic movements in RoboGuide"
          ],
          450
        ),
        {
          id: "task-elena-today-1",
          title: "Troubleshoot pathing error on AGV Unit 4",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          tags: ["Debugging", "Robotics"]
        },
        {
          id: "task-elena-today-2",
          title: "Optimize cycle time for pick-and-place robot",
          status: "pending",
          priority: "medium",
          duration: 120,
          date: getToday(),
          tags: ["Optimization", "Programming"]
        },
        {
          id: "task-elena-today-3",
          title: "Review sensor upgrade specs with vendor",
          status: "pending",
          priority: "low",
          duration: 45,
          date: getToday(),
          tags: ["Hardware", "Meeting"]
        }
      ],
      voids: [
        {
          id: "void-elena-1",
          title: "Sensor Calibration Drift",
          description: "Optical sensors losing calibration due to environmental dust and vibrations.",
          impact: "medium",
          engagedCount: 11,
          maxAllowed: 0
        },
        {
          id: "void-elena-2",
          title: "Network Latency Spikes",
          description: "Intermittent delays in the industrial IoT network causing synchronization faults.",
          impact: "high",
          engagedCount: 7,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233787062-0",
                "name": "Emotional Resilience",
                "currentProficiency": 73,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-1",
                "name": "Time Management",
                "currentProficiency": 41,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-2",
                "name": "Radical Candor",
                "currentProficiency": 65,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-3",
                "name": "Stress Regulation",
                "currentProficiency": 41,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-4",
                "name": "Strategic Empathy",
                "currentProficiency": 64,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-5",
                "name": "Cognitive Flexibility",
                "currentProficiency": 38,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The ability to pivot your thinking when the paradigm shifts.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787062-6",
                "name": "Deep Work Focus",
                "currentProficiency": 58,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787062-7",
                "name": "Advanced Amb Elena 1 Tactics 1",
                "currentProficiency": 21,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-elena-1"
              },
              {
                "id": "skill-a-1785233787064-8",
                "name": "Advanced Amb Elena 1 Tactics 2",
                "currentProficiency": 52,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-elena-1"
              },
              {
                "id": "skill-a-1785233787064-9",
                "name": "Advanced Amb Elena 1 Tactics 3",
                "currentProficiency": 53,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-elena-1"
              }
            ]
    }
  },
  {
    id: "heavy-voltage-vanguard",
    icon: "⚡",
    title: "",
    voids: [
        {
            id: "void-heavy-voltage-vanguard-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-heavy-voltage-vanguard-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Sam | Master Electrician & Foreman",
    vibe: "Energetic, safety-first, pragmatic, highly skilled.",
    data: {
      profile: {
        name: "Sam",
        level: 37,
        xp: 72000,
        title: "Master Electrician & Foreman"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 88,
        tasksCompleted: 710,
        totalFocusHours: 820
      },
      ambitions: [
        {
          id: "amb-sam-1",
          title: "Electrify the Data Center Expansion",
          description: "Install and commission the high-voltage distribution network for a Tier 4 data center.",
          status: "in-progress",
          milestones: [
            { id: "ms-47c7dac2", title: "Main switchgear installation: Power the 50MW data center core", completed: true , tasks: [
                  { id: 'amb-sam-1-t1', title: 'Coordinate heavy lifting crane', completed: true },
                  { id: 'amb-sam-1-t2', title: 'Install primary transformers', completed: true },
                  { id: 'amb-sam-1-t3', title: 'Perform high-voltage megger testing', completed: true }
                ] },
            { id: "ms-95dfa44d", title: "Pull primary feeder cables: Route heavy copper through sub-floors", completed: false , tasks: [
                  { id: 'ms-95dfa44d-t1', title: 'Setup cable pulling winches', completed: true },
                  { id: 'ms-95dfa44d-t2', title: 'Route 10,000 feet of copper cable', completed: false },
                  { id: 'ms-95dfa44d-t3', title: 'Terminate connections at breaker panels', completed: false }
                ] },
            { id: "ms-855deb3b", title: "Commission backup generators: Guarantee 99.999% uptime during grid failure", completed: false , tasks: [
                  { id: 'ms-855deb3b-t1', title: 'Perform load bank testing', completed: true },
                  { id: 'ms-855deb3b-t2', title: 'Verify automatic transfer switch operation', completed: false },
                  { id: 'ms-855deb3b-t3', title: 'Sign off on final commissioning report', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "heavy-voltage-vanguard",
          "amb-sam-1",
          [
            "Review single-line electrical diagrams",
            "Coordinate transformer delivery and rigging",
            "Perform megger testing on high-voltage cables",
            "Supervise conduit bending for main service entrance",
            "Inspect grounding grid connections",
            "Update arc flash hazard analysis",
            "Train apprentices on lockout/tagout procedures",
            "Terminate connections on UPS battery banks",
            "Troubleshoot faulty variable frequency drive (VFD)",
            "Sign off on daily hot work permits",
            "Calculate voltage drop for long feeder runs"
          ],
          710
        ),
        {
          id: "task-sam-today-1",
          title: "Inspect generator automatic transfer switches (ATS)",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          tags: ["Inspection", "Power"]
        },
        {
          id: "task-sam-today-2",
          title: "Coordinate scheduled power outage with utility company",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          tags: ["Coordination", "Utility"]
        },
        {
          id: "task-sam-today-3",
          title: "Review material takeoff for server room distribution boards",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday(),
          tags: ["Planning", "Materials"]
        }
      ],
      voids: [
        {
          id: "void-sam-1",
          title: "Copper Wire Theft",
          description: "Security breaches resulting in stolen staging materials and delaying installation.",
          impact: "high",
          engagedCount: 4,
          maxAllowed: 0
        },
        {
          id: "void-sam-2",
          title: "Design Clashes",
          description: "HVAC ductwork blocking planned cable tray routes, requiring sudden redesigns.",
          impact: "medium",
          engagedCount: 16,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233787123-0",
                "name": "Stress Regulation",
                "currentProficiency": 56,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-1",
                "name": "Emotional Resilience",
                "currentProficiency": 73,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-2",
                "name": "Time Management",
                "currentProficiency": 46,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-3",
                "name": "Active Listening",
                "currentProficiency": 71,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-4",
                "name": "Radical Candor",
                "currentProficiency": 53,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-5",
                "name": "Cognitive Flexibility",
                "currentProficiency": 58,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The ability to pivot your thinking when the paradigm shifts.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787123-6",
                "name": "Strategic Empathy",
                "currentProficiency": 66,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787123-7",
                "name": "Advanced Amb Sam 1 Tactics 1",
                "currentProficiency": 72,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-sam-1"
              },
              {
                "id": "skill-a-1785233787123-8",
                "name": "Advanced Amb Sam 1 Tactics 2",
                "currentProficiency": 23,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-sam-1"
              },
              {
                "id": "skill-a-1785233787123-9",
                "name": "Advanced Amb Sam 1 Tactics 3",
                "currentProficiency": 47,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-sam-1"
              }
            ]
    }
  }
];
