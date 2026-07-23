import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const heavyBuilderProfiles: Archetype[] = [
  {
    id: "heavy-blueprint-orchestrator",
    icon: "lucide:compass",
    title: "The Blueprint Orchestrator",
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
            { id: "ms-1", title: "Finalize subgrade blueprints", completed: true },
            { id: "ms-2", title: "Approve deep foundation piling plan", completed: false },
            { id: "ms-3", title: "Sign off on municipal drainage integration", completed: false }
          ]
        },
        {
          id: "amb-marcus-2",
          title: "Bridge Seismic Retrofit Project",
          description: "Upgrade the old suspension bridge to withstand high magnitude seismic activity.",
          status: "in-progress",
          milestones: [
            { id: "ms-4", title: "Structural integrity assessment", completed: true },
            { id: "ms-5", title: "Design damper installations", completed: false }
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
      ]
    }
  },
  {
    id: "heavy-structural-titan",
    icon: "lucide:hard-hat",
    title: "The Structural Titan",
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
            { id: "ms-1", title: "Pour 10,000 yards of foundation concrete", completed: true },
            { id: "ms-2", title: "Complete steel framing up to floor 25", completed: true },
            { id: "ms-3", title: "Top out roof structure", completed: false }
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
      ]
    }
  },
  {
    id: "heavy-plant-maestro",
    icon: "lucide:factory",
    title: "The Plant Maestro",
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
            { id: "ms-1", title: "Map current value stream", completed: true },
            { id: "ms-2", title: "Implement statistical process control", completed: false },
            { id: "ms-3", title: "Train shift supervisors on lean principles", completed: false }
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
      ]
    }
  },
  {
    id: "heavy-machine-whisperer",
    icon: "lucide:cpu",
    title: "The Machine Whisperer",
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
            { id: "ms-1", title: "Map facility for LiDAR navigation", completed: true },
            { id: "ms-2", title: "Program traffic control algorithms", completed: false },
            { id: "ms-3", title: "Conduct full fleet dry run", completed: false }
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
      ]
    }
  },
  {
    id: "heavy-voltage-vanguard",
    icon: "lucide:zap",
    title: "The Voltage Vanguard",
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
            { id: "ms-1", title: "Complete main switchgear installation", completed: true },
            { id: "ms-2", title: "Pull primary feeder cables", completed: false },
            { id: "ms-3", title: "Commission backup generator arrays", completed: false }
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
      ]
    }
  }
];
