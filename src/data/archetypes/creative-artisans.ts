import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const creativeArtisanProfiles: Archetype[] = [
  {
    id: "frame-chaser",
    icon: "📷",
    title: "",
    voids: [
        {
            id: "void-frame-chaser-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-frame-chaser-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Lucas | Wedding & Portrait Photographer",
    vibe: "Warm, energetic, constantly chasing the perfect golden hour light.",
    data: {
      profile: {
        name: "Lucas",
        level: 28,
        xp: 45000,
        title: "Master of Moments"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 42,
        tasksCompleted: 450,
        totalFocusHours: 720
      },
      ambitions: [
        {
          id: "wedding-season",
          title: "Survive & Thrive Peak Wedding Season",
          description: "Deliver all galleries on time while maintaining creative sanity.",
          milestones: [
            { id: "ms-73cf3142", title: "Cull 5000 images: Find the emotional core of the Smith wedding", completed: true , tasks: [
                  { id: 'wedding-season-t1', title: 'Backup all RAW files', completed: true },
                  { id: 'wedding-season-t2', title: 'Perform first-pass culling in Lightroom', completed: true },
                  { id: 'wedding-season-t3', title: 'Select final 800 hero shots', completed: true }
                ] },
            { id: "ms-c5c63af0", title: "Initial color grade: Apply signature moody aesthetic to Jones gallery", completed: false , tasks: [
                  { id: 'ms-c5c63af0-t1', title: 'Apply base custom presets', completed: true },
                  { id: 'ms-c5c63af0-t2', title: 'Adjust exposure and white balance locally', completed: false },
                  { id: 'ms-c5c63af0-t3', title: 'Export low-res proofs for client', completed: false }
                ] },
            { id: "ms-b22aff4b", title: "Deliver final gallery: Exceed the Williams family expectations", completed: false , tasks: [
                  { id: 'ms-b22aff4b-t1', title: 'Perform final blemish retouching', completed: true },
                  { id: 'ms-b22aff4b-t2', title: 'Design luxury layflat album layout', completed: false },
                  { id: 'ms-b22aff4b-t3', title: 'Send personalized final delivery package', completed: false }
                ] }
          ]
        },
        {
          id: "portfolio-update",
          title: "Revamp 2026 Portfolio",
          description: "Curate the absolute best shots for the new website launch.",
          milestones: [
            { id: "ms-4a38fbc8", title: "Select top 50 shots: Curate a breathtaking 2026 portfolio", completed: true , tasks: [
                  { id: 'portfolio-update-t1', title: 'Review past 12 months of client work', completed: true },
                  { id: 'portfolio-update-t2', title: 'Select images demonstrating stylistic range', completed: true },
                  { id: 'portfolio-update-t3', title: 'Update website portfolio gallery', completed: true }
                ] },
            { id: "ms-53b7acbe", title: "Write service descriptions: Command premium artisan pricing", completed: false , tasks: [
                  { id: 'ms-53b7acbe-t1', title: 'Research luxury market positioning', completed: true },
                  { id: 'ms-53b7acbe-t2', title: 'Draft compelling service copy', completed: false },
                  { id: 'ms-53b7acbe-t3', title: 'Update pricing tiers on website', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "frame-chaser",
          "wedding-season",
          [
            "Back up SD cards from Saturday's shoot",
            "Cull ceremony photos",
            "Edit reception sneak peeks",
            "Client consultation with Emily & Mark",
            "Scout location for engagement shoot",
            "Send invoice to the Johnsons",
            "Clean sensor on Sony A7IV",
            "Order custom flash drives",
            "Respond to new inquiries",
            "Edit portraits for 2 hours",
            "Export full gallery for Miller wedding",
            "Design wedding album layout",
            "Post sneak peek reel to Instagram",
            "Update pricing guide pdf",
            "Charge all batteries"
          ],
          450
        ),
        {
          id: "t-1",
          title: "Finish editing the Miller reception",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          tags: ["editing", "client-work"],
          ambitionId: "wedding-season"
        },
        {
          id: "t-2",
          title: "Consultation call with new leads",
          status: "pending",
          priority: "medium",
          duration: 30,
          date: getToday(),
          tags: ["admin", "sales"]
        },
        {
          id: "t-3",
          title: "Format SD cards for tomorrow's shoot",
          status: "pending",
          priority: "high",
          duration: 15,
          date: getToday(),
          tags: ["prep"]
        }
      ],
      voids: [
          {
                    id: "v-fc-1",
                    text: "Gear Acquisition Syndrome",
                    description: "Researching lenses instead of editing",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-fc-2",
                    text: "Preset Tweaking Paralysis",
                    description: "Endlessly adjusting the same slider",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-fc-3",
                    text: "Instagram Doomscrolling",
                    description: "Comparing work to others",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-fc-1",
                    title: "Featured in Vogue Weddings",
                    date: "2023-06-05",
                    type: "success",
                    category: "publication",
                    description: "Had a full-page spread detailing a high-profile destination wedding.",
                    skills: [
                              "Editorial Photography",
                              "Networking"
                    ]
          },
          {
                    id: "hist-fc-2",
                    title: "Switched to 100% Mirrorless System",
                    date: "2024-01-15",
                    type: "success",
                    category: "milestone",
                    description: "Successfully migrated all gear, improving silent shooting capabilities.",
                    skills: [
                              "Gear Optimization",
                              "Adaptability"
                    ]
          },
          {
                    id: "hist-fc-3",
                    title: "Booked First International Campaign",
                    date: "2025-09-20",
                    type: "success",
                    category: "project",
                    description: "Flew to Iceland to shoot a commercial campaign for an outerwear brand.",
                    skills: [
                              "Location Scouting",
                              "Commercial Photography"
                    ]
          }
]
    }
  },
  {
    id: "industrial-lens",
    icon: "📸",
    title: "",
    voids: [
        {
            id: "void-industrial-lens-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-industrial-lens-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Sarah | Commercial & Industrial Photographer",
    vibe: "Precise, structured, navigating hard hats and heavy machinery with a camera.",
    data: {
      profile: {
        name: "Sarah",
        level: 34,
        xp: 62000,
        title: "Visual Architect"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'stellar'
      },
      stats: {
        streak: 21,
        tasksCompleted: 610,
        totalFocusHours: 850
      },
      ambitions: [
        {
          id: "annual-report",
          title: "Apex Corp Annual Report Shoot",
          description: "Capture hero images of the new manufacturing facility.",
          milestones: [
            { id: "ms-9ca44cf2", title: "Site walk-through and safety briefing", completed: true , tasks: [
                  { id: 'annual-report-t1', title: 'Conduct risk assessment sweep', completed: true },
                  { id: 'annual-report-t2', title: 'Review safety protocols with crew', completed: true },
                  { id: 'annual-report-t3', title: 'Sign off on site safety logs', completed: true }
                ] },
            { id: "ms-942ff961", title: "Shoot executive headshots", completed: true , tasks: [
                  { id: 'ms-942ff961-t1', title: 'Set up portable studio lighting', completed: true },
                  { id: 'ms-942ff961-t2', title: 'Direct poses for 15 executives', completed: true },
                  { id: 'ms-942ff961-t3', title: 'Tethered review of initial shots', completed: true }
                ] },
            { id: "ms-04694088", title: "Capture assembly line action shots", completed: false , tasks: [
                  { id: 'ms-04694088-t1', title: 'Coordinate with floor manager for timing', completed: true },
                  { id: 'ms-04694088-t2', title: 'Use high-speed sync for machinery', completed: false },
                  { id: 'ms-04694088-t3', title: 'Capture candid worker interactions', completed: false }
                ] },
            { id: "ms-cd7422be", title: "Deliver final retouched images", completed: false , tasks: [
                  { id: 'ms-cd7422be-t1', title: 'Apply corporate color grading', completed: true },
                  { id: 'ms-cd7422be-t2', title: 'Retouch background distractions', completed: false },
                  { id: 'ms-cd7422be-t3', title: 'Deliver final assets via secure portal', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "industrial-lens",
          "annual-report",
          [
            "Renew drone commercial license",
            "Pack PPE gear for site visit",
            "Create lighting diagram for warehouse shoot",
            "Edit headshot batch 1",
            "Send progress proof gallery to Art Director",
            "Rent tilt-shift lens",
            "Retouch reflections on machinery shots",
            "Draft shot list for day 2",
            "Expense report for travel",
            "Client sync call",
            "Backup RAW files to NAS",
            "Color grade external drone footage",
            "Final retouching on hero image",
            "Prep gear for factory floor",
            "Invoice Apex Corp for 50% deposit"
          ],
          610
        ),
        {
          id: "t-1",
          title: "Retouch dust and scratches from machinery hero shots",
          status: "pending",
          priority: "high",
          duration: 90,
          date: getToday(),
          tags: ["retouching", "deep-work"],
          ambitionId: "annual-report"
        },
        {
          id: "t-2",
          title: "Sync with Apex Corp Art Director",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday(),
          tags: ["meeting", "client"]
        },
        {
          id: "t-3",
          title: "Clean drone sensors and prep batteries",
          status: "pending",
          priority: "low",
          duration: 30,
          date: getToday(),
          tags: ["gear-prep"]
        }
      ],
      voids: [
          {
                    id: "v-il-1",
                    text: "Pixel Peeping Paralysis",
                    description: "Zooming to 400% for invisible dust",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-il-2",
                    text: "Over-packing Gear Anxiety",
                    description: "Packing 4 backup flashes",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-il-3",
                    text: "Endless Moodboarding",
                    description: "Avoiding drafting the actual shot list",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-il-1",
                    title: "Completed Aerospace Facility Shoot",
                    date: "2023-04-12",
                    type: "success",
                    category: "project",
                    description: "Captured highly technical images of a new jet engine assembly line.",
                    skills: [
                              "Lighting Large Spaces",
                              "Technical Understanding"
                    ]
          },
          {
                    id: "hist-il-2",
                    title: "Published Industrial Photobook",
                    date: "2024-10-30",
                    type: "success",
                    category: "publication",
                    description: "Released a coffee table book highlighting the beauty of manufacturing.",
                    skills: [
                              "Curating",
                              "Print Production"
                    ]
          },
          {
                    id: "hist-il-3",
                    title: "Secured Retainer with Global Logistics Firm",
                    date: "2025-03-15",
                    type: "success",
                    category: "milestone",
                    description: "Signed a 2-year contract to document their shipping ports worldwide.",
                    skills: [
                              "Contract Negotiation",
                              "Drone Photography"
                    ]
          }
]
    }
  },
  {
    id: "aesthetic-architect",
    icon: "🖋️",
    title: "",
    voids: [
        {
            id: "void-aesthetic-architect-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-aesthetic-architect-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Liam | Freelance Graphic Designer",
    vibe: "Minimalist, caffeinated, obsessed with typography and grid systems.",
    data: {
      profile: {
        name: "Liam",
        level: 22,
        xp: 35000,
        title: "Grid Master"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'void'
      },
      stats: {
        streak: 15,
        tasksCompleted: 320,
        totalFocusHours: 510
      },
      ambitions: [
        {
          id: "brand-identity",
          title: "Nova Tech Brand Identity",
          description: "Complete overhaul of Nova's visual language and logo.",
          milestones: [
            { id: "ms-270f7871", title: "Brand discovery workshop", completed: true , tasks: [
                  { id: 'brand-identity-t1', title: 'Host 2-hour stakeholder interview', completed: true },
                  { id: 'brand-identity-t2', title: 'Analyze competitor visual identities', completed: true },
                  { id: 'brand-identity-t3', title: 'Define core brand archetypes', completed: true }
                ] },
            { id: "ms-33581b05", title: "Present 3 logo concepts", completed: true , tasks: [
                  { id: 'ms-33581b05-t1', title: 'Draft initial vector sketches', completed: true },
                  { id: 'ms-33581b05-t2', title: 'Develop monochrome and color variations', completed: true },
                  { id: 'ms-33581b05-t3', title: 'Present concepts via Zoom pitch', completed: true }
                ] },
            { id: "ms-d4a05d84", title: "Finalize brand guidelines document", completed: false , tasks: [
                  { id: 'ms-d4a05d84-t1', title: 'Define typography hierarchy', completed: true },
                  { id: 'ms-d4a05d84-t2', title: 'Establish primary and secondary color palettes', completed: false },
                  { id: 'ms-d4a05d84-t3', title: 'Export final PDF brand book', completed: false }
                ] }
          ]
        },
        {
          id: "typography-course",
          title: "Advanced Typography Course",
          description: "Level up my type game to command higher rates.",
          milestones: [
            { id: "ms-f0ab4c93", title: "Complete module 1: History", completed: true , tasks: [
                  { id: 'typography-course-t1', title: 'Read assigned chapters', completed: true },
                  { id: 'typography-course-t2', title: 'Participate in seminar discussion', completed: true },
                  { id: 'typography-course-t3', title: 'Submit 2000-word essay', completed: true }
                ] },
            { id: "ms-6eff110d", title: "Complete final project", completed: false , tasks: [
                  { id: 'ms-6eff110d-t1', title: 'Outline research methodology', completed: true },
                  { id: 'ms-6eff110d-t2', title: 'Conduct primary data collection', completed: false },
                  { id: 'ms-6eff110d-t3', title: 'Present findings to thesis committee', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "aesthetic-architect",
          "brand-identity",
          [
            "Sketch initial logo concepts",
            "Vectorize top 3 sketches",
            "Select brand color palette",
            "Choose primary and secondary typefaces",
            "Mockup logo on business cards",
            "Create presentation deck for client",
            "Revise concept 2 based on feedback",
            "Design letterhead",
            "Export logo in all formats (SVG, PNG, EPS)",
            "Draft brand guidelines PDF",
            "Design social media templates",
            "Review competitor branding",
            "Update personal Behance portfolio",
            "Send invoice for milestone 1",
            "Client feedback call"
          ],
          320
        ),
        {
          id: "t-1",
          title: "Finish defining brand guidelines for Nova Tech",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          tags: ["design", "deep-work"],
          ambitionId: "brand-identity"
        },
        {
          id: "t-2",
          title: "Export logo files for handoff",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          tags: ["production"],
          ambitionId: "brand-identity"
        },
        {
          id: "t-3",
          title: "Watch typography course module 3",
          status: "pending",
          priority: "low",
          duration: 45,
          date: getToday(),
          tags: ["learning"],
          ambitionId: "typography-course"
        },
        {
          id: "t-4",
          title: "Update Notion project tracker",
          status: "pending",
          priority: "low",
          duration: 15,
          date: getToday(),
          tags: ["admin"]
        }
      ],
      voids: [
          {
                    id: "v-aa-1",
                    text: "Font Scrolling Abyss",
                    description: "Testing identical fonts for hours",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-aa-2",
                    text: "Alignment Obsession",
                    description: "Nudging by 1px repeatedly",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-aa-3",
                    text: "Scope Creep via Options",
                    description: "Designing unbillable extra concepts",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-aa-1",
                    title: "Awwwards Site of the Day",
                    date: "2023-08-10",
                    type: "success",
                    category: "award",
                    description: "Won SOTD for an immersive WebGL portfolio site.",
                    skills: [
                              "UI/UX Design",
                              "Creative Direction"
                    ]
          },
          {
                    id: "hist-aa-2",
                    title: "Led Rebrand for Major Fintech Startup",
                    date: "2024-05-22",
                    type: "success",
                    category: "project",
                    description: "Completely overhauled their visual identity, leading to a 40% conversion increase.",
                    skills: [
                              "Brand Strategy",
                              "Visual Identity"
                    ]
          },
          {
                    id: "hist-aa-3",
                    title: "Launched Custom Typography Foundry",
                    date: "2025-11-05",
                    type: "success",
                    category: "milestone",
                    description: "Released a highly successful geometric sans-serif font family.",
                    skills: [
                              "Type Design",
                              "E-commerce"
                    ]
          }
]
    }
  },
  {
    id: "word-weaver",
    icon: "📝",
    title: "",
    voids: [
        {
            id: "void-word-weaver-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-word-weaver-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Sarah | Technical Writer",
    vibe: "Methodical, clear-headed, translating complex engineering into plain English.",
    data: {
      profile: {
        name: "Sarah",
        level: 38,
        xp: 75000,
        title: "Clarity Conjurer"
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 65,
        tasksCompleted: 780,
        totalFocusHours: 920
      },
      ambitions: [
        {
          id: "api-docs",
          title: "v2.0 API Documentation Rewrite",
          description: "Migrate and update all endpoint docs to the new OpenAPI spec.",
          milestones: [
            { id: "ms-c49101fe", title: "Audit existing v1.0 docs", completed: true , tasks: [
                  { id: 'api-docs-t1', title: 'Review analytics for highest traffic pages', completed: true },
                  { id: 'api-docs-t2', title: 'Identify outdated code snippets', completed: true },
                  { id: 'api-docs-t3', title: 'Create migration checklist', completed: true }
                ] },
            { id: "ms-8533eee8", title: "Write authentication guide", completed: true , tasks: [
                  { id: 'ms-8533eee8-t1', title: 'Draft OAuth2 implementation steps', completed: true },
                  { id: 'ms-8533eee8-t2', title: 'Create sample code for Node.js', completed: true },
                  { id: 'ms-8533eee8-t3', title: 'Review with senior security engineer', completed: true }
                ] },
            { id: "ms-223d6ba1", title: "Document core endpoints", completed: false , tasks: [
                  { id: 'ms-223d6ba1-t1', title: 'Use OpenAPI spec to generate reference', completed: true },
                  { id: 'ms-223d6ba1-t2', title: 'Add cURL examples for all methods', completed: false },
                  { id: 'ms-223d6ba1-t3', title: 'Verify responses against production API', completed: false }
                ] },
            { id: "ms-66c962f1", title: "Publish to developer portal", completed: false , tasks: [
                  { id: 'ms-66c962f1-t1', title: 'Merge markdown files to main', completed: true },
                  { id: 'ms-66c962f1-t2', title: 'Trigger static site generator build', completed: false },
                  { id: 'ms-66c962f1-t3', title: 'Verify live links and formatting', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "word-weaver",
          "api-docs",
          [
            "Interview backend lead about auth changes",
            "Draft OAuth2 setup guide",
            "Review PR for endpoint parameter changes",
            "Test API endpoints in Postman",
            "Write code samples in Python and cURL",
            "Fix broken markdown links in intro",
            "Attend engineering sprint planning",
            "Format JSON response examples",
            "Create Mermaid diagram for data flow",
            "Update terminology glossary",
            "Peer review John's release notes",
            "Sync with DevRel team",
            "Resolve documentation GitHub issues",
            "Write troubleshooting section",
            "Run spellcheck and linter on markdown files"
          ],
          780
        ),
        {
          id: "t-1",
          title: "Draft documentation for the new Webhooks endpoint",
          status: "pending",
          priority: "high",
          duration: 120,
          date: getToday(),
          tags: ["writing", "deep-work"],
          ambitionId: "api-docs"
        },
        {
          id: "t-2",
          title: "Test Webhook payloads in Postman",
          status: "pending",
          priority: "medium",
          duration: 45,
          date: getToday(),
          tags: ["testing"]
        },
        {
          id: "t-3",
          title: "Review PR #402 for release notes",
          status: "pending",
          priority: "medium",
          duration: 30,
          date: getToday(),
          tags: ["review"]
        }
      ],
      voids: [
          {
                    id: "v-ww-1",
                    text: "Research Rabbit Hole",
                    description: "Deep-diving into edge cases needlessly",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-ww-2",
                    text: "Formatting Fiddling",
                    description: "Trying to perfectly align Markdown",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          },
          {
                    id: "v-ww-3",
                    text: "Jargon Hoarding",
                    description: "Over-complicating sentences",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-ww-1",
                    title: "Viral Thought Leadership Article",
                    date: "2023-02-28",
                    type: "success",
                    category: "publication",
                    description: "Wrote an article on tech ethics that hit the front page of HackerNews.",
                    skills: [
                              "Copywriting",
                              "Tech Journalism"
                    ]
          },
          {
                    id: "hist-ww-2",
                    title: "Wrote Official API Documentation",
                    date: "2024-07-15",
                    type: "success",
                    category: "project",
                    description: "Authored the complete developer docs for a popular open-source framework.",
                    skills: [
                              "Technical Writing",
                              "Markdown"
                    ]
          },
          {
                    id: "hist-ww-3",
                    title: "Ghostwrote NYT Bestseller",
                    date: "2025-04-10",
                    type: "success",
                    category: "milestone",
                    description: "Successfully ghostwrote a business strategy book for a famous CEO.",
                    skills: [
                              "Ghostwriting",
                              "Long-form Content"
                    ]
          }
]
    }
  },
  {
    id: "code-artisan",
    icon: "🎮",
    title: "",
    voids: [
        {
            id: "void-code-artisan-1",
            text: "Waiting for 'perfect inspiration' to start",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-code-artisan-2",
            text: "Over-tweaking finished work instead of publishing",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: "Alex | Indie Game Developer",
    vibe: "Creative, technically ambitious, fueled by energy drinks and synthwave.",
    data: {
      profile: {
        name: "Alex",
        level: 25,
        xp: 41000,
        title: "Pixel Pioneer"
      },
      preferences: {
        confirmDelete: false,
        uiMode: 'void'
      },
      stats: {
        streak: 12,
        tasksCompleted: 290,
        totalFocusHours: 650
      },
      ambitions: [
        {
          id: "vertical-slice",
          title: "Complete Vertical Slice Demo",
          description: "Finish the core gameplay loop for publisher pitches.",
          milestones: [
            { id: "ms-9f6212fc", title: "Implement player controller", completed: true , tasks: [
                  { id: 'vertical-slice-t1', title: 'Code basic movement physics', completed: true },
                  { id: 'vertical-slice-t2', title: 'Integrate jump and dash mechanics', completed: true },
                  { id: 'vertical-slice-t3', title: 'Refine input responsiveness', completed: true }
                ] },
            { id: "ms-b339ff19", title: "Finish first level blockout", completed: true , tasks: [
                  { id: 'ms-b339ff19-t1', title: 'Design greybox level layout', completed: true },
                  { id: 'ms-b339ff19-t2', title: 'Place initial spawn points', completed: true },
                  { id: 'ms-b339ff19-t3', title: 'Playtest for pacing and flow', completed: true }
                ] },
            { id: "ms-3a69b046", title: "Implement basic enemy AI", completed: false , tasks: [
                  { id: 'ms-3a69b046-t1', title: 'Create patrol waypoints', completed: true },
                  { id: 'ms-3a69b046-t2', title: 'Implement line-of-sight detection', completed: false },
                  { id: 'ms-3a69b046-t3', title: 'Code basic attack state machine', completed: false }
                ] },
            { id: "ms-3b2de235", title: "Polish UI and add sound effects", completed: false , tasks: [
                  { id: 'ms-3b2de235-t1', title: 'Integrate menu animations', completed: true },
                  { id: 'ms-3b2de235-t2', title: 'Add footstep and interaction SFX', completed: false },
                  { id: 'ms-3b2de235-t3', title: 'Balance overall audio mix', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          "code-artisan",
          "vertical-slice",
          [
            "Refactor state machine for player movement",
            "Fix collision bug on sloped terrain",
            "Design jump animation frames",
            "Write dialogue for NPC merchant",
            "Implement inventory data structure",
            "Create particle effects for spell cast",
            "Compose main menu theme track",
            "Balance enemy health scaling",
            "Setup Unity scene for level 1",
            "Write shader for water surface",
            "Optimize draw calls",
            "Playtest combat loop",
            "Draft pitch deck outline",
            "Update devlog on YouTube",
            "Fix memory leak in menu UI"
          ],
          290
        ),
        {
          id: "t-1",
          title: "Implement pathfinding for ranged enemies",
          status: "pending",
          priority: "high",
          duration: 180,
          date: getToday(),
          tags: ["coding", "ai", "deep-work"],
          ambitionId: "vertical-slice"
        },
        {
          id: "t-2",
          title: "Fix bug where player clips through the floor on death",
          status: "pending",
          priority: "high",
          duration: 60,
          date: getToday(),
          tags: ["bug-fix"]
        },
        {
          id: "t-3",
          title: "Find placeholder sound effects for UI clicks",
          status: "pending",
          priority: "low",
          duration: 30,
          date: getToday(),
          tags: ["audio", "polish"]
        }
      ],
      voids: [
          {
                    id: "v-ca-1",
                    text: "Feature Creep Fog",
                    description: "Simulating weather in a 2D platformer",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-ca-2",
                    text: "Custom Tooling Trap",
                    description: "Building custom editors instead of working",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-ca-3",
                    text: "Premature Optimization",
                    description: "Saving 2ms when already at 144fps",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-ca-1",
                    title: "Shipped Solo Indie Game",
                    date: "2023-11-11",
                    type: "success",
                    category: "project",
                    description: "Released a critically acclaimed 2D metroidvania on Steam.",
                    skills: [
                              "Game Design",
                              "C# / Unity"
                    ]
          },
          {
                    id: "hist-ca-2",
                    title: "Over 10,000 GitHub Stars",
                    date: "2024-09-05",
                    type: "success",
                    category: "milestone",
                    description: "Achieved massive community adoption for an open-source physics library.",
                    skills: [
                              "Open Source",
                              "Community Management"
                    ]
          },
          {
                    id: "hist-ca-3",
                    title: "Won Global Game Jam",
                    date: "2025-01-26",
                    type: "success",
                    category: "award",
                    description: "Created the winning game prototype out of 500+ global entries in 48 hours.",
                    skills: [
                              "Rapid Prototyping",
                              "Under-pressure Coding"
                    ]
          }
]
    }
  }
];
