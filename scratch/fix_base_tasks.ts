import { Project, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression } from 'ts-morph';

const customTasks: Record<string, any[]> = {
  "ms-mca-1": [
    { id: "task-mca-1-1", title: "Complete Stephen Maarek's AWS course sections 1-5", completed: true, weightage: 10, time: 120 },
    { id: "task-mca-1-2", title: "Take 3 practice exams on TutorialsDojo", completed: true, weightage: 10, time: 180 },
    { id: "task-mca-1-3", title: "Schedule and pass the final certification exam", completed: true, weightage: 20, time: 120 }
  ],
  "ms-mca-2": [
    { id: "task-mca-2-1", title: "Containerize React frontend and Node backend with Docker", completed: true, weightage: 10, time: 90 },
    { id: "task-mca-2-2", title: "Write Kubernetes deployment and service YAML manifests", completed: true, weightage: 10, time: 90 },
    { id: "task-mca-2-3", title: "Configure Ingress controller and TLS certificates", completed: true, weightage: 10, time: 60 }
  ],
  "ms-mca-3": [
    { id: "task-mca-3-1", title: "Set up cross-region replication for DynamoDB", completed: false, weightage: 10, time: 60 },
    { id: "task-mca-3-2", title: "Configure Route 53 health checks and failover routing", completed: false, weightage: 10, time: 90 },
    { id: "task-mca-3-3", title: "Test and document RTO and RPO metrics during simulated failure", completed: false, weightage: 20, time: 120 }
  ],
  "ms-mca-4": [
    { id: "task-mca-4-1", title: "Deep dive into AWS Organizations and SCPs", completed: false, weightage: 10, time: 120 },
    { id: "task-mca-4-2", title: "Master advanced networking: Transit Gateway and Direct Connect", completed: false, weightage: 15, time: 180 },
    { id: "task-mca-4-3", title: "Complete the 3-hour Professional practice exam", completed: false, weightage: 20, time: 180 }
  ],
  "ms-phil-1": [
    { id: "task-phil-1-1", title: "Re-read Jung's Red Book focusing on the shadow archetype", completed: true, weightage: 10, time: 240 },
    { id: "task-phil-1-2", title: "Draft the foundational thesis statement and core arguments", completed: true, weightage: 15, time: 180 },
    { id: "task-phil-1-3", title: "Present thesis outline to the fellowship committee for review", completed: true, weightage: 10, time: 60 }
  ],
  "ms-phil-2": [
    { id: "task-phil-2-1", title: "Categorize 150 primary phenomenological texts", completed: true, weightage: 20, time: 300 },
    { id: "task-phil-2-2", title: "Synthesize Heideggerian concepts of Dasein with modern existentialism", completed: true, weightage: 15, time: 240 },
    { id: "task-phil-2-3", title: "Finalize the 50-page literature review manuscript", completed: true, weightage: 15, time: 300 }
  ],
  "ms-phil-3": [
    { id: "task-phil-3-1", title: "Write Chapter 1: The Fragmentation of Modern Meaning", completed: true, weightage: 10, time: 180 },
    { id: "task-phil-3-2", title: "Write Chapter 2: Historical Precedents of Nihilism", completed: true, weightage: 10, time: 180 },
    { id: "task-phil-3-3", title: "Edit and refine the first 10,000 words", completed: true, weightage: 10, time: 120 }
  ],
  "ms-phil-4": [
    { id: "task-phil-4-1", title: "Outline the integration phase and cognitive rebirth", completed: false, weightage: 10, time: 120 },
    { id: "task-phil-4-2", title: "Draft the concluding arguments on meaning-making", completed: false, weightage: 15, time: 180 },
    { id: "task-phil-4-3", title: "Submit Volume 2 to the peer-review board", completed: false, weightage: 10, time: 30 }
  ],
  "ms-phil-5": [
    { id: "task-phil-5-1", title: "Delete all social media applications from mobile devices", completed: true, weightage: 5, time: 15 },
    { id: "task-phil-5-2", title: "Install website blockers for news and entertainment sites", completed: true, weightage: 5, time: 30 },
    { id: "task-phil-5-3", title: "Replace evening scrolling with contemplative reading", completed: true, weightage: 10, time: 60 }
  ],
  "ms-phil-6": [
    { id: "task-phil-6-1", title: "Establish the morning isolation protocol (no internet until noon)", completed: false, weightage: 10, time: 60 },
    { id: "task-phil-6-2", title: "Track deep work blocks using the physical ledger", completed: false, weightage: 5, time: 15 },
    { id: "task-phil-6-3", title: "Complete the 90-day uninterrupted streak", completed: false, weightage: 20, time: 0 }
  ],
  "ms-astro-1": [
    { id: "task-astro-1-1", title: "Complete 50 hours in the VR docking simulator", completed: true, weightage: 10, time: 3000 },
    { id: "task-astro-1-2", title: "Master manual override protocols for thruster failure", completed: true, weightage: 15, time: 120 },
    { id: "task-astro-1-3", title: "Pass the final instructor-led rendezvous evaluation", completed: true, weightage: 20, time: 180 }
  ],
  "ms-astro-2": [
    { id: "task-astro-2-1", title: "Begin customized cardiovascular stress conditioning", completed: true, weightage: 10, time: 60 },
    { id: "task-astro-2-2", title: "Complete the 6G sustained centrifuge profile", completed: true, weightage: 10, time: 120 },
    { id: "task-astro-2-3", title: "Complete the 9G peak centrifuge profile without LOC", completed: true, weightage: 20, time: 120 }
  ],
  "ms-astro-3": [
    { id: "task-astro-3-1", title: "Familiarize with the new xEMU suit mobility", completed: false, weightage: 10, time: 180 },
    { id: "task-astro-3-2", title: "Execute the 6-hour underwater lunar habitat assembly simulation", completed: false, weightage: 15, time: 360 },
    { id: "task-astro-3-3", title: "Pass the emergency suit depressurization drill", completed: false, weightage: 10, time: 120 }
  ],
  "ms-astro-4": [
    { id: "task-astro-4-1", title: "Memorize all 1,200 emergency abort codes", completed: false, weightage: 15, time: 240 },
    { id: "task-astro-4-2", title: "Simulate life support systems failure troubleshooting", completed: false, weightage: 10, time: 180 },
    { id: "task-astro-4-3", title: "Ace the written and practical command module exam", completed: false, weightage: 20, time: 240 }
  ],
  "ms-sci-1": [
    { id: "task-sci-1-1", title: "Draft the scientific justification for K2-18b observation", completed: true, weightage: 10, time: 180 },
    { id: "task-sci-1-2", title: "Perform feasibility calculations for the required exposure time", completed: true, weightage: 10, time: 120 },
    { id: "task-sci-1-3", title: "Submit the finalized proposal to the allocation committee", completed: true, weightage: 10, time: 30 }
  ],
  "ms-sci-2": [
    { id: "task-sci-2-1", title: "Download the raw telemetry from the deep space network", completed: true, weightage: 5, time: 60 },
    { id: "task-sci-2-2", title: "Run the cosmic ray rejection algorithms", completed: true, weightage: 10, time: 120 },
    { id: "task-sci-2-3", title: "Calibrate the spectra using the host star's baseline", completed: true, weightage: 15, time: 180 }
  ],
  "ms-sci-3": [
    { id: "task-sci-3-1", title: "Fit atmospheric models to the transmission spectrum", completed: false, weightage: 15, time: 240 },
    { id: "task-sci-3-2", title: "Calculate the statistical significance of the methane detection", completed: false, weightage: 15, time: 120 },
    { id: "task-sci-3-3", title: "Rule out false positives from stellar activity", completed: false, weightage: 10, time: 120 }
  ],
  "ms-sci-4": [
    { id: "task-sci-4-1", title: "Outline the proposed multi-planet survey methodology", completed: false, weightage: 10, time: 120 },
    { id: "task-sci-4-2", title: "Draft the budget narrative for postdoctoral support", completed: false, weightage: 10, time: 90 },
    { id: "task-sci-4-3", title: "Submit the proposal before the Q3 deadline", completed: false, weightage: 10, time: 30 }
  ],
  "ms-prof-1": [
    { id: "task-prof-1-1", title: "Draft the preliminary grant narrative", completed: true, weightage: 10, time: 180 },
    { id: "task-prof-1-2", title: "Gather letters of support from industry partners", completed: true, weightage: 10, time: 120 },
    { id: "task-prof-1-3", title: "Present the finalized budget to the University Dean", completed: true, weightage: 10, time: 60 }
  ],
  "ms-prof-2": [
    { id: "task-prof-2-1", title: "Select the primary textbooks and recent journal articles", completed: true, weightage: 10, time: 120 },
    { id: "task-prof-2-2", title: "Design the syllabus and weekly problem sets", completed: true, weightage: 10, time: 180 },
    { id: "task-prof-2-3", title: "Integrate observational data projects into the curriculum", completed: true, weightage: 10, time: 120 }
  ],
  "ms-prof-3": [
    { id: "task-prof-3-1", title: "Review and select the abstract submissions", completed: false, weightage: 10, time: 180 },
    { id: "task-prof-3-2", title: "Finalize the keynote speakers and session chairs", completed: false, weightage: 10, time: 90 },
    { id: "task-prof-3-3", title: "Deliver the opening remarks at the symposium", completed: false, weightage: 10, time: 60 }
  ],
  "ms-prof-4": [
    { id: "task-prof-4-1", title: "Conduct comprehensive review of Candidate A's thesis draft", completed: false, weightage: 10, time: 240 },
    { id: "task-prof-4-2", title: "Run mock defense sessions for Candidates B and C", completed: false, weightage: 15, time: 180 },
    { id: "task-prof-4-3", title: "Sign the final approval paperwork for all three candidates", completed: false, weightage: 20, time: 30 }
  ]
};

async function main() {
  const project = new Project({
    tsConfigFilePath: './tsconfig.json'
  });

  const filePath = 'src/data/archetypes.ts';
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) {
    console.error(`Could not find ${filePath}`);
    return;
  }

  const exportDecls = sourceFile.getVariableDeclarations();
  for (const decl of exportDecls) {
    const init = decl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
    if (!init) continue;

    for (const element of init.getElements()) {
      if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) continue;

      const obj = element as ObjectLiteralExpression;
      
      const dataProp = obj.getProperty('data');
      if (!dataProp || !dataProp.isKind(SyntaxKind.PropertyAssignment)) continue;
      
      const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!dataObj) continue;

      const ambitionsProp = dataObj.getProperty('ambitions');
      if (!ambitionsProp || !ambitionsProp.isKind(SyntaxKind.PropertyAssignment)) continue;
      
      const ambitionsArr = ambitionsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (!ambitionsArr) continue;

      for (const ambition of ambitionsArr.getElements()) {
        if (!ambition.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
        const aObj = ambition as ObjectLiteralExpression;
        
        const milestonesProp = aObj.getProperty('milestones');
        if (!milestonesProp || !milestonesProp.isKind(SyntaxKind.PropertyAssignment)) continue;
        
        const milestonesArr = milestonesProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!milestonesArr) continue;
        
        for (const milestone of milestonesArr.getElements()) {
          if (!milestone.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
          
          const mObj = milestone as ObjectLiteralExpression;
          const mIdProp = mObj.getProperty('id');
          if (!mIdProp || !mIdProp.isKind(SyntaxKind.PropertyAssignment)) continue;
          
          const mId = mIdProp.getInitializer()?.getText().replace(/['"]/g, '');
          if (!mId) continue;
          
          if (customTasks[mId]) {
            const tasksProp = mObj.getProperty('tasks');
            const newTasksStr = JSON.stringify(customTasks[mId], null, 2);
            if (tasksProp && tasksProp.isKind(SyntaxKind.PropertyAssignment)) {
              tasksProp.setInitializer(newTasksStr);
            } else {
              mObj.addPropertyAssignment({
                name: 'tasks',
                initializer: newTasksStr
              });
            }
          }
        }
      }
    }
  }
  sourceFile.saveSync();
  console.log(`Updated tasks in ${filePath}`);
}

main().catch(console.error);
