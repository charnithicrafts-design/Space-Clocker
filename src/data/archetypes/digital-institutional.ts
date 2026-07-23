import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const digitalInstitutionalProfiles: Archetype[] = [
  {
    id: "product-visionary",
    icon: "🚀",
    title: "The Product Visionary",
    subtitle: "Priya | Product Manager",
    vibe: "Strategic, user-obsessed, and ruthlessly prioritizing.",
    data: {
      profile: {
        name: "Priya",
        level: 32,
        xp: 45000,
        title: "Senior Product Manager"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 42, tasksCompleted: 450, totalFocusHours: 620 },
      ambitions: [
        {
          id: "launch-v2",
          title: "Launch Platform V2",
          type: "professional",
          milestones: [
            { id: "m1", title: "Finalize PRD", status: "completed" },
            { id: "m2", title: "Beta Testing", status: "active" },
            { id: "m3", title: "General Availability", status: "pending" }
          ]
        },
        {
          id: "pm-mentorship",
          title: "Establish PM Guild",
          type: "community",
          milestones: [
            { id: "m1", title: "Define Curriculum", status: "active" },
            { id: "m2", title: "Host First Cohort", status: "pending" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("product-visionary", "launch-v2", [
          "Write PRD for user auth flow",
          "Sync with engineering on sprint capacity",
          "Review user interview transcripts",
          "Draft release notes for V1.9",
          "Update roadmap presentation for Q3",
          "Conduct competitor analysis on pricing",
          "Finalize OKRs with leadership",
          "Review mockups with design team",
          "Write acceptance criteria for payment gateway",
          "Approve sprint demo",
          "Prepare launch strategy deck",
          "Align marketing on messaging"
        ], 450),
        { id: "t1", title: "Refine backlog for Sprint 45", completed: false, date: getToday(), ambitionId: "launch-v2", duration: 60 },
        { id: "t2", title: "1:1 with Lead Designer", completed: false, date: getToday(), ambitionId: "launch-v2", duration: 30 },
        { id: "t3", title: "Draft PM Guild curriculum outline", completed: false, date: getToday(), ambitionId: "pm-mentorship", duration: 90 }
      ],
      voids: [
        { id: "v1", title: "Feature Creep Compromises", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Saying yes to a feature without strategic alignment." },
        { id: "v2", title: "Analysis Paralysis", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Over-analyzing data instead of shipping and learning." }
      ]
    }
  },
  {
    id: "cyber-sentinel",
    icon: "🛡️",
    title: "The Cyber Sentinel",
    subtitle: "Omar | Penetration Tester",
    vibe: "Analytical, methodical, and always thinking like the adversary.",
    data: {
      profile: {
        name: "Omar",
        level: 28,
        xp: 32000,
        title: "Lead Red Team Specialist"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 15, tasksCompleted: 310, totalFocusHours: 850 },
      ambitions: [
        {
          id: "cert-oscp",
          title: "Obtain OSCP Certification",
          type: "personal",
          milestones: [
            { id: "m1", title: "Complete Lab Machines", status: "completed" },
            { id: "m2", title: "Pass 24hr Exam", status: "active" }
          ]
        },
        {
          id: "sec-audit",
          title: "Enterprise Security Audit",
          type: "professional",
          milestones: [
            { id: "m1", title: "External Network Pentest", status: "completed" },
            { id: "m2", title: "Social Engineering Campaign", status: "active" },
            { id: "m3", title: "Final Report Delivery", status: "pending" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("cyber-sentinel", "sec-audit", [
          "Run Nmap stealth scans on target IP range",
          "Analyze Burp Suite proxy logs",
          "Draft phishing email templates",
          "Exploit CVE-2023-XXXX on staging server",
          "Document privilege escalation vectors",
          "Analyze Active Directory configuration",
          "Review web app source code for SQLi",
          "Generate SSL/TLS vulnerability report",
          "Bypass WAF using encoded payloads",
          "Crack captured password hashes",
          "Draft executive summary of findings",
          "Present preliminary findings to CISO"
        ], 310),
        { id: "t1", title: "Pivoting practice in HackTheBox", completed: false, date: getToday(), ambitionId: "cert-oscp", duration: 120 },
        { id: "t2", title: "Launch phishing campaign simulation", completed: false, date: getToday(), ambitionId: "sec-audit", duration: 45 },
        { id: "t3", title: "Analyze SIEM alerts from red team exercise", completed: false, date: getToday(), ambitionId: "sec-audit", duration: 60 }
      ],
      voids: [
        { id: "v1", title: "Scope Creep", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Attacking out-of-scope assets during an engagement." },
        { id: "v2", title: "Rabbit Hole Digging", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Spending too much time on a likely dead-end exploit." }
      ]
    }
  },
  {
    id: "silent-guardian",
    icon: "☁️",
    title: "The Silent Guardian",
    subtitle: "David | Cloud DevOps Engineer",
    vibe: "Automated, resilient, and architecting for scale.",
    data: {
      profile: {
        name: "David",
        level: 35,
        xp: 52000,
        title: "Principal DevOps Engineer"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 60, tasksCompleted: 580, totalFocusHours: 920 },
      ambitions: [
        {
          id: "k8s-migration",
          title: "Complete Kubernetes Migration",
          type: "professional",
          milestones: [
            { id: "m1", title: "Containerize Monolith", status: "completed" },
            { id: "m2", title: "Setup CI/CD Pipelines", status: "completed" },
            { id: "m3", title: "Production Cutover", status: "active" }
          ]
        },
        {
          id: "infra-as-code",
          title: "100% Infrastructure as Code",
          type: "professional",
          milestones: [
            { id: "m1", title: "Terraform Network Layer", status: "completed" },
            { id: "m2", title: "Terraform Data Layer", status: "active" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("silent-guardian", "k8s-migration", [
          "Write Dockerfile for legacy API",
          "Configure Helm charts for monitoring stack",
          "Setup GitHub Actions for continuous deployment",
          "Debug pod OOMKilled issues",
          "Implement auto-scaling policies",
          "Rotate AWS IAM access keys",
          "Optimize database connection pooling",
          "Write Terraform state migration script",
          "Configure Prometheus alerts",
          "Review Datadog dashboards for anomalies",
          "Conduct disaster recovery drill",
          "Update runbooks for on-call rotation"
        ], 580),
        { id: "t1", title: "Review Terraform PR for RDS cluster", completed: false, date: getToday(), ambitionId: "infra-as-code", duration: 45 },
        { id: "t2", title: "Monitor production traffic during K8s canary release", completed: false, date: getToday(), ambitionId: "k8s-migration", duration: 90 },
        { id: "t3", title: "Optimize CI pipeline build times", completed: false, date: getToday(), ambitionId: "k8s-migration", duration: 60 }
      ],
      voids: [
        { id: "v1", title: "Manual Config Changes", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Making manual changes via AWS Console instead of Terraform." },
        { id: "v2", title: "Ignoring Alert Fatigue", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Dismissing alerts without investigating the root cause." }
      ]
    }
  },
  {
    id: "legal-eagle",
    icon: "⚖️",
    title: "The Legal Eagle",
    subtitle: "Elena | Corporate Mergers Lawyer",
    vibe: "Precise, formidable, and navigating complex negotiations.",
    data: {
      profile: {
        name: "Elena",
        level: 38,
        xp: 61000,
        title: "Senior Partner, M&A"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 22, tasksCompleted: 410, totalFocusHours: 780 },
      ambitions: [
        {
          id: "project-titan",
          title: "Close Project Titan Acquisition",
          type: "professional",
          milestones: [
            { id: "m1", title: "Due Diligence Complete", status: "completed" },
            { id: "m2", title: "Definitive Agreement Drafted", status: "active" },
            { id: "m3", title: "Regulatory Approval", status: "pending" }
          ]
        },
        {
          id: "partner-track",
          title: "Expand Practice Group",
          type: "professional",
          milestones: [
            { id: "m1", title: "Hire 2 Associates", status: "completed" },
            { id: "m2", title: "Publish M&A Article in Journal", status: "active" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("legal-eagle", "project-titan", [
          "Review IP assignment agreements",
          "Draft indemnification clauses",
          "Negotiate working capital adjustment",
          "Review employment contracts for key executives",
          "Analyze antitrust implications",
          "Draft board resolutions for approval",
          "Review disclosure schedules",
          "Coordinate with tax counsel on structuring",
          "Prepare closing checklist",
          "Draft press release legal disclaimer",
          "Review environmental compliance reports",
          "Conduct markup session with opposing counsel"
        ], 410),
        { id: "t1", title: "Review revised APA draft from buyer's counsel", completed: false, date: getToday(), ambitionId: "project-titan", duration: 120 },
        { id: "t2", title: "Call with client to discuss escrow terms", completed: false, date: getToday(), ambitionId: "project-titan", duration: 45 },
        { id: "t3", title: "Draft abstract for M&A journal article", completed: false, date: getToday(), ambitionId: "partner-track", duration: 60 }
      ],
      voids: [
        { id: "v1", title: "Skipping the Fine Print", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Relying on associates without personal review of critical clauses." },
        { id: "v2", title: "Emotional Negotiation", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Letting opposing counsel's tactics disrupt objective analysis." }
      ]
    }
  },
  {
    id: "athletic-ascendant",
    icon: "📊",
    title: "The Athletic Ascendant",
    subtitle: "Kofi | High-Performance Coach",
    vibe: "Motivating, data-driven, and unlocking human potential.",
    data: {
      profile: {
        name: "Kofi",
        level: 25,
        xp: 28000,
        title: "Elite Performance Director"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 85, tasksCompleted: 620, totalFocusHours: 510 },
      ambitions: [
        {
          id: "olympic-prep",
          title: "Prepare Athletes for Trials",
          type: "professional",
          milestones: [
            { id: "m1", title: "Base Conditioning Phase", status: "completed" },
            { id: "m2", title: "Strength & Power Phase", status: "active" },
            { id: "m3", title: "Tapering Phase", status: "pending" }
          ]
        },
        {
          id: "biomechanics-course",
          title: "Master Advanced Biomechanics",
          type: "personal",
          milestones: [
            { id: "m1", title: "Complete Kinematics Module", status: "completed" },
            { id: "m2", title: "Pass Final Assessment", status: "active" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("athletic-ascendant", "olympic-prep", [
          "Analyze force plate data for sprinters",
          "Design meso-cycle programming for Q2",
          "Review nutrition logs with dietician",
          "Conduct V02 max testing",
          "Adjust recovery protocols based on HRV",
          "Film and analyze sprint mechanics",
          "Lead plyometric session",
          "Coordinate sports psychology workshops",
          "Review injury reports with physio",
          "Plan travel logistics for training camp",
          "Evaluate biomechanical efficiency of hurdles",
          "Draft quarterly athlete progress reports"
        ], 620),
        { id: "t1", title: "Analyze motion capture data for Athlete A", completed: false, date: getToday(), ambitionId: "olympic-prep", duration: 60 },
        { id: "t2", title: "Lead afternoon speed agility session", completed: false, date: getToday(), ambitionId: "olympic-prep", duration: 90 },
        { id: "t3", title: "Study kinetics lecture for certification", completed: false, date: getToday(), ambitionId: "biomechanics-course", duration: 45 }
      ],
      voids: [
        { id: "v1", title: "Ignoring Recovery Metrics", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Pushing athletes when HRV indicates overtraining." },
        { id: "v2", title: "Cookie-Cutter Programming", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Failing to individualize workouts for specific athlete needs." }
      ]
    }
  },
  {
    id: "soil-whisperer",
    icon: "🍃",
    title: "The Soil Whisperer",
    subtitle: "Jack | Commercial Agronomist",
    vibe: "Grounded, scientific, and optimizing natural yields.",
    data: {
      profile: {
        name: "Jack",
        level: 30,
        xp: 41000,
        title: "Senior Agronomy Consultant"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 45, tasksCompleted: 390, totalFocusHours: 670 },
      ambitions: [
        {
          id: "yield-opt",
          title: "Increase Regional Corn Yield by 15%",
          type: "professional",
          milestones: [
            { id: "m1", title: "Soil Sampling & Analysis", status: "completed" },
            { id: "m2", title: "Implement Precision Fertilizer Plan", status: "active" },
            { id: "m3", title: "Harvest Yield Analysis", status: "pending" }
          ]
        },
        {
          id: "regen-ag",
          title: "Pilot Regenerative Ag Program",
          type: "professional",
          milestones: [
            { id: "m1", title: "Select Test Plots", status: "completed" },
            { id: "m2", title: "Plant Cover Crops", status: "active" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("soil-whisperer", "yield-opt", [
          "Analyze soil pH and nutrient levels",
          "Calibrate precision planting equipment",
          "Scout fields for pest pressure",
          "Review satellite NDVI imagery",
          "Recommend fungicide application rates",
          "Consult on irrigation scheduling",
          "Evaluate tissue sample lab results",
          "Map variable rate fertilizer prescriptions",
          "Assess storm damage in Sector 4",
          "Compare seed hybrid performance data",
          "Present mid-season crop health report to farm managers",
          "Calculate ROI for nitrogen stabilizers"
        ], 390),
        { id: "t1", title: "Review drone survey data for nitrogen deficiency", completed: false, date: getToday(), ambitionId: "yield-opt", duration: 60 },
        { id: "t2", title: "Consultation with Smith Farm on cover crop selection", completed: false, date: getToday(), ambitionId: "regen-ag", duration: 90 },
        { id: "t3", title: "Draft variable rate prescription map for Field 7", completed: false, date: getToday(), ambitionId: "yield-opt", duration: 45 }
      ],
      voids: [
        { id: "v1", title: "Ignoring Micro-Climates", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Applying regional data blindly without field-specific context." },
        { id: "v2", title: "Over-relying on Synthetics", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Recommending chemical solutions instead of addressing soil health." }
      ]
    }
  },
  {
    id: "real-estate-maven",
    icon: "🏛️",
    title: "The Real Estate Maven",
    subtitle: "James | Commercial Developer",
    vibe: "Visionary, calculated, and transforming skylines.",
    data: {
      profile: {
        name: "James",
        level: 34,
        xp: 49000,
        title: "Managing Director of Development"
      },
      preferences: { confirmDelete: true, uiMode: 'nebula' },
      stats: { streak: 30, tasksCompleted: 430, totalFocusHours: 710 },
      ambitions: [
        {
          id: "downtown-revival",
          title: "Mixed-Use Downtown Project",
          type: "professional",
          milestones: [
            { id: "m1", title: "Land Acquisition", status: "completed" },
            { id: "m2", title: "Zoning & Entitlements", status: "active" },
            { id: "m3", title: "Secure Anchor Tenant", status: "pending" }
          ]
        },
        {
          id: "green-cert",
          title: "LEED Platinum Portfolio",
          type: "professional",
          milestones: [
            { id: "m1", title: "Retrofit HVAC Systems", status: "completed" },
            { id: "m2", title: "Install Solar Arrays", status: "active" }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks("real-estate-maven", "downtown-revival", [
          "Review financial pro forma for Phase 1",
          "Meet with city planning commission",
          "Negotiate term sheet with general contractor",
          "Review architectural schematics",
          "Conduct site visit for environmental assessment",
          "Pitch equity investors on capital stack",
          "Review lease agreement for retail space",
          "Approve marketing budget for pre-leasing",
          "Coordinate with structural engineers on foundation design",
          "Analyze traffic impact study",
          "Review loan documents with legal team",
          "Approve construction draw request"
        ], 430),
        { id: "t1", title: "Pitch meeting with potential anchor tenant", completed: false, date: getToday(), ambitionId: "downtown-revival", duration: 120 },
        { id: "t2", title: "Review updated pro forma scenarios based on interest rates", completed: false, date: getToday(), ambitionId: "downtown-revival", duration: 60 },
        { id: "t3", title: "Site walk to inspect solar array installation progress", completed: false, date: getToday(), ambitionId: "green-cert", duration: 90 }
      ],
      voids: [
        { id: "v1", title: "Underestimating Soft Costs", impact: "high", engagedCount: 0, maxAllowed: 0, description: "Failing to properly budget for permits, legal, and architectural fees." },
        { id: "v2", title: "Ignoring Community Backlash", impact: "medium", engagedCount: 0, maxAllowed: 0, description: "Pushing forward without addressing local neighborhood concerns." }
      ]
    }
  }
];
