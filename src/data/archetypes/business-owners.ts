import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const businessOwnerProfiles: Archetype[] = [
  {
    id: "wellness-visionary",
    icon: "🌸",
    title: "The Wellness Visionary",
    subtitle: "Chloe | Luxury Spa & Salon Owner",
    vibe: "Serene, opulent, and rejuvenating.",
    data: {
      profile: {
        name: "Chloe",
        level: 34,
        xp: 55000,
        title: "Wellness Visionary"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 45,
        tasksCompleted: 420,
        totalFocusHours: 510
      },
      ambitions: [
        {
          id: "open-second-location",
          title: "Open a Second Luxury Location",
          description: "Expand the brand to a prime downtown spot.",
          milestones: [
            { id: "m1", title: "Secure commercial lease", completed: true },
            { id: "m2", title: "Finalize interior design plans", completed: false },
            { id: "m3", title: "Hire flagship manager", completed: false }
          ]
        },
        {
          id: "launch-skincare-line",
          title: "Launch Proprietary Skincare Line",
          description: "Develop and market an organic, in-house product line.",
          milestones: [
            { id: "m4", title: "Finalize formulations with lab", completed: true },
            { id: "m5", title: "Design packaging and branding", completed: false },
            { id: "m6", title: "Host launch party", completed: false }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "wellness-visionary",
          "open-second-location",
          [
            "Review Q3 P&L statements",
            "Interview candidates for lead aesthetician",
            "Negotiate lease terms with downtown property manager",
            "Approve new massage oil blends",
            "Meet with marketing agency for rebrand",
            "Update employee handbook",
            "Order fresh linens for all treatment rooms",
            "Conduct monthly staff training on new facial techniques",
            "Reconcile payroll for last month",
            "Audit inventory of retail products",
            "Respond to VIP client feedback",
            "Plan holiday promotion campaign",
            "Meet with interior designer for new location",
            "Renew state cosmetology licenses",
            "Evaluate new spa management software"
          ],
          420
        ),
        {
          id: "task-today-1",
          title: "Approve final packaging mockups for skincare line",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          ambitionId: "launch-skincare-line"
        },
        {
          id: "task-today-2",
          title: "1-on-1 performance review with Spa Manager",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday()
        },
        {
          id: "task-today-3",
          title: "Review contractor bids for downtown location buildout",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          ambitionId: "open-second-location"
        }
      ],
      voids: [
        {
          id: "void-staff-shortage",
          title: "Weekend Staff Shortage",
          description: "Two senior therapists called out on a fully booked Saturday.",
          impact: "high",
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: "void-supply-delay",
          title: "Signature Oil Delay",
          description: "Supply chain issues holding up our most requested massage oil.",
          impact: "medium",
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "culinary-maestro",
    icon: "🍳",
    title: "The Culinary Maestro",
    subtitle: "Chef Diego | Restaurant Owner & Head Chef",
    vibe: "Passionate, fast-paced, and exquisite.",
    data: {
      profile: {
        name: "Diego",
        level: 40,
        xp: 78000,
        title: "Culinary Maestro"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 82,
        tasksCompleted: 750,
        totalFocusHours: 920
      },
      ambitions: [
        {
          id: "michelin-star",
          title: "Achieve a Michelin Star",
          description: "Elevate the dining experience to earn the ultimate culinary accolade.",
          milestones: [
            { id: "m1", title: "Refine seasonal tasting menu", completed: true },
            { id: "m2", title: "Upgrade wine pairing program", completed: false },
            { id: "m3", title: "Perfect front-of-house service standards", completed: false }
          ]
        },
        {
          id: "second-concept",
          title: "Expand to a Second Concept",
          description: "Open a casual, high-volume sister restaurant.",
          milestones: [
            { id: "m4", title: "Secure financing", completed: true },
            { id: "m5", title: "Sign lease for new space", completed: true },
            { id: "m6", title: "Menu development for new concept", completed: false }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "culinary-maestro",
          "michelin-star",
          [
            "Prep stations for Friday dinner service",
            "Negotiate pricing with local wagyu supplier",
            "Cost out the new spring tasting menu",
            "Conduct wine tasting with the sommelier",
            "Interview new sous chef candidates",
            "Fix the broken immersion circulator",
            "Review health inspection report",
            "Update POS system pricing",
            "Plan special private dining event menu",
            "Train line cooks on the new plating standards",
            "Review monthly food cost percentages",
            "Forage for wild mushrooms with local supplier",
            "Draft press release for the new menu launch",
            "Audit walk-in fridge for inventory freshness",
            "Meet with investors regarding second location"
          ],
          750
        ),
        {
          id: "task-today-1",
          title: "Finalize wine pairings for the new tasting menu",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          ambitionId: "michelin-star"
        },
        {
          id: "task-today-2",
          title: "Meet with architect for the new casual concept layout",
          status: "pending",
          priority: "medium",
          duration: 60,
          date: getToday(),
          ambitionId: "second-concept"
        },
        {
          id: "task-today-3",
          title: "Inspect fresh seafood delivery and portioning",
          status: "pending",
          priority: "high",
          duration: 45,
          date: getToday()
        }
      ],
      voids: [
        {
          id: "void-freezer-failure",
          title: "Walk-in Freezer Failure",
          description: "Compressor died during a busy Friday dinner prep.",
          impact: "high",
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: "void-supplier-bankrupt",
          title: "Key Supplier Bankrupt",
          description: "Our exclusive truffle supplier suddenly went out of business.",
          impact: "medium",
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "retail-trailblazer",
    icon: "🏪",
    title: "The Retail Trailblazer",
    subtitle: "Zoe | Boutique E-Commerce & Storefront Owner",
    vibe: "Trendy, data-driven, and chic.",
    data: {
      profile: {
        name: "Zoe",
        level: 28,
        xp: 35000,
        title: "Retail Trailblazer"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 30,
        tasksCompleted: 310,
        totalFocusHours: 350
      },
      ambitions: [
        {
          id: "hit-1m-arr",
          title: "Hit $1M in Annual Revenue",
          description: "Scale both e-commerce and physical storefront sales.",
          milestones: [
            { id: "m1", title: "Optimize online conversion rate", completed: true },
            { id: "m2", title: "Launch influencer affiliate program", completed: false },
            { id: "m3", title: "Expand wholesale partnerships", completed: false }
          ]
        },
        {
          id: "intl-shipping",
          title: "Launch International Shipping",
          description: "Expand customer base beyond domestic borders.",
          milestones: [
            { id: "m4", title: "Negotiate international carrier rates", completed: true },
            { id: "m5", title: "Implement customs and duties calculator at checkout", completed: false },
            { id: "m6", title: "Run targeted ad campaigns in UK & Australia", completed: false }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "retail-trailblazer",
          "hit-1m-arr",
          [
            "Analyze last month's Shopify conversion metrics",
            "Style mannequins for the new seasonal window display",
            "Negotiate lower processing fees with payment gateway",
            "Review fabric swatches for the upcoming fall collection",
            "Restock top-selling denim SKUs",
            "Plan content calendar for Instagram and TikTok",
            "Train new part-time sales associates",
            "Conduct quarterly physical inventory count",
            "Send out email newsletter for VIP customers",
            "Evaluate ROAS on Facebook ad campaigns",
            "Update product descriptions for SEO",
            "Process customer returns and exchanges",
            "Meet with wholesale buyers from regional boutiques",
            "Draft brief for the holiday photoshoot",
            "Review packaging costs and reorder custom mailers"
          ],
          310
        ),
        {
          id: "task-today-1",
          title: "Test the new international checkout flow on staging",
          status: "pending",
          priority: "high",
          duration: 45,
          date: getToday(),
          ambitionId: "intl-shipping"
        },
        {
          id: "task-today-2",
          title: "Approve influencer collabs for Q3",
          status: "pending",
          priority: "medium",
          duration: 60,
          date: getToday(),
          ambitionId: "hit-1m-arr"
        },
        {
          id: "task-today-3",
          title: "Reorganize the stockroom for incoming spring inventory",
          status: "pending",
          priority: "medium",
          duration: 90,
          date: getToday()
        }
      ],
      voids: [
        {
          id: "void-site-crash",
          title: "E-Commerce Site Crash",
          description: "Server went down for two hours during the Black Friday launch.",
          impact: "high",
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: "void-shipment-delay",
          title: "Spring Collection Delay",
          description: "A cargo ship delay pushed back the entire spring line launch by 3 weeks.",
          impact: "medium",
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "urban-botanist",
    icon: "🌿",
    title: "The Urban Botanist",
    subtitle: "Maya | Landscape Architecture Firm Owner",
    vibe: "Earthy, structural, and sustainable.",
    data: {
      profile: {
        name: "Maya",
        level: 31,
        xp: 42000,
        title: "Urban Botanist"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 55,
        tasksCompleted: 450,
        totalFocusHours: 600
      },
      ambitions: [
        {
          id: "city-green-space",
          title: "Win City Green Space Initiative",
          description: "Secure the massive multi-million dollar city contract for park revitalization.",
          milestones: [
            { id: "m1", title: "Submit initial design proposal", completed: true },
            { id: "m2", title: "Pass environmental impact review", completed: false },
            { id: "m3", title: "Present final pitch to city council", completed: false }
          ]
        },
        {
          id: "publish-book",
          title: "Publish Sustainable Landscaping Book",
          description: "Author a coffee-table book on drought-resistant urban gardens.",
          milestones: [
            { id: "m4", title: "Secure publishing deal", completed: true },
            { id: "m5", title: "Finish writing manuscript", completed: false },
            { id: "m6", title: "Complete photography for all featured gardens", completed: false }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "urban-botanist",
          "city-green-space",
          [
            "Draft initial sketches for the downtown plaza project",
            "Calculate soil requirements for the new commercial rooftop garden",
            "Meet with wholesale nurseries to source native plants",
            "Review topographical surveys for the suburban park",
            "Approve irrigation system blueprints",
            "Submit permitting applications to the city zoning board",
            "Conduct site visit for the ongoing residential estate project",
            "Update 3D renderings for client presentation",
            "Renew liability insurance for the firm",
            "Interview freelance CAD drafters",
            "Write the chapter on xeriscaping for the book",
            "Reconcile project budgets for Q1",
            "Source sustainable hardscape materials from local quarries",
            "Respond to an RFP for a corporate campus redesign",
            "Coordinate with general contractors on installation timelines"
          ],
          450
        ),
        {
          id: "task-today-1",
          title: "Finalize the 3D walkthrough for the city council presentation",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          ambitionId: "city-green-space"
        },
        {
          id: "task-today-2",
          title: "Review chapter 4 edits from the publisher",
          status: "pending",
          priority: "medium",
          duration: 60,
          date: getToday(),
          ambitionId: "publish-book"
        },
        {
          id: "task-today-3",
          title: "Site visit for the new rooftop installation",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday()
        }
      ],
      voids: [
        {
          id: "void-flash-flood",
          title: "Flash Flood Washout",
          description: "A sudden storm completely washed away a newly planted commercial project.",
          impact: "high",
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: "void-damaged-plants",
          title: "Damaged Rare Shipment",
          description: "A shipment of expensive, mature Japanese Maples arrived severely damaged.",
          impact: "medium",
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: "event-orchestrator",
    icon: "🎉",
    title: "The Event Orchestrator",
    subtitle: "Sofia | Wedding Planning Agency Owner",
    vibe: "Detail-oriented, glamorous, and flawless.",
    data: {
      profile: {
        name: "Sofia",
        level: 36,
        xp: 61000,
        title: "Event Orchestrator"
      },
      preferences: {
        confirmDelete: true,
        uiMode: "nebula"
      },
      stats: {
        streak: 60,
        tasksCompleted: 580,
        totalFocusHours: 710
      },
      ambitions: [
        {
          id: "vogue-weddings",
          title: "Feature in Vogue Weddings",
          description: "Plan a high-profile wedding that gets a full editorial feature in Vogue.",
          milestones: [
            { id: "m1", title: "Sign a celebrity or high-society client", completed: true },
            { id: "m2", title: "Secure exclusive design and floral partnerships", completed: false },
            { id: "m3", title: "Coordinate with Vogue editorial team for exclusive coverage", completed: false }
          ]
        },
        {
          id: "destination-exclusive",
          title: "Exclusive Destination Weddings",
          description: "Transition the agency to only handle luxury destination weddings.",
          milestones: [
            { id: "m4", title: "Establish partnerships with 5-star European resorts", completed: true },
            { id: "m5", title: "Rebrand the agency website for international luxury", completed: false },
            { id: "m6", title: "Hire a dedicated travel concierge for the team", completed: false }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "event-orchestrator",
          "vogue-weddings",
          [
            "Review catering contracts for the Miller-Smith wedding",
            "Design custom mood boards for the Lake Como destination wedding",
            "Negotiate room blocks with the Ritz-Carlton",
            "Conduct a tasting with the artisanal cake designer",
            "Coordinate logistics for a 300-guest tented reception",
            "Draft run-of-show timeline for the upcoming celebrity wedding",
            "Interview a new day-of coordinator",
            "Update the agency's portfolio on the website",
            "Source vintage crystal glassware for a VIP client",
            "Review floor plans and seating arrangements",
            "Handle a last-minute cancellation from a string quartet",
            "Reconcile vendor invoices from last weekend's event",
            "Meet with the PR firm regarding the Vogue pitch",
            "Finalize the lighting design plot with the AV team",
            "Send thank-you gifts to top referring venues"
          ],
          580
        ),
        {
          id: "task-today-1",
          title: "Pitch call with Vogue editorial contact",
          status: "pending",
          priority: "high",
          duration: 30,
          date: getToday(),
          ambitionId: "vogue-weddings"
        },
        {
          id: "task-today-2",
          title: "Final walkthrough of the coastal venue for this weekend",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday()
        },
        {
          id: "task-today-3",
          title: "Interview candidates for the travel concierge position",
          status: "pending",
          priority: "medium",
          duration: 60,
          date: getToday(),
          ambitionId: "destination-exclusive"
        }
      ],
      voids: [
        {
          id: "void-venue-double-booked",
          title: "Venue Double-Booked",
          description: "Our primary outdoor venue accidentally double-booked the same Saturday.",
          impact: "high",
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: "void-florist-sick",
          title: "Lead Florist Sick",
          description: "The lead floral designer called in sick 24 hours before a massive installation.",
          impact: "medium",
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  }
];
