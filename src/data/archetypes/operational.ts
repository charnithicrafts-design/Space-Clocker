import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const operationalProfiles: Archetype[] = [
  {
    id: "compliance-sentinel",
    icon: "🛡️",
    title: "",
    voids: [
        {
            id: "void-compliance-sentinel-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-compliance-sentinel-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Lead Operational Auditor",
    vibe: "Meticulous, authoritative, process-driven",
    data: {
      profile: {
        name: "Maya",
        title: "Lead Operational Auditor",
        level: 32,
        xp: 45000,
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 42,
        tasksCompleted: 450,
        totalFocusHours: 620
      },
      ambitions: [
        {
          id: "amb-q3-audit",
          title: "Q3 Comprehensive ISO Audit",
          description: "Ensure 100% compliance across all regional manufacturing hubs.",
          status: "in-progress",
          progress: 65,
          milestones: [
            { id: "ms-5b91c4b2", title: "Site A Pre-Assessment: Uncover hidden safety violations", status: "completed" , tasks: [
                  { id: 'amb-q3-audit-t1', title: 'Review historical injury logs', completed: true },
                  { id: 'amb-q3-audit-t2', title: 'Conduct unannounced walkthrough', completed: true },
                  { id: 'amb-q3-audit-t3', title: 'Draft initial hazard report', completed: true }
                ] },
            { id: "ms-42fbecfd", title: "Remediation Follow-ups: Enforce strict compliance mandates", status: "in-progress" , tasks: [
                  { id: 'ms-42fbecfd-t1', title: 'Verify installation of machine guards', completed: true },
                  { id: 'ms-42fbecfd-t2', title: 'Review updated training records', completed: false },
                  { id: 'ms-42fbecfd-t3', title: 'Close out all critical action items', completed: false }
                ] },
            { id: "ms-cb032225", title: "Final Board Report: Present zero-liability audit results", status: "pending" , tasks: [
                  { id: 'ms-cb032225-t1', title: 'Compile final compliance metrics', completed: true },
                  { id: 'ms-cb032225-t2', title: 'Draft executive risk summary', completed: false },
                  { id: 'ms-cb032225-t3', title: 'Present findings to safety committee', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "t-hist",
          "amb-q3-audit",
          [
            "Review updated safety protocols for Plant B",
            "Cross-reference local labor laws against corporate policy",
            "Interview facility management regarding incident reporting",
            "Draft preliminary findings for Q2 discrepancies",
            "Validate compliance training completion records",
            "Analyze vendor compliance certifications",
            "Conduct mock audit of data privacy controls",
            "Reconcile inventory logs with procurement data",
            "Assess environmental impact reporting accuracy",
            "Update audit checklists for new regulations",
            "Review corrective action plans from last quarter",
            "Finalize regulatory submissions for EU region"
          ],
          450
        ),
        {
          id: "t-1",
          title: "Consolidate findings for APAC region",
          duration: 120,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-q3-audit"
        },
        {
          id: "t-2",
          title: "Follow up on non-conformity report #884",
          duration: 30,
          type: "admin",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-q3-audit"
        },
        {
          id: "t-3",
          title: "Prepare presentation for executive review",
          duration: 90,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-q3-audit"
        }
      ],
      voids: [
          {
                    id: "v-comp-1",
                    text: "Endless Policy Wordsmithing",
                    description: "Delaying rollouts over minor phrasing",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          },
          {
                    id: "v-comp-2",
                    text: "Micromanaging Discrepancies",
                    description: "Flagging inconsequential variances",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-comp-3",
                    text: "Rabbit-holing in Legacy Sheets",
                    description: "Wasting time in outdated logs",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-comp-1",
                    title: "Passed SOC 2 Type II Audit",
                    date: "2023-03-20",
                    type: "success",
                    category: "milestone",
                    description: "Led the organization through a flawless audit with zero exceptions.",
                    skills: [
                              "Audit Prep",
                              "Policy Enforcement"
                    ]
          },
          {
                    id: "hist-comp-2",
                    title: "Implemented Automated Compliance Dashboard",
                    date: "2024-08-15",
                    type: "success",
                    category: "project",
                    description: "Replaced manual spreadsheet checks with real-time API monitoring.",
                    skills: [
                              "Risk Management",
                              "Data Visualization"
                    ]
          },
          {
                    id: "hist-comp-3",
                    title: "Certified Information Systems Auditor (CISA)",
                    date: "2025-05-10",
                    type: "success",
                    category: "certification",
                    description: "Achieved global recognition as an expert in IS audit control.",
                    skills: [
                              "IT Governance",
                              "Security Protocols"
                    ]
          }
]
    }
  },
  {
    id: "supply-chain-overlord",
    icon: "🌍",
    title: "",
    voids: [
        {
            id: "void-supply-chain-overlord-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-supply-chain-overlord-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Global Logistics Director",
    vibe: "Strategic, adaptive, efficiency-focused",
    data: {
      profile: {
        name: "Ken",
        title: "Global Logistics Director",
        level: 38,
        xp: 65000,
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 85,
        tasksCompleted: 610,
        totalFocusHours: 850
      },
      ambitions: [
        {
          id: "amb-logistics-opt",
          title: "Global Freight Network Optimization",
          description: "Reduce transit times by 15% and cut emissions across main shipping routes.",
          status: "in-progress",
          progress: 55,
          milestones: [
            { id: "ms-e6b92aec", title: "Vendor Renegotiations", status: "completed" , tasks: [
                  { id: 'amb-logistics-opt-t1', title: 'Analyze past 12 months of spend', completed: true },
                  { id: 'amb-logistics-opt-t2', title: 'Send RFPs to top 3 competitors', completed: true },
                  { id: 'amb-logistics-opt-t3', title: 'Sign new SLA with 15% cost reduction', completed: true }
                ] },
            { id: "ms-86f0e011", title: "Route Algorithm Update", status: "in-progress" , tasks: [
                  { id: 'ms-86f0e011-t1', title: 'Analyze historical delivery times', completed: true },
                  { id: 'ms-86f0e011-t2', title: 'Deploy new traveling salesman algorithm', completed: false },
                  { id: 'ms-86f0e011-t3', title: 'Monitor driver satisfaction metrics', completed: false }
                ] },
            { id: "ms-6bd0d3c3", title: "Carbon Offset Integration", status: "pending" , tasks: [
                  { id: 'ms-6bd0d3c3-t1', title: 'Calculate total fleet emissions', completed: true },
                  { id: 'ms-6bd0d3c3-t2', title: 'Select verified carbon offset partner', completed: false },
                  { id: 'ms-6bd0d3c3-t3', title: 'Launch carbon-neutral shipping option', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "t-hist",
          "amb-logistics-opt",
          [
            "Analyze Q2 freight expenditure reports",
            "Negotiate volume discounts with trans-Pacific carriers",
            "Evaluate alternative warehouse locations in Eastern Europe",
            "Review customs delay incident logs",
            "Model impact of fuel surcharge increases",
            "Audit third-party logistics provider SLAs",
            "Coordinate emergency rerouting for delayed shipments",
            "Assess packaging material sustainability",
            "Draft RFP for new regional distribution center",
            "Update demand forecasting models based on recent sales",
            "Reconcile discrepancies in inventory transit logs"
          ],
          610
        ),
        {
          id: "t-1",
          title: "Review predictive analytics for Q4 shipping volume",
          duration: 90,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-logistics-opt"
        },
        {
          id: "t-2",
          title: "Approve updated carrier contracts",
          duration: 45,
          type: "admin",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-logistics-opt"
        },
        {
          id: "t-3",
          title: "Sync with APAC logistics head regarding port congestion",
          duration: 60,
          type: "collaboration",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-logistics-opt"
        }
      ],
      voids: [
          {
                    id: "v-sup-1",
                    text: "Obsessive Tracking Refresh",
                    description: "Checking freight status every 5 mins",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          },
          {
                    id: "v-sup-2",
                    text: "Over-analyzing Freight Margins",
                    description: "Losing days over pennies per mile",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-sup-3",
                    text: "Engaging in Vendor Blame Games",
                    description: "Arguing instead of problem-solving",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-sup-1",
                    title: "Resolved Suez Canal Delay Crisis",
                    date: "2023-04-05",
                    type: "success",
                    category: "milestone",
                    description: "Rerouted millions in inventory to avoid a catastrophic stockout.",
                    skills: [
                              "Crisis Management",
                              "Global Logistics"
                    ]
          },
          {
                    id: "hist-sup-2",
                    title: "Negotiated 15% Freight Cost Reduction",
                    date: "2024-11-20",
                    type: "success",
                    category: "project",
                    description: "Consolidated shipping lanes and negotiated bulk rates with new carriers.",
                    skills: [
                              "Negotiation",
                              "Cost Analysis"
                    ]
          },
          {
                    id: "hist-sup-3",
                    title: "Launched Zero-Carbon Logistics Initiative",
                    date: "2025-09-12",
                    type: "success",
                    category: "project",
                    description: "Transitioned 30% of last-mile deliveries to electric fleets.",
                    skills: [
                              "Sustainability",
                              "Fleet Management"
                    ]
          }
]
    }
  },
  {
    id: "financial-navigator",
    icon: "🧮",
    title: "",
    voids: [
        {
            id: "void-financial-navigator-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-financial-navigator-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Corporate Tax Auditor",
    vibe: "Analytical, precise, detail-oriented",
    data: {
      profile: {
        name: "Raj",
        title: "Corporate Tax Auditor",
        level: 28,
        xp: 35000,
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 60,
        tasksCompleted: 340,
        totalFocusHours: 510
      },
      ambitions: [
        {
          id: "amb-tax-restructure",
          title: "Cross-Border Entity Restructuring",
          description: "Optimize corporate tax strategy to leverage new international trade agreements.",
          status: "in-progress",
          progress: 40,
          milestones: [
            { id: "ms-36a42859", title: "Current Structure Assessment", status: "completed" , tasks: [
                  { id: 'amb-tax-restructure-t1', title: 'Map out all international subsidiaries', completed: true },
                  { id: 'amb-tax-restructure-t2', title: 'Analyze current tax burden', completed: true },
                  { id: 'amb-tax-restructure-t3', title: 'Identify high-risk jurisdictions', completed: true }
                ] },
            { id: "ms-5eb964cd", title: "Transfer Pricing Policy Update", status: "in-progress" , tasks: [
                  { id: 'ms-5eb964cd-t1', title: 'Conduct benchmark economic analysis', completed: true },
                  { id: 'ms-5eb964cd-t2', title: 'Draft new intercompany agreements', completed: false },
                  { id: 'ms-5eb964cd-t3', title: 'Review with external legal counsel', completed: false }
                ] },
            { id: "ms-b63246e9", title: "Implementation of New Holding Structure", status: "pending" , tasks: [
                  { id: 'ms-b63246e9-t1', title: 'Incorporate new entities in Ireland', completed: true },
                  { id: 'ms-b63246e9-t2', title: 'Execute asset transfers', completed: false },
                  { id: 'ms-b63246e9-t3', title: 'File required regulatory notices', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "t-hist",
          "amb-tax-restructure",
          [
            "Reconcile Q1 intercompany transactions",
            "Review OECD guidelines updates on digital taxation",
            "Prepare documentation for federal tax audit",
            "Calculate deferred tax assets for European subsidiaries",
            "Draft memo on transfer pricing risk mitigation",
            "Analyze R&D tax credit eligibility across departments",
            "Consolidate local statutory financials",
            "Review impact of new tariffs on supply chain costs",
            "Update tax provision models in ERP system",
            "Audit expense reports for non-deductible items",
            "Coordinate with external legal counsel on IP migration",
            "Prepare quarterly tax estimate filings"
          ],
          340
        ),
        {
          id: "t-1",
          title: "Finalize transfer pricing margins for Q3",
          duration: 120,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-tax-restructure"
        },
        {
          id: "t-2",
          title: "Review subsidiary audit inquiries",
          duration: 60,
          type: "admin",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-tax-restructure"
        },
        {
          id: "t-3",
          title: "Model cash flow impact of proposed tax legislation",
          duration: 90,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-tax-restructure"
        },
        {
          id: "t-4",
          title: "Check local compliance filings status",
          duration: 30,
          type: "admin",
          priority: "low",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-tax-restructure"
        }
      ],
      voids: [
          {
                    id: "v-fin-1",
                    text: "Manual Reconciliation Loops",
                    description: "Refusing to automate standard reconciliations",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-fin-2",
                    text: "Deep-diving Tax Hypotheticals",
                    description: "Researching unlikely tax scenarios",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          },
          {
                    id: "v-fin-3",
                    text: "Tinkering with Complex Macros",
                    description: "Building fragile Excel macros",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-fin-1",
                    title: "Discovered $2M Tax Efficiency",
                    date: "2023-02-14",
                    type: "success",
                    category: "milestone",
                    description: "Found a legal restructuring loophole that saved the company millions.",
                    skills: [
                              "Corporate Tax Law",
                              "Financial Forensics"
                    ]
          },
          {
                    id: "hist-fin-2",
                    title: "Managed Series B Due Diligence",
                    date: "2024-06-30",
                    type: "success",
                    category: "project",
                    description: "Provided flawless financial models for a $50M funding round.",
                    skills: [
                              "Financial Modeling",
                              "M&A Due Diligence"
                    ]
          },
          {
                    id: "hist-fin-3",
                    title: "Chartered Financial Analyst (CFA) Charterholder",
                    date: "2025-08-15",
                    type: "success",
                    category: "certification",
                    description: "Passed Level III of the notoriously difficult CFA exams.",
                    skills: [
                              "Investment Analysis",
                              "Portfolio Management"
                    ]
          }
]
    }
  },
  {
    id: "numeric-oracle",
    icon: "📈",
    title: "",
    voids: [
        {
            id: "void-numeric-oracle-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-numeric-oracle-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Actuarial Modeler",
    vibe: "Calculated, prescient, data-driven",
    data: {
      profile: {
        name: "Chen",
        title: "Actuarial Modeler",
        level: 35,
        xp: 52000,
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 92,
        tasksCompleted: 710,
        totalFocusHours: 920
      },
      ambitions: [
        {
          id: "amb-risk-model",
          title: "Next-Gen Catastrophe Risk Modeling",
          description: "Integrate climate change variables into long-term liability forecasting.",
          status: "in-progress",
          progress: 80,
          milestones: [
            { id: "ms-3e7062a7", title: "Historical Data Ingestion", status: "completed" , tasks: [
                  { id: 'amb-risk-model-t1', title: 'Cleanse 10 years of market data', completed: true },
                  { id: 'amb-risk-model-t2', title: 'Upload to secure AWS S3 bucket', completed: true },
                  { id: 'amb-risk-model-t3', title: 'Verify data integrity against source', completed: true }
                ] },
            { id: "ms-9829f99f", title: "Stochastic Model Calibration", status: "completed" , tasks: [
                  { id: 'ms-9829f99f-t1', title: 'Implement Monte Carlo simulations', completed: true },
                  { id: 'ms-9829f99f-t2', title: 'Backtest model against 2008 crash', completed: true },
                  { id: 'ms-9829f99f-t3', title: 'Tune volatility parameters', completed: true }
                ] },
            { id: "ms-85f55fb1", title: "Peer Review and Validation", status: "in-progress" , tasks: [
                  { id: 'ms-85f55fb1-t1', title: 'Present model to senior quants', completed: true },
                  { id: 'ms-85f55fb1-t2', title: 'Address extreme edge case scenarios', completed: false },
                  { id: 'ms-85f55fb1-t3', title: 'Promote model to production', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "t-hist",
          "amb-risk-model",
          [
            "Run Monte Carlo simulations for hurricane season liabilities",
            "Update mortality tables based on recent demographic studies",
            "Backtest predictive models against last year's claims data",
            "Calibrate stochastic volatility parameters",
            "Draft technical specification for new pricing algorithm",
            "Analyze tail risk exposure in commercial real estate portfolio",
            "Review assumptions for longevity risk transfer",
            "Validate data integrity of external climate datasets",
            "Present preliminary impact analysis to underwriting team",
            "Refine copula models for joint extreme events",
            "Document model limitations and sensitivity analyses",
            "Optimize computational efficiency of simulation engine"
          ],
          710
        ),
        {
          id: "t-1",
          title: "Execute full stress-test simulation suite",
          duration: 180,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-risk-model"
        },
        {
          id: "t-2",
          title: "Review anomalies in output distribution tails",
          duration: 90,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-risk-model"
        },
        {
          id: "t-3",
          title: "Draft executive summary of model findings",
          duration: 60,
          type: "admin",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-risk-model"
        }
      ],
      voids: [
          {
                    id: "v-num-1",
                    text: "Stochastic Parameter Over-tuning",
                    description: "Overfitting the model to noise",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-num-2",
                    text: "Dismissing Qualitative Realities",
                    description: "Ignoring human factors in the data",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-num-3",
                    text: "Formatting Actuarial Tables",
                    description: "Making tables pretty instead of accurate",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-num-1",
                    title: "Predicted Market Correction",
                    date: "2023-10-01",
                    type: "success",
                    category: "milestone",
                    description: "Adjusted risk models 3 weeks before a major tech stock downturn.",
                    skills: [
                              "Predictive Modeling",
                              "Risk Assessment"
                    ]
          },
          {
                    id: "hist-num-2",
                    title: "Built Dynamic Pricing Algorithm",
                    date: "2024-04-20",
                    type: "success",
                    category: "project",
                    description: "Created an ML model that increased overall revenue by 8%.",
                    skills: [
                              "Machine Learning",
                              "Python"
                    ]
          },
          {
                    id: "hist-num-3",
                    title: "Published Paper on Stochastic Volatility",
                    date: "2025-01-12",
                    type: "success",
                    category: "publication",
                    description: "Contributed to the Journal of Quantitative Finance.",
                    skills: [
                              "Quantitative Analysis",
                              "Academic Writing"
                    ]
          }
]
    }
  },
  {
    id: "yield-maximizer",
    icon: "🧪",
    title: "",
    voids: [
        {
            id: "void-yield-maximizer-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-yield-maximizer-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Process Chemical Engineer",
    vibe: "Innovative, systemic, safety-conscious",
    data: {
      profile: {
        name: "Dr. Wei",
        title: "Process Chemical Engineer",
        level: 25,
        xp: 28000,
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 35,
        tasksCompleted: 220,
        totalFocusHours: 350
      },
      ambitions: [
        {
          id: "amb-reactor-upgrade",
          title: "Reactor Phase III Efficiency Upgrade",
          description: "Increase active pharmaceutical ingredient (API) yield by 8% while reducing solvent waste.",
          status: "in-progress",
          progress: 45,
          milestones: [
            { id: "ms-839e893e", title: "Pilot Plant Trials", status: "completed" , tasks: [
                  { id: 'amb-reactor-upgrade-t1', title: 'Scale up formulation to 500L reactor', completed: true },
                  { id: 'amb-reactor-upgrade-t2', title: 'Monitor exotherm and pressure', completed: true },
                  { id: 'amb-reactor-upgrade-t3', title: 'Analyze product purity', completed: true }
                ] },
            { id: "ms-45e1c24a", title: "Thermodynamic Modeling", status: "in-progress" , tasks: [
                  { id: 'ms-45e1c24a-t1', title: 'Calculate heat of reaction', completed: true },
                  { id: 'ms-45e1c24a-t2', title: 'Determine cooling requirements', completed: false },
                  { id: 'ms-45e1c24a-t3', title: 'Design optimal reactor jacket', completed: false }
                ] },
            { id: "ms-eb205bb4", title: "Full Scale Implementation", status: "pending" , tasks: [
                  { id: 'ms-eb205bb4-t1', title: 'Train plant operators on new SOP', completed: true },
                  { id: 'ms-eb205bb4-t2', title: 'Execute first 5000L production run', completed: false },
                  { id: 'ms-eb205bb4-t3', title: 'Sign off on commercial quality batch', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "t-hist",
          "amb-reactor-upgrade",
          [
            "Analyze spectrographic data from Trial Batch 42",
            "Calculate mass transfer coefficients for new catalyst",
            "Review HAZOP documentation for high-pressure vessel",
            "Draft standard operating procedures for solvent recovery",
            "Calibrate temperature sensors in main reactor",
            "Model thermal runaway scenarios",
            "Evaluate purity reports from quality control lab",
            "Design heat exchanger configuration for cooling loop",
            "Troubleshoot pressure drop in filtration unit",
            "Conduct root cause analysis on Batch 39 discoloration",
            "Update process flow diagrams (PFD)",
            "Review environmental emission logs"
          ],
          220
        ),
        {
          id: "t-1",
          title: "Analyze thermodynamic data from pilot run",
          duration: 120,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-reactor-upgrade"
        },
        {
          id: "t-2",
          title: "Update safety data sheets (SDS) for new solvent mix",
          duration: 45,
          type: "admin",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-reactor-upgrade"
        },
        {
          id: "t-3",
          title: "Coordinate with maintenance for sensor recalibration",
          duration: 30,
          type: "collaboration",
          priority: "medium",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-reactor-upgrade"
        },
        {
          id: "t-4",
          title: "Draft yield optimization proposal for review board",
          duration: 90,
          type: "deep-work",
          priority: "high",
          status: "pending",
          scheduledFor: getToday(),
          ambitionId: "amb-reactor-upgrade"
        }
      ],
      voids: [
          {
                    id: "v-yld-1",
                    text: "Chasing 0.1% Yield Optimization",
                    description: "Spending thousands to save pennies",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-yld-2",
                    text: "Over-reading Safety Logs",
                    description: "Finding patterns in random noise",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-yld-3",
                    text: "Fixating on Lab Calibrations",
                    description: "Recalibrating perfectly fine tools",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-yld-1",
                    title: "Reduced Factory Downtime by 40%",
                    date: "2023-05-15",
                    type: "success",
                    category: "milestone",
                    description: "Implemented predictive maintenance sensors on critical machinery.",
                    skills: [
                              "Predictive Maintenance",
                              "IoT"
                    ]
          },
          {
                    id: "hist-yld-2",
                    title: "Achieved ISO 9001 Certification",
                    date: "2024-09-10",
                    type: "success",
                    category: "certification",
                    description: "Led the facility to meet strict international quality management standards.",
                    skills: [
                              "Quality Assurance",
                              "Process Mapping"
                    ]
          },
          {
                    id: "hist-yld-3",
                    title: "Optimized Energy Consumption",
                    date: "2025-07-05",
                    type: "success",
                    category: "project",
                    description: "Redesigned HVAC and lighting schedules to save $500k annually.",
                    skills: [
                              "Energy Management",
                              "Operations Research"
                    ]
          }
]
    }
  }
];
