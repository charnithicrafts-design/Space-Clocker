import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const businessOwnerProfiles: Archetype[] = [
  {
    id: "wellness-visionary",
    icon: "🌸",
    title: "",
    voids: [
        {
            id: "void-wellness-visionary-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-wellness-visionary-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-0156d8cf", title: "Secure Commercial Lease: Negotiate prime downtown foot traffic", completed: true , tasks: [
                  { id: 'open-second-location-t1', title: 'Tour top 5 potential locations', completed: true },
                  { id: 'open-second-location-t2', title: 'Perform foot traffic analysis', completed: true },
                  { id: 'open-second-location-t3', title: 'Sign final 5-year lease agreement', completed: true }
                ] },
            { id: "ms-9fea25c9", title: "Finalize Interior Design: Create an Instagram-worthy aesthetic", completed: false , tasks: [
                  { id: 'ms-9fea25c9-t1', title: 'Consult with local boutique design firm', completed: true },
                  { id: 'ms-9fea25c9-t2', title: 'Select custom lighting fixtures', completed: false },
                  { id: 'ms-9fea25c9-t3', title: 'Approve final 3D renders', completed: false }
                ] },
            { id: "ms-715fcbab", title: "Hire Flagship Manager: Poach top-tier retail talent", completed: false , tasks: [
                  { id: 'ms-715fcbab-t1', title: 'Post discreet job listings on executive boards', completed: true },
                  { id: 'ms-715fcbab-t2', title: 'Interview top 3 candidates', completed: false },
                  { id: 'ms-715fcbab-t3', title: 'Negotiate competitive compensation package', completed: false }
                ] }
          ]
        },
        {
          id: "launch-skincare-line",
          title: "Launch Proprietary Skincare Line",
          description: "Develop and market an organic, in-house product line.",
          milestones: [
            { id: "ms-bb920a56", title: "Finalize formulations with lab", completed: true , tasks: [
                  { id: 'launch-skincare-line-t1', title: 'Review stability testing results', completed: true },
                  { id: 'launch-skincare-line-t2', title: 'Adjust active ingredient concentrations', completed: true },
                  { id: 'launch-skincare-line-t3', title: 'Sign off on final product formula', completed: true }
                ] },
            { id: "ms-ac658b55", title: "Design packaging and branding", completed: false , tasks: [
                  { id: 'ms-ac658b55-t1', title: 'Select eco-friendly packaging suppliers', completed: true },
                  { id: 'ms-ac658b55-t2', title: 'Review color mockups with design agency', completed: false },
                  { id: 'ms-ac658b55-t3', title: 'Order initial prototype batch', completed: false }
                ] },
            { id: "ms-f0f7ecf8", title: "Host launch party", completed: false , tasks: [
                  { id: 'ms-f0f7ecf8-t1', title: 'Secure luxury event venue', completed: true },
                  { id: 'ms-f0f7ecf8-t2', title: 'Send PR packages to top influencers', completed: false },
                  { id: 'ms-f0f7ecf8-t3', title: 'Manage day-of event logistics', completed: false }
                ] }
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
                    id: "v-well-1",
                    text: "Micro-managing Stylists",
                    description: "Creating a tense atmosphere for clients",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-well-2",
                    text: "Comping Services for Exposure",
                    description: "Giving away treatments to low-tier influencers",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-well-3",
                    text: "Engaging in Vendor Drama",
                    description: "Complaining about product reps",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-well-1",
                    title: "Voted Best Local Spa",
                    date: "2023-12-01",
                    type: "success",
                    category: "award",
                    description: "Won the city-wide reader's choice award for luxury wellness.",
                    skills: [
                              "Customer Experience",
                              "Brand Management"
                    ]
          },
          {
                    id: "hist-well-2",
                    title: "Hit $1M Annual Recurring Revenue",
                    date: "2024-12-31",
                    type: "success",
                    category: "milestone",
                    description: "Reached the seven-figure milestone entirely through organic growth.",
                    skills: [
                              "Business Scaling",
                              "Financial Planning"
                    ]
          },
          {
                    id: "hist-well-3",
                    title: "Launched In-House Organic Skincare Line",
                    date: "2025-08-20",
                    type: "success",
                    category: "project",
                    description: "Successfully formulated and sold out the first batch of branded products.",
                    skills: [
                              "Product Development",
                              "Marketing"
                    ]
          }
]
    }
  },
  {
    id: "culinary-maestro",
    icon: "🍳",
    title: "",
    voids: [
        {
            id: "void-culinary-maestro-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-culinary-maestro-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-23b1882b", title: "Refine seasonal tasting menu", completed: true , tasks: [
                  { id: 'michelin-star-t1', title: 'Source seasonal local ingredients', completed: true },
                  { id: 'michelin-star-t2', title: 'Test pairings with sommelier', completed: true },
                  { id: 'michelin-star-t3', title: 'Finalize menu pricing and layout', completed: true }
                ] },
            { id: "ms-55002f83", title: "Upgrade wine pairing program", completed: false , tasks: [
                  { id: 'ms-55002f83-t1', title: 'Attend regional wine tasting events', completed: true },
                  { id: 'ms-55002f83-t2', title: 'Negotiate with exclusive distributors', completed: false },
                  { id: 'ms-55002f83-t3', title: 'Train staff on new tasting notes', completed: false }
                ] },
            { id: "ms-73bf4d22", title: "Perfect front-of-house service standards", completed: false , tasks: [
                  { id: 'ms-73bf4d22-t1', title: 'Conduct role-playing service drills', completed: true },
                  { id: 'ms-73bf4d22-t2', title: 'Review customer feedback metrics', completed: false },
                  { id: 'ms-73bf4d22-t3', title: 'Implement secret diner program', completed: false }
                ] }
          ]
        },
        {
          id: "second-concept",
          title: "Expand to a Second Concept",
          description: "Open a casual, high-volume sister restaurant.",
          milestones: [
            { id: "ms-b2fcd11b", title: "Secure financing", completed: true , tasks: [
                  { id: 'second-concept-t1', title: 'Prepare detailed financial projections', completed: true },
                  { id: 'second-concept-t2', title: 'Pitch to angel investor syndicate', completed: true },
                  { id: 'second-concept-t3', title: 'Sign term sheet', completed: true }
                ] },
            { id: "ms-59db271d", title: "Sign lease for new space", completed: true , tasks: [
                  { id: 'ms-59db271d-t1', title: 'Review commercial zoning laws', completed: true },
                  { id: 'ms-59db271d-t2', title: 'Negotiate tenant improvement allowance', completed: true },
                  { id: 'ms-59db271d-t3', title: 'Finalize legal lease review', completed: true }
                ] },
            { id: "ms-db79c339", title: "Menu development for new concept", completed: false , tasks: [
                  { id: 'ms-db79c339-t1', title: 'Identify target demographic preferences', completed: true },
                  { id: 'ms-db79c339-t2', title: 'Conduct competitor menu analysis', completed: false },
                  { id: 'ms-db79c339-t3', title: 'Host soft-tasting for investors', completed: false }
                ] }
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
                    id: "v-cul-1",
                    text: "Adding Unnecessary Menu Items",
                    description: "Bloating the menu with complex dishes",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-cul-2",
                    text: "Losing Temper with the Line",
                    description: "Screaming at sous-chefs over plating",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-cul-3",
                    text: "Obsessively Checking Reviews",
                    description: "Refreshing Yelp multiple times a day",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-cul-1",
                    title: "First Michelin Star",
                    date: "2023-10-10",
                    type: "success",
                    category: "award",
                    description: "Awarded a Michelin Star for innovative fusion cuisine.",
                    skills: [
                              "Culinary Arts",
                              "Consistency"
                    ]
          },
          {
                    id: "hist-cul-2",
                    title: "Opened Second Concept Restaurant",
                    date: "2024-05-15",
                    type: "success",
                    category: "milestone",
                    description: "Successfully launched a more casual sister-restaurant downtown.",
                    skills: [
                              "Expansion Strategy",
                              "Menu Design"
                    ]
          },
          {
                    id: "hist-cul-3",
                    title: "Featured in Food & Wine Magazine",
                    date: "2025-02-28",
                    type: "success",
                    category: "publication",
                    description: "Profiled as one of the top rising chefs in the region.",
                    skills: [
                              "PR",
                              "Plating Aesthetics"
                    ]
          }
]
    }
  },
  {
    id: "retail-trailblazer",
    icon: "🏪",
    title: "",
    voids: [
        {
            id: "void-retail-trailblazer-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-retail-trailblazer-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-b9c11bbc", title: "Optimize online conversion rate", completed: true , tasks: [
                  { id: 'hit-1m-arr-t1', title: 'A/B test checkout flow', completed: true },
                  { id: 'hit-1m-arr-t2', title: 'Implement cart abandonment emails', completed: true },
                  { id: 'hit-1m-arr-t3', title: 'Analyze heatmaps for landing page', completed: true }
                ] },
            { id: "ms-e1040ed8", title: "Launch influencer affiliate program", completed: false , tasks: [
                  { id: 'ms-e1040ed8-t1', title: 'Identify 50 brand-aligned creators', completed: true },
                  { id: 'ms-e1040ed8-t2', title: 'Draft commission structure agreements', completed: false },
                  { id: 'ms-e1040ed8-t3', title: 'Ship initial PR boxes', completed: false }
                ] },
            { id: "ms-b1e111eb", title: "Expand wholesale partnerships", completed: false , tasks: [
                  { id: 'ms-b1e111eb-t1', title: 'Pitch to regional boutique retailers', completed: true },
                  { id: 'ms-b1e111eb-t2', title: 'Design B2B wholesale catalog', completed: false },
                  { id: 'ms-b1e111eb-t3', title: 'Fulfill first major purchase order', completed: false }
                ] }
          ]
        },
        {
          id: "intl-shipping",
          title: "Launch International Shipping",
          description: "Expand customer base beyond domestic borders.",
          milestones: [
            { id: "ms-f7fc874a", title: "Negotiate international carrier rates", completed: true , tasks: [
                  { id: 'intl-shipping-t1', title: 'Compare DHL and FedEx enterprise rates', completed: true },
                  { id: 'intl-shipping-t2', title: 'Integrate carrier APIs', completed: true },
                  { id: 'intl-shipping-t3', title: 'Perform test shipments to EU', completed: true }
                ] },
            { id: "ms-08daa3fe", title: "Implement customs and duties calculator at checkout", completed: false , tasks: [
                  { id: 'ms-08daa3fe-t1', title: 'Install cross-border compliance plugin', completed: true },
                  { id: 'ms-08daa3fe-t2', title: 'Map product HS codes', completed: false },
                  { id: 'ms-08daa3fe-t3', title: 'Test localized tax calculations', completed: false }
                ] },
            { id: "ms-e9bdf96d", title: "Run targeted ad campaigns in UK & Australia", completed: false , tasks: [
                  { id: 'ms-e9bdf96d-t1', title: 'Localize ad copy for regional dialects', completed: true },
                  { id: 'ms-e9bdf96d-t2', title: 'Set up regional retargeting pixels', completed: false },
                  { id: 'ms-e9bdf96d-t3', title: 'Analyze initial ROAS', completed: false }
                ] }
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
                    id: "v-ret-1",
                    text: "Over-ordering Unproven Trends",
                    description: "Buying massive stock of a viral item",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-ret-2",
                    text: "Competitor Doomscrolling",
                    description: "Analyzing competitor Instagram grids",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-ret-3",
                    text: "Manually Packing Orders",
                    description: "Refusing to delegate fulfillment",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-ret-1",
                    title: "Surpassed 100k Instagram Followers",
                    date: "2023-07-22",
                    type: "success",
                    category: "milestone",
                    description: "Built a massive organic audience for the boutique's style guide.",
                    skills: [
                              "Social Media Marketing",
                              "Community Building"
                    ]
          },
          {
                    id: "hist-ret-2",
                    title: "Secured Exclusive Distribution Rights",
                    date: "2024-04-10",
                    type: "success",
                    category: "project",
                    description: "Became the sole regional distributor for a highly sought-after European brand.",
                    skills: [
                              "Negotiation",
                              "B2B Sales"
                    ]
          },
          {
                    id: "hist-ret-3",
                    title: "Record-Breaking Black Friday Sales",
                    date: "2025-11-28",
                    type: "success",
                    category: "milestone",
                    description: "Cleared out old inventory and generated record profits in a single weekend.",
                    skills: [
                              "Inventory Management",
                              "Campaign Execution"
                    ]
          }
]
    }
  },
  {
    id: "urban-botanist",
    icon: "🌿",
    title: "",
    voids: [
        {
            id: "void-urban-botanist-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-urban-botanist-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-84e1617e", title: "Submit initial design proposal", completed: true , tasks: [
                  { id: 'city-green-space-t1', title: 'Draft preliminary mood boards', completed: true },
                  { id: 'city-green-space-t2', title: 'Create 3D spatial renders', completed: true },
                  { id: 'city-green-space-t3', title: 'Present concept to stakeholders', completed: true }
                ] },
            { id: "ms-3a48e68d", title: "Pass environmental impact review", completed: false , tasks: [
                  { id: 'ms-3a48e68d-t1', title: 'Hire independent environmental consultant', completed: true },
                  { id: 'ms-3a48e68d-t2', title: 'Submit revised drainage plan', completed: false },
                  { id: 'ms-3a48e68d-t3', title: 'Receive municipal clearance', completed: false }
                ] },
            { id: "ms-97fc8ca1", title: "Present final pitch to city council", completed: false , tasks: [
                  { id: 'ms-97fc8ca1-t1', title: 'Prepare interactive architectural model', completed: true },
                  { id: 'ms-97fc8ca1-t2', title: 'Rehearse presentation with PR team', completed: false },
                  { id: 'ms-97fc8ca1-t3', title: 'Address community feedback in town hall', completed: false }
                ] }
          ]
        },
        {
          id: "publish-book",
          title: "Publish Sustainable Landscaping Book",
          description: "Author a coffee-table book on drought-resistant urban gardens.",
          milestones: [
            { id: "ms-c62c016b", title: "Secure publishing deal", completed: true , tasks: [
                  { id: 'publish-book-t1', title: 'Refine query letter', completed: true },
                  { id: 'publish-book-t2', title: 'Pitch to top 5 literary agents', completed: true },
                  { id: 'publish-book-t3', title: 'Negotiate advance and royalties', completed: true }
                ] },
            { id: "ms-82c4b0dd", title: "Finish writing manuscript", completed: false , tasks: [
                  { id: 'ms-82c4b0dd-t1', title: 'Complete final structural edit', completed: true },
                  { id: 'ms-82c4b0dd-t2', title: 'Run professional proofreading pass', completed: false },
                  { id: 'ms-82c4b0dd-t3', title: 'Submit final draft to editor', completed: false }
                ] },
            { id: "ms-34109e0a", title: "Complete photography for all featured gardens", completed: false , tasks: [
                  { id: 'ms-34109e0a-t1', title: 'Scout optimal lighting at locations', completed: true },
                  { id: 'ms-34109e0a-t2', title: 'Conduct multi-day photo shoots', completed: false },
                  { id: 'ms-34109e0a-t3', title: 'Curate final 100 images for print', completed: false }
                ] }
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
    title: "",
    voids: [
        {
            id: "void-event-orchestrator-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-event-orchestrator-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
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
            { id: "ms-06c9cb84", title: "Sign a celebrity or high-society client", completed: true , tasks: [
                  { id: 'vogue-weddings-t1', title: 'Leverage high-net-worth network', completed: true },
                  { id: 'vogue-weddings-t2', title: 'Present customized luxury portfolio', completed: true },
                  { id: 'vogue-weddings-t3', title: 'Finalize NDA and service agreement', completed: true }
                ] },
            { id: "ms-6783605f", title: "Secure exclusive design and floral partnerships", completed: false , tasks: [
                  { id: 'ms-6783605f-t1', title: 'Meet with elite regional florists', completed: true },
                  { id: 'ms-6783605f-t2', title: 'Negotiate wholesale priority access', completed: false },
                  { id: 'ms-6783605f-t3', title: 'Draft exclusivity contracts', completed: false }
                ] },
            { id: "ms-ed3ba7fa", title: "Coordinate with Vogue editorial team for exclusive coverage", completed: false , tasks: [
                  { id: 'ms-ed3ba7fa-t1', title: 'Pitch exclusive editorial angle', completed: true },
                  { id: 'ms-ed3ba7fa-t2', title: 'Provide high-res event sneak peeks', completed: false },
                  { id: 'ms-ed3ba7fa-t3', title: 'Coordinate day-of press access', completed: false }
                ] }
          ]
        },
        {
          id: "destination-exclusive",
          title: "Exclusive Destination Weddings",
          description: "Transition the agency to only handle luxury destination weddings.",
          milestones: [
            { id: "ms-4bf54c69", title: "Establish partnerships with 5-star European resorts", completed: true , tasks: [
                  { id: 'destination-exclusive-t1', title: 'Fly to Europe for site inspections', completed: true },
                  { id: 'destination-exclusive-t2', title: 'Negotiate preferred agency rates', completed: true },
                  { id: 'destination-exclusive-t3', title: 'Sign mutual referral agreements', completed: true }
                ] },
            { id: "ms-85fbdd0b", title: "Rebrand the agency website for international luxury", completed: false , tasks: [
                  { id: 'ms-85fbdd0b-t1', title: 'Hire premium web design agency', completed: true },
                  { id: 'ms-85fbdd0b-t2', title: 'Curate high-end lifestyle imagery', completed: false },
                  { id: 'ms-85fbdd0b-t3', title: 'Launch new site with VIP newsletter', completed: false }
                ] },
            { id: "ms-42eaac7b", title: "Hire a dedicated travel concierge for the team", completed: false , tasks: [
                  { id: 'ms-42eaac7b-t1', title: 'Define concierge service SOPs', completed: true },
                  { id: 'ms-42eaac7b-t2', title: 'Interview luxury hospitality candidates', completed: false },
                  { id: 'ms-42eaac7b-t3', title: 'Onboard new hire with VIP clients', completed: false }
                ] }
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
