import { Archetype } from '../archetypes';
import { generateHistoricalTasks, getToday } from './utils';

export const medicalProfiles: Archetype[] = [
  {
    id: 'medical-neuro',
    icon: "🧠",
    title: 'The Neural Artisan',
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
            { id: 'm-n1', title: 'Complete 100 successful surgeries', completed: true },
            { id: 'm-n2', title: 'Publish findings in medical journal', completed: false }
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
      skills: [
        { id: 's-n1', name: 'Microsurgery', level: 9 },
        { id: 's-n2', name: 'Neuroanatomy', level: 10 },
        { id: 's-n3', name: 'Crisis Management', level: 8 }
      ],
      voids: [
        {
          id: 'v-neuro-1',
          title: 'Skip post-op patient follow-up documentation',
          description: 'Incomplete notes can lead to miscommunication in patient care.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: 'v-neuro-2',
          title: 'Rushing pre-surgical checklists',
          description: 'Skipping steps in the time-out process compromises patient safety.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  },
  {
    id: 'medical-diagnostician',
    icon: "🩺",
    title: 'The Clinical Anchor',
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
            { id: 'm-d1', title: 'Secure hospital board approval', completed: true },
            { id: 'm-d2', title: 'Hire interdisciplinary team of specialists', completed: false }
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
      skills: [
        { id: 's-d1', name: 'Clinical Reasoning', level: 9 },
        { id: 's-d2', name: 'Patient Empathy', level: 8 },
        { id: 's-d3', name: 'Data Synthesis', level: 9 }
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
      ]
    }
  },
  {
    id: 'medical-research',
    icon: "🔬",
    title: 'The Scientific Vanguard',
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
            { id: 'm-r1', title: 'Finalize trial protocols', completed: true },
            { id: 'm-r2', title: 'Enroll 500 patient cohort', completed: false }
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
      skills: [
        { id: 's-r1', name: 'Protocol Design', level: 9 },
        { id: 's-r2', name: 'Regulatory Compliance', level: 8 },
        { id: 's-r3', name: 'Statistical Analysis', level: 7 }
      ],
      voids: [
        {
          id: 'v-res-1',
          title: 'Compromise on blinding protocols',
          description: 'Allowing unblinding without strict medical necessity ruins trial integrity.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        },
        {
          id: 'v-res-2',
          title: 'Miss reporting deadlines to regulatory bodies',
          description: 'Failing to report data to the FDA/EMA on time risks study shutdown.',
          impact: 'high',
          engagedCount: 0,
          maxAllowed: 0
        }
      ]
    }
  }
];
