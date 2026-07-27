import fs from 'fs';
import path from 'path';

const ARCHETYPES_DIR = './src/data/archetypes';

const customHistory: Record<string, any[]> = {
  // medical.ts
  'medical-neuro': [
    { id: 'hist-neuro-1', title: 'Chief Resident Excellence Award', date: '2023-05-12', type: 'success', category: 'award', description: 'Awarded for outstanding surgical precision and leadership during residency.', skills: ['Leadership', 'Microsurgery'] },
    { id: 'hist-neuro-2', title: 'First Solo Craniotomy', date: '2024-02-18', type: 'success', category: 'milestone', description: 'Successfully performed first unassisted craniotomy on a high-risk patient.', skills: ['Surgical Planning', 'Crisis Management'] },
    { id: 'hist-neuro-3', title: 'Published in Journal of Neurosurgery', date: '2025-01-10', type: 'success', category: 'publication', description: 'Co-authored a paper on novel spinal fusion techniques.', skills: ['Research', 'Medical Writing'] }
  ],
  'medical-er': [
    { id: 'hist-er-1', title: 'Mass Casualty Incident Response', date: '2023-11-04', type: 'success', category: 'milestone', description: 'Successfully managed triage during a multi-vehicle highway pileup.', skills: ['Triage', 'Rapid Assessment', 'Leadership'] },
    { id: 'hist-er-2', title: 'Advanced Trauma Life Support Certification', date: '2024-06-15', type: 'success', category: 'certification', description: 'Achieved top percentile in ATLS recertification.', skills: ['Trauma Care', 'Airway Management'] },
    { id: 'hist-er-3', title: 'ER Department Efficiency Redesign', date: '2025-04-20', type: 'success', category: 'project', description: 'Led a workflow overhaul that reduced average wait times by 20%.', skills: ['Workflow Optimization', 'Process Improvement'] }
  ],
  'medical-psych': [
    { id: 'hist-psych-1', title: 'Established Community Support Group', date: '2023-09-10', type: 'success', category: 'project', description: 'Founded a free weekly support group for severe anxiety disorders.', skills: ['Group Therapy', 'Community Outreach'] },
    { id: 'hist-psych-2', title: 'Keynote Speaker at Mental Health Summit', date: '2024-10-05', type: 'success', category: 'milestone', description: 'Delivered a presentation on the intersection of neurobiology and trauma.', skills: ['Public Speaking', 'Neurobiology'] },
    { id: 'hist-psych-3', title: 'Published Book on Cognitive Behavioral Therapy', date: '2025-08-12', type: 'success', category: 'publication', description: 'Aimed at making CBT accessible to non-clinical audiences.', skills: ['CBT', 'Writing'] }
  ],
  'medical-research': [
    { id: 'hist-res-1', title: 'Secured NIH Grant', date: '2023-04-01', type: 'success', category: 'award', description: '$2M grant awarded for longitudinal study on neuroplasticity.', skills: ['Grant Writing', 'Study Design'] },
    { id: 'hist-res-2', title: 'Phase II Clinical Trial Completion', date: '2024-12-15', type: 'success', category: 'milestone', description: 'Successfully concluded Phase II with statistically significant efficacy.', skills: ['Data Analysis', 'Clinical Trials'] },
    { id: 'hist-res-3', title: 'Patent Granted for Novel Biomarker', date: '2025-07-22', type: 'success', category: 'milestone', description: 'Patented a new blood-based biomarker for early detection.', skills: ['Patent Law', 'Biochemistry'] }
  ],
  'medical-rn': [
    { id: 'hist-rn-1', title: 'Critical Care Registered Nurse (CCRN) Cert', date: '2023-08-20', type: 'success', category: 'certification', description: 'Passed the CCRN exam with distinction.', skills: ['Critical Care', 'Advanced Pharmacology'] },
    { id: 'hist-rn-2', title: 'Daisy Award for Extraordinary Nurses', date: '2024-03-10', type: 'success', category: 'award', description: 'Nominated by a patient family for exceptional compassion in the ICU.', skills: ['Patient Care', 'Empathy'] },
    { id: 'hist-rn-3', title: 'Implemented ICU Mobility Protocol', date: '2025-02-28', type: 'success', category: 'project', description: 'Championed a new early-mobility protocol reducing average ICU stays.', skills: ['Protocol Implementation', 'Leadership'] }
  ],

  // heavy-builders.ts
  'builder-arch': [
    { id: 'hist-arch-1', title: 'AIA Young Architect Award', date: '2023-10-15', type: 'success', category: 'award', description: 'Recognized for innovative sustainable design in urban housing.', skills: ['Sustainable Design', 'AutoCAD'] },
    { id: 'hist-arch-2', title: 'Completed Eco-Tower Blueprint', date: '2024-05-20', type: 'success', category: 'project', description: 'Finalized schematics for a 40-story LEED Platinum building.', skills: ['BIM', 'Structural Planning'] },
    { id: 'hist-arch-3', title: 'Won Downtown Revitalization Bid', date: '2025-01-30', type: 'success', category: 'milestone', description: 'Firm was selected over 5 competitors for a major civic project.', skills: ['Client Presentation', 'Urban Planning'] }
  ],
  'builder-struct': [
    { id: 'hist-struct-1', title: 'Topping Out Ceremony - Horizon Tower', date: '2023-11-20', type: 'success', category: 'milestone', description: 'Safely placed the final beam on a massive commercial skyscraper.', skills: ['Project Management', 'Safety Oversight'] },
    { id: 'hist-struct-2', title: 'Zero-Incident Year', date: '2024-12-31', type: 'success', category: 'award', description: 'Managed a complex site for 365 days with zero OSHA recordable incidents.', skills: ['OSHA Regulations', 'Site Management'] },
    { id: 'hist-struct-3', title: 'Delivered Project 2 Months Ahead of Schedule', date: '2025-09-15', type: 'success', category: 'project', description: 'Optimized logistics to finish a bridge repair well ahead of deadline.', skills: ['Logistics', 'Resource Allocation'] }
  ],
  'builder-plant': [
    { id: 'hist-plant-1', title: 'Lean Six Sigma Black Belt Certification', date: '2023-06-10', type: 'success', category: 'certification', description: 'Mastered advanced methodologies for eliminating manufacturing defects.', skills: ['Six Sigma', 'Process Optimization'] },
    { id: 'hist-plant-2', title: 'Automated Assembly Line Delta', date: '2024-08-22', type: 'success', category: 'project', description: 'Successfully integrated 15 new robotic arms into the legacy line.', skills: ['Automation Integration', 'Robotics'] },
    { id: 'hist-plant-3', title: 'Reduced Material Waste by 30%', date: '2025-03-10', type: 'success', category: 'milestone', description: 'Implemented a scrap-recovery system that saved $2M annually.', skills: ['Waste Reduction', 'Cost Analysis'] }
  ],
  'builder-mach': [
    { id: 'hist-mach-1', title: 'Developed Universal PLC Template', date: '2023-02-15', type: 'success', category: 'project', description: 'Standardized ladder logic code used across 4 different plant sites.', skills: ['PLC Programming', 'Standardization'] },
    { id: 'hist-mach-2', title: 'Emergency Line Rescue', date: '2024-11-05', type: 'success', category: 'milestone', description: 'Diagnosed and bypassed a critical failing sensor to save a 24-hour run.', skills: ['Troubleshooting', 'Systems Diagnosis'] },
    { id: 'hist-mach-3', title: 'Certified in Advanced SCADA Security', date: '2025-06-20', type: 'success', category: 'certification', description: 'Trained to protect industrial control systems from cyber threats.', skills: ['SCADA', 'Cybersecurity'] }
  ],
  'builder-volt': [
    { id: 'hist-volt-1', title: 'Master Electrician License', date: '2023-01-10', type: 'success', category: 'certification', description: 'Achieved the highest level of state electrical certification.', skills: ['Code Compliance', 'Electrical Engineering'] },
    { id: 'hist-volt-2', title: 'Rewired Historic City Hall', date: '2024-07-30', type: 'success', category: 'project', description: 'Successfully brought a 150-year-old building up to modern code.', skills: ['Retrofitting', 'Blueprint Reading'] },
    { id: 'hist-volt-3', title: 'Installed 5MW Solar Farm Array', date: '2025-05-15', type: 'success', category: 'milestone', description: 'Led the electrical team in connecting a massive renewable energy site.', skills: ['High Voltage', 'Renewable Energy Systems'] }
  ],

  // business-owners.ts
  'wellness-visionary': [
    { id: 'hist-well-1', title: 'Voted Best Local Spa', date: '2023-12-01', type: 'success', category: 'award', description: 'Won the city-wide reader\'s choice award for luxury wellness.', skills: ['Customer Experience', 'Brand Management'] },
    { id: 'hist-well-2', title: 'Hit $1M Annual Recurring Revenue', date: '2024-12-31', type: 'success', category: 'milestone', description: 'Reached the seven-figure milestone entirely through organic growth.', skills: ['Business Scaling', 'Financial Planning'] },
    { id: 'hist-well-3', title: 'Launched In-House Organic Skincare Line', date: '2025-08-20', type: 'success', category: 'project', description: 'Successfully formulated and sold out the first batch of branded products.', skills: ['Product Development', 'Marketing'] }
  ],
  'culinary-maestro': [
    { id: 'hist-cul-1', title: 'First Michelin Star', date: '2023-10-10', type: 'success', category: 'award', description: 'Awarded a Michelin Star for innovative fusion cuisine.', skills: ['Culinary Arts', 'Consistency'] },
    { id: 'hist-cul-2', title: 'Opened Second Concept Restaurant', date: '2024-05-15', type: 'success', category: 'milestone', description: 'Successfully launched a more casual sister-restaurant downtown.', skills: ['Expansion Strategy', 'Menu Design'] },
    { id: 'hist-cul-3', title: 'Featured in Food & Wine Magazine', date: '2025-02-28', type: 'success', category: 'publication', description: 'Profiled as one of the top rising chefs in the region.', skills: ['PR', 'Plating Aesthetics'] }
  ],
  'retail-trailblazer': [
    { id: 'hist-ret-1', title: 'Surpassed 100k Instagram Followers', date: '2023-07-22', type: 'success', category: 'milestone', description: 'Built a massive organic audience for the boutique\'s style guide.', skills: ['Social Media Marketing', 'Community Building'] },
    { id: 'hist-ret-2', title: 'Secured Exclusive Distribution Rights', date: '2024-04-10', type: 'success', category: 'project', description: 'Became the sole regional distributor for a highly sought-after European brand.', skills: ['Negotiation', 'B2B Sales'] },
    { id: 'hist-ret-3', title: 'Record-Breaking Black Friday Sales', date: '2025-11-28', type: 'success', category: 'milestone', description: 'Cleared out old inventory and generated record profits in a single weekend.', skills: ['Inventory Management', 'Campaign Execution'] }
  ],
  'service-titan': [
    { id: 'hist-srv-1', title: 'Landed First Enterprise Contract', date: '2023-03-15', type: 'success', category: 'milestone', description: 'Secured a recurring service contract with a Fortune 500 company.', skills: ['B2B Sales', 'Contract Negotiation'] },
    { id: 'hist-srv-2', title: 'Expanded Fleet to 20 Vehicles', date: '2024-09-01', type: 'success', category: 'milestone', description: 'Scaled operations to cover three new counties.', skills: ['Operations Scaling', 'Fleet Management'] },
    { id: 'hist-srv-3', title: 'Implemented Automated Dispatch System', date: '2025-06-10', type: 'success', category: 'project', description: 'Replaced manual scheduling with an AI-driven dispatch tool.', skills: ['Tech Implementation', 'Efficiency'] }
  ],
  'tech-founder': [
    { id: 'hist-tech-1', title: 'Closed Seed Funding Round', date: '2023-11-20', type: 'success', category: 'milestone', description: 'Raised $2.5M from top-tier venture capital firms.', skills: ['Pitching', 'Fundraising'] },
    { id: 'hist-tech-2', title: 'Product Hunt #1 Product of the Day', date: '2024-02-14', type: 'success', category: 'award', description: 'Achieved massive viral growth during the v1.0 public launch.', skills: ['Product Launch', 'Growth Hacking'] },
    { id: 'hist-tech-3', title: 'Reached Profitability', date: '2025-12-01', type: 'success', category: 'milestone', description: 'Crossed the threshold into positive cash flow without needing a Series A.', skills: ['Bootstrapping', 'Financial Modeling'] }
  ],

  // creative-artisans.ts
  'frame-chaser': [
    { id: 'hist-fc-1', title: 'Featured in Vogue Weddings', date: '2023-06-05', type: 'success', category: 'publication', description: 'Had a full-page spread detailing a high-profile destination wedding.', skills: ['Editorial Photography', 'Networking'] },
    { id: 'hist-fc-2', title: 'Switched to 100% Mirrorless System', date: '2024-01-15', type: 'success', category: 'milestone', description: 'Successfully migrated all gear, improving silent shooting capabilities.', skills: ['Gear Optimization', 'Adaptability'] },
    { id: 'hist-fc-3', title: 'Booked First International Campaign', date: '2025-09-20', type: 'success', category: 'project', description: 'Flew to Iceland to shoot a commercial campaign for an outerwear brand.', skills: ['Location Scouting', 'Commercial Photography'] }
  ],
  'industrial-lens': [
    { id: 'hist-il-1', title: 'Completed Aerospace Facility Shoot', date: '2023-04-12', type: 'success', category: 'project', description: 'Captured highly technical images of a new jet engine assembly line.', skills: ['Lighting Large Spaces', 'Technical Understanding'] },
    { id: 'hist-il-2', title: 'Published Industrial Photobook', date: '2024-10-30', type: 'success', category: 'publication', description: 'Released a coffee table book highlighting the beauty of manufacturing.', skills: ['Curating', 'Print Production'] },
    { id: 'hist-il-3', title: 'Secured Retainer with Global Logistics Firm', date: '2025-03-15', type: 'success', category: 'milestone', description: 'Signed a 2-year contract to document their shipping ports worldwide.', skills: ['Contract Negotiation', 'Drone Photography'] }
  ],
  'aesthetic-architect': [
    { id: 'hist-aa-1', title: 'Awwwards Site of the Day', date: '2023-08-10', type: 'success', category: 'award', description: 'Won SOTD for an immersive WebGL portfolio site.', skills: ['UI/UX Design', 'Creative Direction'] },
    { id: 'hist-aa-2', title: 'Led Rebrand for Major Fintech Startup', date: '2024-05-22', type: 'success', category: 'project', description: 'Completely overhauled their visual identity, leading to a 40% conversion increase.', skills: ['Brand Strategy', 'Visual Identity'] },
    { id: 'hist-aa-3', title: 'Launched Custom Typography Foundry', date: '2025-11-05', type: 'success', category: 'milestone', description: 'Released a highly successful geometric sans-serif font family.', skills: ['Type Design', 'E-commerce'] }
  ],
  'word-weaver': [
    { id: 'hist-ww-1', title: 'Viral Thought Leadership Article', date: '2023-02-28', type: 'success', category: 'publication', description: 'Wrote an article on tech ethics that hit the front page of HackerNews.', skills: ['Copywriting', 'Tech Journalism'] },
    { id: 'hist-ww-2', title: 'Wrote Official API Documentation', date: '2024-07-15', type: 'success', category: 'project', description: 'Authored the complete developer docs for a popular open-source framework.', skills: ['Technical Writing', 'Markdown'] },
    { id: 'hist-ww-3', title: 'Ghostwrote NYT Bestseller', date: '2025-04-10', type: 'success', category: 'milestone', description: 'Successfully ghostwrote a business strategy book for a famous CEO.', skills: ['Ghostwriting', 'Long-form Content'] }
  ],
  'code-artisan': [
    { id: 'hist-ca-1', title: 'Shipped Solo Indie Game', date: '2023-11-11', type: 'success', category: 'project', description: 'Released a critically acclaimed 2D metroidvania on Steam.', skills: ['Game Design', 'C# / Unity'] },
    { id: 'hist-ca-2', title: 'Over 10,000 GitHub Stars', date: '2024-09-05', type: 'success', category: 'milestone', description: 'Achieved massive community adoption for an open-source physics library.', skills: ['Open Source', 'Community Management'] },
    { id: 'hist-ca-3', title: 'Won Global Game Jam', date: '2025-01-26', type: 'success', category: 'award', description: 'Created the winning game prototype out of 500+ global entries in 48 hours.', skills: ['Rapid Prototyping', 'Under-pressure Coding'] }
  ],

  // operational.ts
  'compliance-sentinel': [
    { id: 'hist-comp-1', title: 'Passed SOC 2 Type II Audit', date: '2023-03-20', type: 'success', category: 'milestone', description: 'Led the organization through a flawless audit with zero exceptions.', skills: ['Audit Prep', 'Policy Enforcement'] },
    { id: 'hist-comp-2', title: 'Implemented Automated Compliance Dashboard', date: '2024-08-15', type: 'success', category: 'project', description: 'Replaced manual spreadsheet checks with real-time API monitoring.', skills: ['Risk Management', 'Data Visualization'] },
    { id: 'hist-comp-3', title: 'Certified Information Systems Auditor (CISA)', date: '2025-05-10', type: 'success', category: 'certification', description: 'Achieved global recognition as an expert in IS audit control.', skills: ['IT Governance', 'Security Protocols'] }
  ],
  'supply-chain-overlord': [
    { id: 'hist-sup-1', title: 'Resolved Suez Canal Delay Crisis', date: '2023-04-05', type: 'success', category: 'milestone', description: 'Rerouted millions in inventory to avoid a catastrophic stockout.', skills: ['Crisis Management', 'Global Logistics'] },
    { id: 'hist-sup-2', title: 'Negotiated 15% Freight Cost Reduction', date: '2024-11-20', type: 'success', category: 'project', description: 'Consolidated shipping lanes and negotiated bulk rates with new carriers.', skills: ['Negotiation', 'Cost Analysis'] },
    { id: 'hist-sup-3', title: 'Launched Zero-Carbon Logistics Initiative', date: '2025-09-12', type: 'success', category: 'project', description: 'Transitioned 30% of last-mile deliveries to electric fleets.', skills: ['Sustainability', 'Fleet Management'] }
  ],
  'financial-navigator': [
    { id: 'hist-fin-1', title: 'Discovered $2M Tax Efficiency', date: '2023-02-14', type: 'success', category: 'milestone', description: 'Found a legal restructuring loophole that saved the company millions.', skills: ['Corporate Tax Law', 'Financial Forensics'] },
    { id: 'hist-fin-2', title: 'Managed Series B Due Diligence', date: '2024-06-30', type: 'success', category: 'project', description: 'Provided flawless financial models for a $50M funding round.', skills: ['Financial Modeling', 'M&A Due Diligence'] },
    { id: 'hist-fin-3', title: 'Chartered Financial Analyst (CFA) Charterholder', date: '2025-08-15', type: 'success', category: 'certification', description: 'Passed Level III of the notoriously difficult CFA exams.', skills: ['Investment Analysis', 'Portfolio Management'] }
  ],
  'numeric-oracle': [
    { id: 'hist-num-1', title: 'Predicted Market Correction', date: '2023-10-01', type: 'success', category: 'milestone', description: 'Adjusted risk models 3 weeks before a major tech stock downturn.', skills: ['Predictive Modeling', 'Risk Assessment'] },
    { id: 'hist-num-2', title: 'Built Dynamic Pricing Algorithm', date: '2024-04-20', type: 'success', category: 'project', description: 'Created an ML model that increased overall revenue by 8%.', skills: ['Machine Learning', 'Python'] },
    { id: 'hist-num-3', title: 'Published Paper on Stochastic Volatility', date: '2025-01-12', type: 'success', category: 'publication', description: 'Contributed to the Journal of Quantitative Finance.', skills: ['Quantitative Analysis', 'Academic Writing'] }
  ],
  'yield-maximizer': [
    { id: 'hist-yld-1', title: 'Reduced Factory Downtime by 40%', date: '2023-05-15', type: 'success', category: 'milestone', description: 'Implemented predictive maintenance sensors on critical machinery.', skills: ['Predictive Maintenance', 'IoT'] },
    { id: 'hist-yld-2', title: 'Achieved ISO 9001 Certification', date: '2024-09-10', type: 'success', category: 'certification', description: 'Led the facility to meet strict international quality management standards.', skills: ['Quality Assurance', 'Process Mapping'] },
    { id: 'hist-yld-3', title: 'Optimized Energy Consumption', date: '2025-07-05', type: 'success', category: 'project', description: 'Redesigned HVAC and lighting schedules to save $500k annually.', skills: ['Energy Management', 'Operations Research'] }
  ],

  // digital-institutional.ts
  'sysadmin-overlord': [
    { id: 'hist-sys-1', title: 'Migrated 500 On-Prem Servers to Cloud', date: '2023-08-20', type: 'success', category: 'project', description: 'Executed a flawless weekend migration with zero data loss.', skills: ['Cloud Migration', 'AWS'] },
    { id: 'hist-sys-2', title: 'Thwarted Ransomware Attack', date: '2024-02-14', type: 'success', category: 'milestone', description: 'Detected and isolated a network breach within 4 minutes.', skills: ['Incident Response', 'Network Security'] },
    { id: 'hist-sys-3', title: 'Automated 90% of IT Onboarding', date: '2025-11-10', type: 'success', category: 'project', description: 'Replaced manual account creation with zero-touch provisioning scripts.', skills: ['Bash Scripting', 'Active Directory'] }
  ],
  'cyber-sentinel': [
    { id: 'hist-cyb-1', title: 'Discovered Zero-Day Vulnerability', date: '2023-04-10', type: 'success', category: 'award', description: 'Received a $50k bug bounty for finding a critical flaw in a major OS.', skills: ['Penetration Testing', 'Reverse Engineering'] },
    { id: 'hist-cyb-2', title: 'Certified Information Systems Security Professional (CISSP)', date: '2024-07-22', type: 'success', category: 'certification', description: 'Obtained the gold standard certification for cybersecurity management.', skills: ['Security Architecture', 'Risk Management'] },
    { id: 'hist-cyb-3', title: 'Redesigned Corporate Zero-Trust Architecture', date: '2025-03-15', type: 'success', category: 'project', description: 'Successfully implemented beyond-corp principles for a remote workforce.', skills: ['Zero Trust', 'Identity Management'] }
  ],
  'data-architect': [
    { id: 'hist-dat-1', title: 'Built Petabyte-Scale Data Lake', date: '2023-12-05', type: 'success', category: 'project', description: 'Designed the architecture for streaming real-time analytics across the enterprise.', skills: ['Data Engineering', 'Snowflake'] },
    { id: 'hist-dat-2', title: 'Reduced Query Costs by 60%', date: '2024-09-18', type: 'success', category: 'milestone', description: 'Optimized partition strategies and removed redundant materialized views.', skills: ['Query Optimization', 'Cost Engineering'] },
    { id: 'hist-dat-3', title: 'Speaker at AWS re:Invent', date: '2025-11-30', type: 'success', category: 'milestone', description: 'Presented a session on highly available data pipelines.', skills: ['Public Speaking', 'Cloud Architecture'] }
  ],
  'cloud-architect': [
    { id: 'hist-cld-1', title: 'AWS Certified Solutions Architect - Professional', date: '2023-01-20', type: 'success', category: 'certification', description: 'Passed the toughest AWS certification with a score of 920.', skills: ['AWS', 'System Design'] },
    { id: 'hist-cld-2', title: 'Architected Multi-Region Failover', date: '2024-06-12', type: 'success', category: 'project', description: 'Designed a system that survived a us-east-1 outage without dropping a request.', skills: ['Disaster Recovery', 'High Availability'] },
    { id: 'hist-cld-3', title: 'Led Kubernetes Transformation', date: '2025-04-05', type: 'success', category: 'milestone', description: 'Moved legacy monoliths into a modernized EKS cluster environment.', skills: ['Kubernetes', 'Docker'] }
  ],
  'devops-engineer': [
    { id: 'hist-dev-1', title: 'Achieved 4-Minute Deployment Time', date: '2023-05-10', type: 'success', category: 'milestone', description: 'Reduced CI/CD pipeline duration from 45 minutes to 4 minutes.', skills: ['CI/CD', 'GitHub Actions'] },
    { id: 'hist-dev-2', title: 'Implemented Infrastructure as Code', date: '2024-10-25', type: 'success', category: 'project', description: 'Codified all environments using Terraform, eliminating drift.', skills: ['Terraform', 'IaC'] },
    { id: 'hist-dev-3', title: 'Survived Traffic Spike (Superbowl Ad)', date: '2025-02-12', type: 'success', category: 'milestone', description: 'Auto-scaling groups flawlessly handled a 10,000% increase in traffic.', skills: ['Auto-scaling', 'Site Reliability'] }
  ]
};

const filesToUpdate = [
  'medical.ts',
  'heavy-builders.ts',
  'business-owners.ts',
  'creative-artisans.ts',
  'operational.ts',
  'digital-institutional.ts'
];

async function run() {
  for (const file of filesToUpdate) {
    const filePath = path.join(ARCHETYPES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log("Skipping " + file + " - not found.");
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    
    // We will use regex to find each archetype's id, and inject a history array right after tasks: [] or voids: []
    const idRegex = /id:\s*['"]([^'"]+)['"]/g;
    let match;
    const replacements: { start: number, newCode: string }[] = [];
    idRegex.lastIndex = 0;

    while ((match = idRegex.exec(content)) !== null) {
      const archId = match[1];
      if (customHistory[archId]) {
        // Find the 'voids:' array end and inject history: [] after it
        const voidsIndex = content.indexOf('voids:', match.index);
        if (voidsIndex !== -1 && voidsIndex < match.index + 10000) {
          const startBrack = content.indexOf('[', voidsIndex);
          if (startBrack !== -1) {
            let depth = 1;
            let endBrack = -1;
            for (let i = startBrack + 1; i < content.length; i++) {
              if (content[i] === '[') depth++;
              if (content[i] === ']') depth--;
              if (depth === 0) {
                endBrack = i;
                break;
              }
            }
            if (endBrack !== -1) {
              const historyStr = ",\\n      history: " + JSON.stringify(customHistory[archId], null, 10).replace(/"([^"]+)":/g, '$1:');
              replacements.push({
                start: endBrack + 1,
                newCode: historyStr
              });
            }
          }
        }
      }
    }

    replacements.sort((a, b) => b.start - a.start);
    for (const rep of replacements) {
      content = content.substring(0, rep.start) + rep.newCode + content.substring(rep.start);
    }

    fs.writeFileSync(filePath, content);
    console.log("Successfully updated " + file);
  }
}

run().catch(console.error);
