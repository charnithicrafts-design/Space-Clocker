import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths('src/data/archetypes/*.ts');

const milestoneEnhancements: Record<string, { title: string }> = {
  // digital-institutional.ts
  "ms-6e37a551": { title: "Finalize PRD: Secure buy-in from engineering & design leads" },
  "ms-f6a85447": { title: "Beta Testing: Onboard 500 legacy users & map friction logs" },
  "ms-5b833b87": { title: "General Availability: Achieve zero-downtime global rollout" },
  "ms-15e840a0": { title: "Define Curriculum: Map out core competencies for junior PMs" },
  "ms-a5c9ece6": { title: "Host First Cohort: Mentor 15 aspiring product managers" },
  
  "ms-183be0f5": { title: "Complete Lab Machines: Root all 75 active directory boxes" },
  "ms-a56fe2fd": { title: "Pass 24hr Exam: Secure 5 systems without sleep" },
  "ms-1f4d91c7": { title: "External Pentest: Breach the staging perimeter" },
  "ms-c19bf669": { title: "Social Engineering: Execute targeted phishing on C-suite" },
  "ms-c3fec0ed": { title: "Final Report: Present critical vulnerabilities to the Board" },

  "ms-589ff4c2": { title: "Design Bronze/Silver/Gold Tiers: Define medallion architecture" },
  "ms-3bde0c67": { title: "ETL Refactor: Cut Snowflake compute costs by 40%" },
  "ms-dd003460": { title: "Deprecate Legacy DB: Shut down the monolithic oracle cluster" },
  
  "ms-6273cba1": { title: "Set up Data Replication: Ensure sub-second latency across oceans" },
  "ms-b02af1cd": { title: "Simulate us-east-1 Outage: Prove zero data loss in chaos test" },
  "ms-03b8e4e9": { title: "Finalize failover runbooks: Empower L1 support for disaster recovery" },
  "ms-83b32db4": { title: "Containerize monolith: Break down 10-year-old spaghetti code" },
  "ms-0b70a7b5": { title: "Set up Helm charts: Standardize deployments across all squads" },
  
  "ms-2e061ff5": { title: "Implement Terraform modules: Codify AWS infrastructure" },
  "ms-b6058e57": { title: "Migrate QA to automated pipelines: Stop manual deployment pain" },
  "ms-0c2fdbff": { title: "Achieve 4-minute deployment: Optimize GitHub Actions caching" },

  // operational.ts
  "ms-5b91c4b2": { title: "Site A Pre-Assessment: Uncover hidden safety violations" },
  "ms-42fbecfd": { title: "Remediation Follow-ups: Enforce strict compliance mandates" },
  "ms-cb032225": { title: "Final Board Report: Present zero-liability audit results" },
  "ms-7bc8f0a1": { title: "Route Optimization: Slash last-mile transit times by 15%" },
  "ms-d0891d4e": { title: "Supplier Renegotiation: Lock in 3-year raw material rates" },
  "ms-1e0e843f": { title: "Implement RFID tracking: Achieve 99.9% inventory accuracy" },

  // business-owners.ts
  "ms-0156d8cf": { title: "Secure Commercial Lease: Negotiate prime downtown foot traffic" },
  "ms-9fea25c9": { title: "Finalize Interior Design: Create an Instagram-worthy aesthetic" },
  "ms-715fcbab": { title: "Hire Flagship Manager: Poach top-tier retail talent" },
  "ms-0df3a131": { title: "Launch loyalty program: Drive 40% repeat customer retention" },
  "ms-1f0612bb": { title: "Run geo-targeted ad campaign: Dominate local search results" },

  "ms-7c18db35": { title: "Finalize tasting menu: Perfect the 12-course flavor arc" },
  "ms-e87f1c13": { title: "Source local ingredients: Partner with organic heirloom farms" },
  "ms-90d2382f": { title: "Train front-of-house staff: Rehearse Michelin-standard service" },

  "ms-73cf3142": { title: "Cull 5000 images: Find the emotional core of the Smith wedding" },
  "ms-c5c63af0": { title: "Initial color grade: Apply signature moody aesthetic to Jones gallery" },
  "ms-b22aff4b": { title: "Deliver final gallery: Exceed the Williams family expectations" },
  "ms-4a38fbc8": { title: "Select top 50 shots: Curate a breathtaking 2026 portfolio" },
  "ms-53b7acbe": { title: "Write service descriptions: Command premium artisan pricing" },

  // medical.ts
  "m-n1": { title: "Complete 100 Surgeries: Master the minimally invasive technique" },
  "m-n2": { title: "Publish Findings: Submit peer-reviewed results to The Lancet" },
  
  // heavy-builders.ts
  "ms-4cdd7782": { title: "Finalize subgrade blueprints: Guarantee 100-year foundation stability" },
  "ms-da4e2b8e": { title: "Approve deep piling plan: Navigate complex subterranean bedrock" },
  "ms-076fed79": { title: "Municipal drainage: Engineer flood-proof storm retention" },
  
  "ms-05a2210e": { title: "Structural integrity assessment: X-ray the 50-year-old suspension cables" },
  "ms-21869cf1": { title: "Design damper installations: Absorb 8.0 magnitude seismic shockwaves" },
  
  "ms-dfd3baa8": { title: "Map current value stream: Expose hidden assembly bottlenecks" },
  "ms-7bb0fef6": { title: "Statistical process control: Reduce defect tolerance to Six Sigma" },
  "ms-a376deb1": { title: "Train shift supervisors: Cultivate a Kaizen continuous improvement culture" },

  "ms-cde68f7f": { title: "Map facility for LiDAR: Establish millimeter-perfect AGV routes" },
  "ms-6e5c340c": { title: "Program traffic control: Prevent autonomous vehicle gridlock" },
  "ms-10b66cd4": { title: "Full fleet dry run: Execute 24-hour lights-out manufacturing test" },

  "ms-47c7dac2": { title: "Main switchgear installation: Power the 50MW data center core" },
  "ms-95dfa44d": { title: "Pull primary feeder cables: Route heavy copper through sub-floors" },
  "ms-855deb3b": { title: "Commission backup generators: Guarantee 99.999% uptime during grid failure" }
};

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  
  const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
  
  for (const obj of objectLiterals) {
    const idProp = obj.getProperty('id');
    const titleProp = obj.getProperty('title');
    
    if (idProp && titleProp && idProp.isKind(SyntaxKind.PropertyAssignment) && titleProp.isKind(SyntaxKind.PropertyAssignment)) {
      const idVal = idProp.getInitializerIfKind(SyntaxKind.StringLiteral)?.getLiteralValue();
      if (idVal && milestoneEnhancements[idVal]) {
        titleProp.setInitializer('"' + milestoneEnhancements[idVal].title + '"');
        changed = true;
      }
    }
  }

  if (changed) {
    sourceFile.saveSync();
    console.log("Updated milestones in " + sourceFile.getBaseName());
  }
}
