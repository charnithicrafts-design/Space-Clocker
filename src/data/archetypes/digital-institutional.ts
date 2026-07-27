import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const digitalInstitutionalProfiles: Archetype[] = [
  {
    id: "product-visionary",
    icon: "🚀",
    title: "",
    voids: [
        {
            id: "void-product-visionary-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-product-visionary-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-6e37a551", title: "Finalize PRD: Secure buy-in from engineering & design leads", status: "completed" , tasks: [
                  { id: 'launch-v2-t1', title: 'Resolve final edge case comments', completed: true },
                  { id: 'launch-v2-t2', title: 'Get formal sign-off from tech lead', completed: true },
                  { id: 'launch-v2-t3', title: 'Lock PRD for sprint planning', completed: true }
                ] },
            { id: "ms-f6a85447", title: "Beta Testing: Onboard 500 legacy users & map friction logs", status: "active" , tasks: [
                  { id: 'ms-f6a85447-t1', title: 'Send beta invite emails', completed: true },
                  { id: 'ms-f6a85447-t2', title: 'Monitor daily active usage metrics', completed: false },
                  { id: 'ms-f6a85447-t3', title: 'Analyze Zendesk tickets for friction points', completed: false }
                ] },
            { id: "ms-5b833b87", title: "General Availability: Achieve zero-downtime global rollout", status: "pending" , tasks: [
                  { id: 'ms-5b833b87-t1', title: 'Scale up database read replicas', completed: true },
                  { id: 'ms-5b833b87-t2', title: 'Monitor error rates on Datadog', completed: false },
                  { id: 'ms-5b833b87-t3', title: 'Send launch announcement to entire userbase', completed: false }
                ] }
          ]
        },
        {
          id: "pm-mentorship",
          title: "Establish PM Guild",
          type: "community",
          milestones: [
            { id: "ms-15e840a0", title: "Define Curriculum: Map out core competencies for junior PMs", status: "active" , tasks: [
                  { id: 'pm-mentorship-t1', title: 'Interview senior PMs for required skills', completed: true },
                  { id: 'pm-mentorship-t2', title: 'Draft 6-week syllabus', completed: false },
                  { id: 'pm-mentorship-t3', title: 'Create practical milestone projects', completed: false }
                ] },
            { id: "ms-a5c9ece6", title: "Host First Cohort: Mentor 15 aspiring product managers", status: "pending" , tasks: [
                  { id: 'ms-a5c9ece6-t1', title: 'Conduct weekly 1-on-1s', completed: true },
                  { id: 'ms-a5c9ece6-t2', title: 'Grade final product teardowns', completed: false },
                  { id: 'ms-a5c9ece6-t3', title: 'Host graduation networking event', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-cyber-sentinel-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-cyber-sentinel-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-183be0f5", title: "Complete Lab Machines: Root all 75 active directory boxes", status: "completed" , tasks: [
                  { id: 'cert-oscp-t1', title: 'Run initial Nmap scans', completed: true },
                  { id: 'cert-oscp-t2', title: 'Exploit Kerberos misconfigurations', completed: true },
                  { id: 'cert-oscp-t3', title: 'Achieve Domain Admin on all targets', completed: true }
                ] },
            { id: "ms-a56fe2fd", title: "Pass 24hr Exam: Secure 5 systems without sleep", status: "active" , tasks: [
                  { id: 'ms-a56fe2fd-t1', title: 'Prepare local enumeration scripts', completed: true },
                  { id: 'ms-a56fe2fd-t2', title: 'Document findings in real-time', completed: false },
                  { id: 'ms-a56fe2fd-t3', title: 'Submit final penetration test report', completed: false }
                ] }
          ]
        },
        {
          id: "sec-audit",
          title: "Enterprise Security Audit",
          type: "professional",
          milestones: [
            { id: "ms-1f4d91c7", title: "External Pentest: Breach the staging perimeter", status: "completed" , tasks: [
                  { id: 'sec-audit-t1', title: 'Identify exposed AWS S3 buckets', completed: true },
                  { id: 'sec-audit-t2', title: 'Exploit unpatched web vulnerabilities', completed: true },
                  { id: 'sec-audit-t3', title: 'Exfiltrate dummy PII data', completed: true }
                ] },
            { id: "ms-c19bf669", title: "Social Engineering: Execute targeted phishing on C-suite", status: "active" , tasks: [
                  { id: 'ms-c19bf669-t1', title: 'Craft highly convincing spear-phishing emails', completed: true },
                  { id: 'ms-c19bf669-t2', title: 'Bypass spam filters', completed: false },
                  { id: 'ms-c19bf669-t3', title: 'Track credential harvesting success rate', completed: false }
                ] },
            { id: "ms-c3fec0ed", title: "Final Report: Present critical vulnerabilities to the Board", status: "pending" , tasks: [
                  { id: 'ms-c3fec0ed-t1', title: 'Draft executive summary', completed: true },
                  { id: 'ms-c3fec0ed-t2', title: 'Create remediation checklist', completed: false },
                  { id: 'ms-c3fec0ed-t3', title: 'Present findings to CISO', completed: false }
                ] }
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
          {
                    id: "v-cyb-1",
                    text: "Chasing False Positives",
                    description: "Investigating every low-priority alert",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-cyb-2",
                    text: "Draconian Policy Enforcement",
                    description: "Blocking legitimate work with overly strict rules",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-cyb-3",
                    text: "Skipping Soft Skills",
                    description: "Failing to educate users effectively",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-cyb-1",
                    title: "Discovered Zero-Day Vulnerability",
                    date: "2023-04-10",
                    type: "success",
                    category: "award",
                    description: "Received a $50k bug bounty for finding a critical flaw in a major OS.",
                    skills: [
                              "Penetration Testing",
                              "Reverse Engineering"
                    ]
          },
          {
                    id: "hist-cyb-2",
                    title: "Certified Information Systems Security Professional (CISSP)",
                    date: "2024-07-22",
                    type: "success",
                    category: "certification",
                    description: "Obtained the gold standard certification for cybersecurity management.",
                    skills: [
                              "Security Architecture",
                              "Risk Management"
                    ]
          },
          {
                    id: "hist-cyb-3",
                    title: "Redesigned Corporate Zero-Trust Architecture",
                    date: "2025-03-15",
                    type: "success",
                    category: "project",
                    description: "Successfully implemented beyond-corp principles for a remote workforce.",
                    skills: [
                              "Zero Trust",
                              "Identity Management"
                    ]
          }
]
    }
  },
  {
    id: "silent-guardian",
    icon: "☁️",
    title: "",
    voids: [
        {
            id: "void-silent-guardian-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-silent-guardian-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-ac8d8429", title: "Containerize Monolith", status: "completed" , tasks: [
                  { id: 'k8s-migration-t1', title: 'Write Dockerfile for legacy app', completed: true },
                  { id: 'k8s-migration-t2', title: 'Optimize image size', completed: true },
                  { id: 'k8s-migration-t3', title: 'Test local container execution', completed: true }
                ] },
            { id: "ms-626537b4", title: "Setup CI/CD Pipelines", status: "completed" , tasks: [
                  { id: 'ms-626537b4-t1', title: 'Configure GitHub Actions workflow', completed: true },
                  { id: 'ms-626537b4-t2', title: 'Add automated unit testing stage', completed: true },
                  { id: 'ms-626537b4-t3', title: 'Implement staging deployment step', completed: true }
                ] },
            { id: "ms-4a0bc2cd", title: "Production Cutover", status: "active" , tasks: [
                  { id: 'ms-4a0bc2cd-t1', title: 'Drain traffic from legacy instances', completed: true },
                  { id: 'ms-4a0bc2cd-t2', title: 'Monitor new Kubernetes pods', completed: false },
                  { id: 'ms-4a0bc2cd-t3', title: 'Verify successful traffic routing', completed: false }
                ] }
          ]
        },
        {
          id: "infra-as-code",
          title: "100% Infrastructure as Code",
          type: "professional",
          milestones: [
            { id: "ms-c8c42905", title: "Terraform Network Layer", status: "completed" , tasks: [
                  { id: 'infra-as-code-t1', title: 'Define VPC and Subnets in HCL', completed: true },
                  { id: 'infra-as-code-t2', title: 'Configure NAT Gateways', completed: true },
                  { id: 'infra-as-code-t3', title: 'Apply network state to AWS', completed: true }
                ] },
            { id: "ms-a21fce54", title: "Terraform Data Layer", status: "active" , tasks: [
                  { id: 'ms-a21fce54-t1', title: 'Write RDS instance configuration', completed: true },
                  { id: 'ms-a21fce54-t2', title: 'Implement automated snapshot policies', completed: false },
                  { id: 'ms-a21fce54-t3', title: 'Deploy staging database', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-legal-eagle-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-legal-eagle-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-ed5ce5be", title: "Due Diligence Complete", status: "completed" , tasks: [
                  { id: 'project-titan-t1', title: 'Review 3 years of financial statements', completed: true },
                  { id: 'project-titan-t2', title: 'Audit IP and patent portfolio', completed: true },
                  { id: 'project-titan-t3', title: 'Conduct technical code review', completed: true }
                ] },
            { id: "ms-ba636335", title: "Definitive Agreement Drafted", status: "active" , tasks: [
                  { id: 'ms-ba636335-t1', title: 'Negotiate representations and warranties', completed: true },
                  { id: 'ms-ba636335-t2', title: 'Finalize earn-out structure', completed: false },
                  { id: 'ms-ba636335-t3', title: 'Sign final binding agreement', completed: false }
                ] },
            { id: "ms-a09f6aae", title: "Regulatory Approval", status: "pending" , tasks: [
                  { id: 'ms-a09f6aae-t1', title: 'Submit anti-trust filings', completed: true },
                  { id: 'ms-a09f6aae-t2', title: 'Respond to SEC inquiries', completed: false },
                  { id: 'ms-a09f6aae-t3', title: 'Receive final clearance letter', completed: false }
                ] }
          ]
        },
        {
          id: "partner-track",
          title: "Expand Practice Group",
          type: "professional",
          milestones: [
            { id: "ms-fe5694ca", title: "Hire 2 Associates", status: "completed" , tasks: [
                  { id: 'partner-track-t1', title: 'Review 50 resumes', completed: true },
                  { id: 'partner-track-t2', title: 'Conduct technical interviews', completed: true },
                  { id: 'partner-track-t3', title: 'Extend final offers', completed: true }
                ] },
            { id: "ms-e0a64f78", title: "Publish M&A Article in Journal", status: "active" , tasks: [
                  { id: 'ms-e0a64f78-t1', title: 'Draft outline on recent market trends', completed: true },
                  { id: 'ms-e0a64f78-t2', title: 'Co-author with senior partner', completed: false },
                  { id: 'ms-e0a64f78-t3', title: 'Submit to Wall Street Journal', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-athletic-ascendant-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-athletic-ascendant-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-d487b998", title: "Base Conditioning Phase", status: "completed" , tasks: [
                  { id: 'olympic-prep-t1', title: 'Run 40 miles per week', completed: true },
                  { id: 'olympic-prep-t2', title: 'Perform 3x weekly strength sessions', completed: true },
                  { id: 'olympic-prep-t3', title: 'Log daily HRV metrics', completed: true }
                ] },
            { id: "ms-620170ed", title: "Strength & Power Phase", status: "active" , tasks: [
                  { id: 'ms-620170ed-t1', title: 'Incorporate heavy compound lifts', completed: true },
                  { id: 'ms-620170ed-t2', title: 'Add weekly track intervals', completed: false },
                  { id: 'ms-620170ed-t3', title: 'Optimize protein intake macros', completed: false }
                ] },
            { id: "ms-54672de3", title: "Tapering Phase", status: "pending" , tasks: [
                  { id: 'ms-54672de3-t1', title: 'Reduce weekly mileage by 50%', completed: true },
                  { id: 'ms-54672de3-t2', title: 'Focus on mobility and sleep', completed: false },
                  { id: 'ms-54672de3-t3', title: 'Finalize race day nutrition plan', completed: false }
                ] }
          ]
        },
        {
          id: "biomechanics-course",
          title: "Master Advanced Biomechanics",
          type: "personal",
          milestones: [
            { id: "ms-822eff1f", title: "Complete Kinematics Module", status: "completed" , tasks: [
                  { id: 'biomechanics-course-t1', title: 'Watch 5 hours of video lectures', completed: true },
                  { id: 'biomechanics-course-t2', title: 'Solve 20 practice problems', completed: true },
                  { id: 'biomechanics-course-t3', title: 'Pass weekly quiz with 90%+', completed: true }
                ] },
            { id: "ms-b5f35096", title: "Pass Final Assessment", status: "active" , tasks: [
                  { id: 'ms-b5f35096-t1', title: 'Review all semester notes', completed: true },
                  { id: 'ms-b5f35096-t2', title: 'Take 2 full-length practice exams', completed: false },
                  { id: 'ms-b5f35096-t3', title: 'Achieve passing grade on final', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-soil-whisperer-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-soil-whisperer-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-2367d545", title: "Soil Sampling & Analysis", status: "completed" , tasks: [
                  { id: 'yield-opt-t1', title: 'Collect grid-based soil samples', completed: true },
                  { id: 'yield-opt-t2', title: 'Send samples to agricultural lab', completed: true },
                  { id: 'yield-opt-t3', title: 'Analyze pH and nutrient reports', completed: true }
                ] },
            { id: "ms-2da3dae4", title: "Implement Precision Fertilizer Plan", status: "active" , tasks: [
                  { id: 'ms-2da3dae4-t1', title: 'Upload prescription maps to tractor GPS', completed: true },
                  { id: 'ms-2da3dae4-t2', title: 'Calibrate application equipment', completed: false },
                  { id: 'ms-2da3dae4-t3', title: 'Execute variable rate application', completed: false }
                ] },
            { id: "ms-be08456c", title: "Harvest Yield Analysis", status: "pending" , tasks: [
                  { id: 'ms-be08456c-t1', title: 'Download yield monitor data', completed: true },
                  { id: 'ms-be08456c-t2', title: 'Identify high and low performing zones', completed: false },
                  { id: 'ms-be08456c-t3', title: 'Plan adjustments for next season', completed: false }
                ] }
          ]
        },
        {
          id: "regen-ag",
          title: "Pilot Regenerative Ag Program",
          type: "professional",
          milestones: [
            { id: "ms-ad71ec08", title: "Select Test Plots", status: "completed" , tasks: [
                  { id: 'regen-ag-t1', title: 'Identify representative acreage', completed: true },
                  { id: 'regen-ag-t2', title: 'Stake out plot boundaries', completed: true },
                  { id: 'regen-ag-t3', title: 'Establish control group plot', completed: true }
                ] },
            { id: "ms-044f3b5e", title: "Plant Cover Crops", status: "active" , tasks: [
                  { id: 'ms-044f3b5e-t1', title: 'Select optimal seed mix', completed: true },
                  { id: 'ms-044f3b5e-t2', title: 'Calibrate drill seeder', completed: false },
                  { id: 'ms-044f3b5e-t3', title: 'Ensure proper seed-to-soil contact', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-real-estate-maven-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-real-estate-maven-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-c04f88df", title: "Land Acquisition", status: "completed" , tasks: [
                  { id: 'downtown-revival-t1', title: 'Identify 3 potential greenfield sites', completed: true },
                  { id: 'downtown-revival-t2', title: 'Conduct phase 1 environmental survey', completed: true },
                  { id: 'downtown-revival-t3', title: 'Close escrow on final property', completed: true }
                ] },
            { id: "ms-f65b5806", title: "Zoning & Entitlements", status: "active" , tasks: [
                  { id: 'ms-f65b5806-t1', title: 'Submit rezoning application', completed: true },
                  { id: 'ms-f65b5806-t2', title: 'Attend public hearings', completed: false },
                  { id: 'ms-f65b5806-t3', title: 'Obtain final building permits', completed: false }
                ] },
            { id: "ms-611f18e7", title: "Secure Anchor Tenant", status: "pending" , tasks: [
                  { id: 'ms-611f18e7-t1', title: 'Pitch to Fortune 500 logistics firms', completed: true },
                  { id: 'ms-611f18e7-t2', title: 'Negotiate triple-net lease terms', completed: false },
                  { id: 'ms-611f18e7-t3', title: 'Sign letter of intent', completed: false }
                ] }
          ]
        },
        {
          id: "green-cert",
          title: "LEED Platinum Portfolio",
          type: "professional",
          milestones: [
            { id: "ms-8f6ba5e9", title: "Retrofit HVAC Systems", status: "completed" , tasks: [
                  { id: 'green-cert-t1', title: 'Remove outdated R-22 units', completed: true },
                  { id: 'green-cert-t2', title: 'Install high-efficiency VRF systems', completed: true },
                  { id: 'green-cert-t3', title: 'Commission new smart thermostats', completed: true }
                ] },
            { id: "ms-4588ba4e", title: "Install Solar Arrays", status: "active" , tasks: [
                  { id: 'ms-4588ba4e-t1', title: 'Conduct roof structural analysis', completed: true },
                  { id: 'ms-4588ba4e-t2', title: 'Install mounting hardware and panels', completed: false },
                  { id: 'ms-4588ba4e-t3', title: 'Connect inverters to main grid', completed: false }
                ] }
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
