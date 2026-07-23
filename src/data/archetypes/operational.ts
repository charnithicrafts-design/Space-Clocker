import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const operationalProfiles: Archetype[] = [
  {
    id: "compliance-sentinel",
    icon: "ShieldCheck",
    title: "The Compliance Sentinel",
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
            { id: "m1", title: "Site A Pre-Assessment", status: "completed" },
            { id: "m2", title: "Remediation Follow-ups", status: "in-progress" },
            { id: "m3", title: "Final Board Report Submission", status: "pending" }
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
          id: "void-oversight",
          title: "Regulatory Oversight Lag",
          description: "Delays in implementing newly legislated mandates across subsidiary units.",
          impact: "high",
          engagedCount: 3,
          maxAllowed: 0
        },
        {
          id: "void-documentation",
          title: "Fragmented Evidence Trails",
          description: "Inconsistent documentation standards leading to audit vulnerabilities.",
          impact: "medium",
          engagedCount: 5,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "supply-chain-overlord",
    icon: "Globe",
    title: "The Supply Chain Overlord",
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
            { id: "m1", title: "Vendor Renegotiations", status: "completed" },
            { id: "m2", title: "Route Algorithm Update", status: "in-progress" },
            { id: "m3", title: "Carbon Offset Integration", status: "pending" }
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
          id: "void-bottleneck",
          title: "Critical Node Congestion",
          description: "Severe delays at major trans-shipment hubs causing cascading timeline failures.",
          impact: "high",
          engagedCount: 4,
          maxAllowed: 0
        },
        {
          id: "void-supplier-risk",
          title: "Tier-2 Supplier Instability",
          description: "Lack of visibility into upstream component availability.",
          impact: "medium",
          engagedCount: 2,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "financial-navigator",
    icon: "Calculator",
    title: "The Financial Navigator",
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
            { id: "m1", title: "Current Structure Assessment", status: "completed" },
            { id: "m2", title: "Transfer Pricing Policy Update", status: "in-progress" },
            { id: "m3", title: "Implementation of New Holding Structure", status: "pending" }
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
          id: "void-exposure",
          title: "Unmitigated Tax Exposure",
          description: "Potential penalties due to misaligned intercompany pricing policies.",
          impact: "high",
          engagedCount: 2,
          maxAllowed: 0
        },
        {
          id: "void-data-silo",
          title: "Financial Data Discrepancy",
          description: "Inconsistencies between operational reporting and statutory ledgers.",
          impact: "medium",
          engagedCount: 6,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "numeric-oracle",
    icon: "ChartLine",
    title: "The Numeric Oracle",
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
            { id: "m1", title: "Historical Data Ingestion", status: "completed" },
            { id: "m2", title: "Stochastic Model Calibration", status: "completed" },
            { id: "m3", title: "Peer Review and Validation", status: "in-progress" }
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
          id: "void-model-drift",
          title: "Predictive Model Drift",
          description: "Divergence of model predictions from emerging real-world claim frequencies.",
          impact: "high",
          engagedCount: 1,
          maxAllowed: 0
        },
        {
          id: "void-data-latency",
          title: "Actuarial Data Latency",
          description: "Delays in receiving validated claims data for model recalibration.",
          impact: "medium",
          engagedCount: 4,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "yield-maximizer",
    icon: "FlaskConical",
    title: "The Yield Maximizer",
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
            { id: "m1", title: "Pilot Plant Trials", status: "completed" },
            { id: "m2", title: "Thermodynamic Modeling", status: "in-progress" },
            { id: "m3", title: "Full Scale Implementation", status: "pending" }
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
          id: "void-contamination",
          title: "Micro-Contamination Risk",
          description: "Trace impurities detected in solvent recovery loop threatening API stability.",
          impact: "high",
          engagedCount: 2,
          maxAllowed: 0
        },
        {
          id: "void-energy-inefficiency",
          title: "Thermal Loss Variance",
          description: "Unexplained energy loss in the distillation column reducing overall process efficiency.",
          impact: "medium",
          engagedCount: 3,
          maxAllowed: 0
        }
      ]
    }
  }
];
