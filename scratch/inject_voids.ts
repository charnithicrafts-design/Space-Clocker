import fs from 'fs';
import path from 'path';

const ARCHETYPES_DIR = './src/data/archetypes';

const customVoids: Record<string, any[]> = {
  // medical.ts
  'medical-neuro': [
    { id: 'v-neuro-1', text: 'Skipping pre-op mental visualization', description: 'Increases risk of hesitation', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-neuro-2', text: 'Ignoring physical fatigue', description: 'Compromises microsurgical precision', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-neuro-3', text: 'Rushing post-op documentation', description: 'Leads to miscommunication', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'medical-er': [
    { id: 'v-er-1', text: 'Rushing patient intake', description: 'Missing critical allergies or history', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-er-2', text: 'Skipping micro-breaks', description: 'Decision fatigue leads to triage errors', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-er-3', text: 'Poor handoff communication', description: 'End-of-shift notes lacking detail', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'medical-psych': [
    { id: 'v-psych-1', text: 'Over-prescribing without therapy', description: 'Failing to address root causes', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-psych-2', text: 'Taking patient trauma home', description: 'Compassion fatigue and burnout', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-psych-3', text: 'Rushing sessions', description: 'Not allowing patients enough time to open up', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'medical-research': [
    { id: 'v-res-1', text: 'Cherry-picking favorable data', description: 'Focusing on data that supports the hypothesis', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-res-2', text: 'Delaying adverse event reports', description: 'Administrative backlog on non-critical events', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-res-3', text: 'Losing touch with patients', description: 'Forgetting the human element of the trial', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'medical-rn': [
    { id: 'v-rn-1', text: 'Alarm fatigue', description: 'Ignoring or silencing monitor alarms', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-rn-2', text: 'Skipping double-checks on meds', description: 'Rushing medication administration', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-rn-3', text: 'Lifting patients without assistance', description: 'Causing personal back injury', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],

  // heavy-builders.ts
  'builder-arch': [
    { id: 'v-arch-1', text: 'Analysis Paralysis on CAD', description: 'Obsessing over minor structural flourishes', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-arch-2', text: 'Bypassing Physical Site Visits', description: 'Trusting 2D topographical data without verification', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-arch-3', text: 'Ignoring Value Engineering', description: 'Defaulting to over-engineered materials', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'builder-struct': [
    { id: 'v-struct-1', text: 'Micromanaging Subcontractors', description: 'Hovering over specialty trades', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-struct-2', text: 'Ignoring Weather Warnings', description: 'Pushing through severe conditions', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-struct-3', text: 'Siloed Information Hoarding', description: 'Keeping updates in personal spreadsheets', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'builder-plant': [
    { id: 'v-plant-1', text: 'Chasing Vanity Metrics', description: 'Optimizing speed over line yield', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-plant-2', text: 'Bypassing Preventive Maintenance', description: 'Skipping scheduled downtime', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-plant-3', text: 'Desk-Bound Management', description: 'Managing via dashboards instead of Gemba walks', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'builder-mach': [
    { id: 'v-mach-1', text: 'Over-complicating PLC Logic', description: 'Writing undocumented ladder logic', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-mach-2', text: 'Skipping Edge Case Simulations', description: 'Assuming AGVs operate in perfect conditions', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-mach-3', text: 'Ignoring Operator Ergonomics', description: 'Designing frustrating HMI panels', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'builder-volt': [
    { id: 'v-volt-1', text: 'Complacency with Lockout/Tagout', description: 'Relying on assumptions instead of protocols', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-volt-2', text: 'Improvised Field Routing', description: 'Deviating from the master electrical plan', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-volt-3', text: 'Neglecting As-Built Docs', description: 'Failing to update schematics after mods', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],

  // business-owners.ts
  'wellness-visionary': [
    { id: 'v-well-1', text: 'Micro-managing Stylists', description: 'Creating a tense atmosphere for clients', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-well-2', text: 'Comping Services for Exposure', description: 'Giving away treatments to low-tier influencers', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-well-3', text: 'Engaging in Vendor Drama', description: 'Complaining about product reps', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'culinary-maestro': [
    { id: 'v-cul-1', text: 'Adding Unnecessary Menu Items', description: 'Bloating the menu with complex dishes', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-cul-2', text: 'Losing Temper with the Line', description: 'Screaming at sous-chefs over plating', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-cul-3', text: 'Obsessively Checking Reviews', description: 'Refreshing Yelp multiple times a day', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'retail-trailblazer': [
    { id: 'v-ret-1', text: 'Over-ordering Unproven Trends', description: 'Buying massive stock of a viral item', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-ret-2', text: 'Competitor Doomscrolling', description: 'Analyzing competitor Instagram grids', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-ret-3', text: 'Manually Packing Orders', description: 'Refusing to delegate fulfillment', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'service-titan': [
    { id: 'v-srv-1', text: 'Underpricing to Win Bids', description: 'Racing to the bottom on pricing', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-srv-2', text: 'Delaying Invoicing', description: 'Hurting cash flow by not billing promptly', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-srv-3', text: 'Over-promising Timelines', description: 'Setting unrealistic deadlines to please clients', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'tech-founder': [
    { id: 'v-tech-1', text: 'Building Without User Feedback', description: 'Engineering features no one wants', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-tech-2', text: 'Premature Scaling', description: 'Hiring too fast before product-market fit', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-tech-3', text: 'Micromanaging Developers', description: 'Dictating implementation details', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],

  // creative-artisans.ts
  'frame-chaser': [
    { id: 'v-fc-1', text: 'Gear Acquisition Syndrome', description: 'Researching lenses instead of editing', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-fc-2', text: 'Preset Tweaking Paralysis', description: 'Endlessly adjusting the same slider', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-fc-3', text: 'Instagram Doomscrolling', description: 'Comparing work to others', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'industrial-lens': [
    { id: 'v-il-1', text: 'Pixel Peeping Paralysis', description: 'Zooming to 400% for invisible dust', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-il-2', text: 'Over-packing Gear Anxiety', description: 'Packing 4 backup flashes', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-il-3', text: 'Endless Moodboarding', description: 'Avoiding drafting the actual shot list', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'aesthetic-architect': [
    { id: 'v-aa-1', text: 'Font Scrolling Abyss', description: 'Testing identical fonts for hours', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-aa-2', text: 'Alignment Obsession', description: 'Nudging by 1px repeatedly', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-aa-3', text: 'Scope Creep via Options', description: 'Designing unbillable extra concepts', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'word-weaver': [
    { id: 'v-ww-1', text: 'Research Rabbit Hole', description: 'Deep-diving into edge cases needlessly', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-ww-2', text: 'Formatting Fiddling', description: 'Trying to perfectly align Markdown', impact: 'low', maxAllowed: 3, engagedCount: 0 },
    { id: 'v-ww-3', text: 'Jargon Hoarding', description: 'Over-complicating sentences', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'code-artisan': [
    { id: 'v-ca-1', text: 'Feature Creep Fog', description: 'Simulating weather in a 2D platformer', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-ca-2', text: 'Custom Tooling Trap', description: 'Building custom editors instead of working', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-ca-3', text: 'Premature Optimization', description: 'Saving 2ms when already at 144fps', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],

  // operational.ts
  'compliance-sentinel': [
    { id: 'v-comp-1', text: 'Endless Policy Wordsmithing', description: 'Delaying rollouts over minor phrasing', impact: 'low', maxAllowed: 3, engagedCount: 0 },
    { id: 'v-comp-2', text: 'Micromanaging Discrepancies', description: 'Flagging inconsequential variances', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-comp-3', text: 'Rabbit-holing in Legacy Sheets', description: 'Wasting time in outdated logs', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'supply-chain-overlord': [
    { id: 'v-sup-1', text: 'Obsessive Tracking Refresh', description: 'Checking freight status every 5 mins', impact: 'low', maxAllowed: 3, engagedCount: 0 },
    { id: 'v-sup-2', text: 'Over-analyzing Freight Margins', description: 'Losing days over pennies per mile', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-sup-3', text: 'Engaging in Vendor Blame Games', description: 'Arguing instead of problem-solving', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'financial-navigator': [
    { id: 'v-fin-1', text: 'Manual Reconciliation Loops', description: 'Refusing to automate standard reconciliations', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-fin-2', text: 'Deep-diving Tax Hypotheticals', description: 'Researching unlikely tax scenarios', impact: 'low', maxAllowed: 3, engagedCount: 0 },
    { id: 'v-fin-3', text: 'Tinkering with Complex Macros', description: 'Building fragile Excel macros', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'numeric-oracle': [
    { id: 'v-num-1', text: 'Stochastic Parameter Over-tuning', description: 'Overfitting the model to noise', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-num-2', text: 'Dismissing Qualitative Realities', description: 'Ignoring human factors in the data', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-num-3', text: 'Formatting Actuarial Tables', description: 'Making tables pretty instead of accurate', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'yield-maximizer': [
    { id: 'v-yld-1', text: 'Chasing 0.1% Yield Optimization', description: 'Spending thousands to save pennies', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-yld-2', text: 'Over-reading Safety Logs', description: 'Finding patterns in random noise', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-yld-3', text: 'Fixating on Lab Calibrations', description: 'Recalibrating perfectly fine tools', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],

  // digital-institutional.ts
  'sysadmin-overlord': [
    { id: 'v-sys-1', text: 'Scripting One-off Tasks', description: 'Spending 4 hours scripting a 5-minute task', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-sys-2', text: 'Ignoring Ticket Documentation', description: 'Closing tickets without adding to the wiki', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-sys-3', text: 'Hoarding Server Access', description: 'Becoming a single point of failure', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'cyber-sentinel': [
    { id: 'v-cyb-1', text: 'Chasing False Positives', description: 'Investigating every low-priority alert', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-cyb-2', text: 'Draconian Policy Enforcement', description: 'Blocking legitimate work with overly strict rules', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-cyb-3', text: 'Skipping Soft Skills', description: 'Failing to educate users effectively', impact: 'low', maxAllowed: 3, engagedCount: 0 }
  ],
  'data-architect': [
    { id: 'v-dat-1', text: 'Over-normalizing Databases', description: 'Making queries painfully slow with too many joins', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-dat-2', text: 'Ignoring Data Governance', description: 'Letting bad data pollute the data lake', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-dat-3', text: 'Building Dashboards No One Uses', description: 'Creating reports without stakeholder input', impact: 'medium', maxAllowed: 2, engagedCount: 0 }
  ],
  'cloud-architect': [
    { id: 'v-cld-1', text: 'Vendor Lock-in Acceptance', description: 'Using proprietary services without an exit strategy', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-cld-2', text: 'Ignoring Cost Optimization', description: 'Leaving oversized instances running 24/7', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-cld-3', text: 'Over-engineering Microservices', description: 'Splitting simple apps into 50 tiny services', impact: 'high', maxAllowed: 1, engagedCount: 0 }
  ],
  'devops-engineer': [
    { id: 'v-dev-1', text: 'Pipeline Tinkering', description: 'Breaking CI/CD to try a new plugin', impact: 'high', maxAllowed: 1, engagedCount: 0 },
    { id: 'v-dev-2', text: 'Ignoring Developer Experience', description: 'Making deployments unnecessarily painful', impact: 'medium', maxAllowed: 2, engagedCount: 0 },
    { id: 'v-dev-3', text: 'Alert Fatigue Acceptance', description: 'Silencing pager duty instead of fixing the root cause', impact: 'high', maxAllowed: 1, engagedCount: 0 }
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
    
    // We will use regex to find each archetype's id, and replace its voids array
    const idRegex = /id:\s*['"]([^'"]+)['"]/g;
    let match;
    const replacements: { start: number, end: number, newCode: string }[] = [];

    // Reset regex
    idRegex.lastIndex = 0;

    // Find all archetype blocks
    while ((match = idRegex.exec(content)) !== null) {
      const archId = match[1];
      if (customVoids[archId]) {
        // Find the voids array for this archetype.
        // It should be shortly after the id, or within the same object.
        // We'll search forward from match.index for `voids: [` and then find the matching `]`
        
        const voidsIndex = content.indexOf('voids:', match.index);
        if (voidsIndex !== -1 && voidsIndex < match.index + 10000) { // increased bound
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
              const newVoidsStr = JSON.stringify(customVoids[archId], null, 10).replace(/"([^"]+)":/g, '$1:');
              replacements.push({
                start: startBrack,
                end: endBrack + 1,
                newCode: newVoidsStr
              });
            }
          }
        }
      }
    }

    // Apply replacements from back to front
    replacements.sort((a, b) => b.start - a.start);
    for (const rep of replacements) {
      content = content.substring(0, rep.start) + rep.newCode + content.substring(rep.end);
    }

    fs.writeFileSync(filePath, content);
    console.log("Successfully updated " + file);
  }
}

run().catch(console.error);
