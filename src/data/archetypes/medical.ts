import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const medicalProfiles: Archetype[] = [
  {
    id: 'medical-neuro',
    icon: "🧠",
    title: '',
    voids: [
        {
            id: "void-medical-neuro-1",
            text: "Waiting for 'perfect inspiration' to start",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-medical-neuro-2",
            text: "Over-tweaking finished work instead of publishing",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: 'Precision under pressure',
    vibe: 'calm, focused, meticulous',
    data: {
      profile: {
        name: 'Dr. Aisha',
        title: 'Lead Neurosurgeon',
        level: 35,
        xp: 62000
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'nebula'
      },
      stats: {
        streak: 45,
        tasksCompleted: 450,
        totalFocusHours: 850
      },
      ambitions: [
        {
          id: 'amb-neuro-1',
          title: 'Pioneer Minimally Invasive Spine Surgery',
          description: 'Develop and publish new techniques for complex spinal fusions.',
          status: 'active',
          milestones: [
            { id: 'm-n1', title: "Complete 100 Surgeries: Master the minimally invasive technique", completed: true , tasks: [
                  { id: 'amb-neuro-1-t1', title: 'Perform first 10 proctored cases', completed: true },
                  { id: 'amb-neuro-1-t2', title: 'Achieve consistent sub-2-hour operation times', completed: true },
                  { id: 'amb-neuro-1-t3', title: 'Log 100th successful independent case', completed: true }
                ] },
            { id: 'm-n2', title: "Publish Findings: Submit peer-reviewed results to The Lancet", completed: false , tasks: [
                  { id: 'm-n2-t1', title: 'Compile post-op recovery data', completed: true },
                  { id: 'm-n2-t2', title: 'Draft clinical manuscript', completed: false },
                  { id: 'm-n2-t3', title: 'Address peer-reviewer revisions', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          'medical-neuro',
          'amb-neuro-1',
          [
            'Brain mapping and surgical planning',
            'Patient consultation (Complex case)',
            'Meningioma resection',
            'Post-op rounding in ICU',
            'Reviewing functional MRIs',
            'Spinal fusion preparation',
            'Endoscopic biopsy',
            'Neurosurgery grand rounds presentation',
            'Tumor board multidisciplinary meeting',
            'Consult with oncology team',
            'Update surgical protocols',
            'Mentor neurosurgery residents',
            'Simulate novel aneurysm clipping technique'
          ],
          450
        ),
        {
          id: 'task-neuro-today-1',
          ambitionId: 'amb-neuro-1',
          title: 'Craniotomy for tumor resection',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 6,
          completedPomodoros: 0,
          tags: ['surgery', 'critical']
        },
        {
          id: 'task-neuro-today-2',
          ambitionId: 'amb-neuro-1',
          title: 'Review pre-op scans for tomorrow',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 2,
          completedPomodoros: 0,
          tags: ['planning', 'analysis']
        },
        {
          id: 'task-neuro-today-3',
          ambitionId: 'amb-neuro-1',
          title: 'Update patient families',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 1,
          completedPomodoros: 0,
          tags: ['communication']
        }
      ],
      voids: [
          {
                    id: "v-neuro-1",
                    text: "Skipping pre-op mental visualization",
                    description: "Increases risk of hesitation",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-neuro-2",
                    text: "Ignoring physical fatigue",
                    description: "Compromises microsurgical precision",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-neuro-3",
                    text: "Rushing post-op documentation",
                    description: "Leads to miscommunication",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-neuro-1",
                    title: "Chief Resident Excellence Award",
                    date: "2023-05-12",
                    type: "success",
                    category: "award",
                    description: "Awarded for outstanding surgical precision and leadership during residency.",
                    skills: [
                              "Leadership",
                              "Microsurgery"
                    ]
          },
          {
                    id: "hist-neuro-2",
                    title: "First Solo Craniotomy",
                    date: "2024-02-18",
                    type: "success",
                    category: "milestone",
                    description: "Successfully performed first unassisted craniotomy on a high-risk patient.",
                    skills: [
                              "Surgical Planning",
                              "Crisis Management"
                    ]
          },
          {
                    id: "hist-neuro-3",
                    title: "Published in Journal of Neurosurgery",
                    date: "2025-01-10",
                    type: "success",
                    category: "publication",
                    description: "Co-authored a paper on novel spinal fusion techniques.",
                    skills: [
                              "Research",
                              "Medical Writing"
                    ]
          }
],
        skills: [
              {
                "id": "skill-p-1785233787203-0",
                "name": "Stress Regulation",
                "currentProficiency": 43,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-1",
                "name": "Emotional Resilience",
                "currentProficiency": 50,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-2",
                "name": "Strategic Empathy",
                "currentProficiency": 39,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-3",
                "name": "Time Management",
                "currentProficiency": 38,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-4",
                "name": "Deep Work Focus",
                "currentProficiency": 59,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-5",
                "name": "Radical Candor",
                "currentProficiency": 56,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787203-6",
                "name": "Cognitive Flexibility",
                "currentProficiency": 72,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The ability to pivot your thinking when the paradigm shifts.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787203-7",
                "name": "Advanced Amb Neuro 1 Tactics 1",
                "currentProficiency": 79,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-neuro-1"
              },
              {
                "id": "skill-a-1785233787203-8",
                "name": "Advanced Amb Neuro 1 Tactics 2",
                "currentProficiency": 55,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-neuro-1"
              },
              {
                "id": "skill-a-1785233787203-9",
                "name": "Advanced Amb Neuro 1 Tactics 3",
                "currentProficiency": 75,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "The Void will try to distract you from this, but the payoff is immense.",
                "ambitionId": "amb-neuro-1"
              }
            ]
    }
  },
  {
    id: 'medical-diagnostician',
    icon: "🩺",
    title: '',
    voids: [
        {
            id: "void-medical-diagnostician-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-medical-diagnostician-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: 'Connecting the dots',
    vibe: 'analytical, empathetic, thorough',
    data: {
      profile: {
        name: 'Dr. Rachel',
        title: 'Senior Diagnostician',
        level: 28,
        xp: 41000
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'starlight'
      },
      stats: {
        streak: 30,
        tasksCompleted: 520,
        totalFocusHours: 710
      },
      ambitions: [
        {
          id: 'amb-diag-1',
          title: 'Establish a Rapid-Response Diagnostic Clinic',
          description: 'Create a specialized clinic for undiagnosed and complex diseases.',
          status: 'active',
          milestones: [
            { id: 'm-d1', title: 'Secure hospital board approval', completed: true , tasks: [
                  { id: 'amb-diag-1-t1', title: 'Present clinical outcomes to medical board', completed: true },
                  { id: 'amb-diag-1-t2', title: 'Submit financial feasibility report', completed: true },
                  { id: 'amb-diag-1-t3', title: 'Obtain formal budget allocation', completed: true }
                ] },
            { id: 'm-d2', title: 'Hire interdisciplinary team of specialists', completed: false , tasks: [
                  { id: 'm-d2-t1', title: 'Recruit lead anesthesiologist', completed: true },
                  { id: 'm-d2-t2', title: 'Interview specialized scrub nurses', completed: false },
                  { id: 'm-d2-t3', title: 'Finalize team scheduling', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          'medical-diagnostician',
          'amb-diag-1',
          [
            'Analyze complex blood panels',
            'Comprehensive patient intake & history',
            'Consult with rheumatology and neurology',
            'Review whole exome sequencing results',
            'Differential diagnosis charting',
            'Present case studies at morbidity & mortality',
            'Update electronic health records',
            'Research rare autoimmune markers in literature',
            'Lead diagnostic huddle with attending physicians',
            'Follow up on indeterminate lab results',
            'Write comprehensive referral summaries',
            'Review complex pathology reports',
            'Patient counseling on diagnostic uncertainty'
          ],
          520
        ),
        {
          id: 'task-diag-today-1',
          ambitionId: 'amb-diag-1',
          title: 'Synthesize findings for Patient X case',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 3,
          completedPomodoros: 0,
          tags: ['analysis', 'charting']
        },
        {
          id: 'task-diag-today-2',
          ambitionId: 'amb-diag-1',
          title: 'Call lab regarding expedited genetics results',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 1,
          completedPomodoros: 0,
          tags: ['communication', 'urgent']
        },
        {
          id: 'task-diag-today-3',
          ambitionId: 'amb-diag-1',
          title: 'Consult with infectious disease specialist',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 2,
          completedPomodoros: 0,
          tags: ['collaboration']
        }
      ],
      voids: [
        {
          id: 'v-diag-1',
          title: 'Overlook subtle patient symptoms',
          description: 'Dismissing minor details that could be the key to a rare diagnosis.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: 'v-diag-2',
          title: 'Delaying critical test result callbacks',
          description: 'Failing to immediately inform patients and care teams of severe findings.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        }
      ],
        skills: [
              {
                "id": "skill-p-1785233787256-0",
                "name": "Growth Mindset",
                "currentProficiency": 36,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "View every failure as data. Adapt and iterate continuously.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-1",
                "name": "Deep Work Focus",
                "currentProficiency": 69,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-2",
                "name": "Emotional Resilience",
                "currentProficiency": 46,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-3",
                "name": "Stress Regulation",
                "currentProficiency": 59,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-4",
                "name": "Cognitive Flexibility",
                "currentProficiency": 32,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The ability to pivot your thinking when the paradigm shifts.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-5",
                "name": "Time Management",
                "currentProficiency": 36,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Protect your focus. The Void thrives on chaotic scheduling.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787256-6",
                "name": "Active Listening",
                "currentProficiency": 49,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787256-7",
                "name": "Advanced Amb Diag 1 Tactics 1",
                "currentProficiency": 25,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "An essential pillar of your trajectory. Cultivate it daily.",
                "ambitionId": "amb-diag-1"
              },
              {
                "id": "skill-a-1785233787256-8",
                "name": "Advanced Amb Diag 1 Tactics 2",
                "currentProficiency": 21,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-diag-1"
              },
              {
                "id": "skill-a-1785233787256-9",
                "name": "Advanced Amb Diag 1 Tactics 3",
                "currentProficiency": 68,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-diag-1"
              }
            ]
    }
  },
  {
    id: 'medical-research',
    icon: "🔬",
    title: '',
    voids: [
        {
            id: "void-medical-research-1",
            text: "Endlessly researching instead of doing the work",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        },
        {
            id: "void-medical-research-2",
            text: "Getting distracted by superficial industry drama",
            impact: "high",
            engagedCount: 0,
            maxAllowed: 3
        }
    ],
    subtitle: 'Driving medical breakthroughs',
    vibe: 'innovative, rigorous, visionary',
    data: {
      profile: {
        name: 'Dr. Aris',
        title: 'Clinical Trial Director',
        level: 32,
        xp: 55000
      },
      preferences: {
        confirmDelete: true,
        uiMode: 'void'
      },
      stats: {
        streak: 55,
        tasksCompleted: 380,
        totalFocusHours: 900
      },
      ambitions: [
        {
          id: 'amb-res-1',
          title: 'Launch Phase 3 Targeted Oncology Trial',
          description: 'Lead a multi-center international clinical trial for novel immunotherapy.',
          status: 'active',
          milestones: [
            { id: 'm-r1', title: 'Finalize trial protocols', completed: true , tasks: [
                  { id: 'amb-res-1-t1', title: 'Draft IRB submission package', completed: true },
                  { id: 'amb-res-1-t2', title: 'Define inclusion/exclusion criteria', completed: true },
                  { id: 'amb-res-1-t3', title: 'Obtain ethics board approval', completed: true }
                ] },
            { id: 'm-r2', title: 'Enroll 500 patient cohort', completed: false , tasks: [
                  { id: 'm-r2-t1', title: 'Identify 15 clinical sites', completed: true },
                  { id: 'm-r2-t2', title: 'Run local awareness campaigns', completed: false },
                  { id: 'm-r2-t3', title: 'Complete patient onboarding', completed: false }
                ] }
          ]
        }
      ],
      tasks: [
        ...generateHistoricalTasks(
          'medical-research',
          'amb-res-1',
          [
            'Draft detailed trial protocols',
            'IRB submission review and revisions',
            'Analyze phase 2 efficacy data',
            'Meeting with pharmaceutical sponsors',
            'Monitor adverse event reports from trial sites',
            'Train principal investigators and coordinators',
            'Recruit patient cohorts for oncology study',
            'Statistical analysis planning with biostatisticians',
            'Conduct site initiation visits',
            'Prepare interim data report for safety board',
            'Revise study inclusion/exclusion criteria',
            'Coordinate bio-sample logistics with central lab',
            'Review literature on competing immunotherapy drugs'
          ],
          380
        ),
        {
          id: 'task-res-today-1',
          ambitionId: 'amb-res-1',
          title: 'Review serious adverse event reports',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 4,
          completedPomodoros: 0,
          tags: ['safety', 'review']
        },
        {
          id: 'task-res-today-2',
          ambitionId: 'amb-res-1',
          title: 'Sponsor update call',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 2,
          completedPomodoros: 0,
          tags: ['communication', 'sponsors']
        },
        {
          id: 'task-res-today-3',
          ambitionId: 'amb-res-1',
          title: 'Approve new site initiation in Europe',
          status: 'pending',
          createdAt: getToday(),
          pomodoros: 2,
          completedPomodoros: 0,
          tags: ['logistics', 'expansion']
        }
      ],
      voids: [
          {
                    id: "v-res-1",
                    text: "Cherry-picking favorable data",
                    description: "Focusing on data that supports the hypothesis",
                    impact: "high",
                    maxAllowed: 1,
                    engagedCount: 0
          },
          {
                    id: "v-res-2",
                    text: "Delaying adverse event reports",
                    description: "Administrative backlog on non-critical events",
                    impact: "medium",
                    maxAllowed: 2,
                    engagedCount: 0
          },
          {
                    id: "v-res-3",
                    text: "Losing touch with patients",
                    description: "Forgetting the human element of the trial",
                    impact: "low",
                    maxAllowed: 3,
                    engagedCount: 0
          }
],
      history: [
          {
                    id: "hist-res-1",
                    title: "Secured NIH Grant",
                    date: "2023-04-01",
                    type: "success",
                    category: "award",
                    description: "$2M grant awarded for longitudinal study on neuroplasticity.",
                    skills: [
                              "Grant Writing",
                              "Study Design"
                    ]
          },
          {
                    id: "hist-res-2",
                    title: "Phase II Clinical Trial Completion",
                    date: "2024-12-15",
                    type: "success",
                    category: "milestone",
                    description: "Successfully concluded Phase II with statistically significant efficacy.",
                    skills: [
                              "Data Analysis",
                              "Clinical Trials"
                    ]
          },
          {
                    id: "hist-res-3",
                    title: "Patent Granted for Novel Biomarker",
                    date: "2025-07-22",
                    type: "success",
                    category: "milestone",
                    description: "Patented a new blood-based biomarker for early detection.",
                    skills: [
                              "Patent Law",
                              "Biochemistry"
                    ]
          }
],
        skills: [
              {
                "id": "skill-p-1785233787298-0",
                "name": "Stress Regulation",
                "currentProficiency": 41,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Master your nervous system to maintain clarity under pressure.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-1",
                "name": "Active Listening",
                "currentProficiency": 68,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "True leadership requires hearing what isn't said.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-2",
                "name": "Growth Mindset",
                "currentProficiency": 62,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "View every failure as data. Adapt and iterate continuously.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-3",
                "name": "Strategic Empathy",
                "currentProficiency": 60,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Understanding others' motivations will unlock new collaborative pathways.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-4",
                "name": "Radical Candor",
                "currentProficiency": 77,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Deliver hard truths with genuine care.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-5",
                "name": "Emotional Resilience",
                "currentProficiency": 77,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "The bedrock of your ambition. Nurture your capacity to bounce back.",
                "ambitionId": null
              },
              {
                "id": "skill-p-1785233787298-6",
                "name": "Deep Work Focus",
                "currentProficiency": 39,
                "targetProficiency": 100,
                "type": "personal",
                "recommendation": "Your most valuable asset in a distracted world. Cultivate extended flow states.",
                "ambitionId": null
              },
              {
                "id": "skill-a-1785233787298-7",
                "name": "Advanced Amb Res 1 Tactics 1",
                "currentProficiency": 64,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
                "ambitionId": "amb-res-1"
              },
              {
                "id": "skill-a-1785233787298-8",
                "name": "Advanced Amb Res 1 Tactics 2",
                "currentProficiency": 56,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "Your dedication here is rewiring your potential. Don't lose momentum.",
                "ambitionId": "amb-res-1"
              },
              {
                "id": "skill-a-1785233787298-9",
                "name": "Advanced Amb Res 1 Tactics 3",
                "currentProficiency": 60,
                "targetProficiency": 100,
                "type": "ambition",
                "recommendation": "A crucial node in your skill tree. Protect your time to develop it.",
                "ambitionId": "amb-res-1"
              }
            ]
    }
  }
];
