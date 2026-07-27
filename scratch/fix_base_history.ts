import { Project, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';

const customHistory: Record<string, any[]> = {
  "mca-student": [
    {
      "id": "hist-2024-1",
      "title": "Full Stack Development Internship - Tech Mahindra",
      "date": "2024-06-01",
      "type": "success",
      "category": "internship",
      "description": "Foundational industry experience in software engineering and cloud deployment.",
      "skills": ["Full Stack", "React", "Node.js"]
    },
    {
      "id": "hist-2024-2",
      "title": "India AI Contest - Winner",
      "date": "2024-08-23",
      "type": "success",
      "category": "hackathon",
      "description": "Generative AI model for predictive healthcare analytics using Python.",
      "skills": ["Python", "Generative AI", "Data Science"]
    },
    {
      "id": "hist-2025-1",
      "title": "AWS Certified Cloud Practitioner",
      "date": "2025-02-15",
      "type": "success",
      "category": "certification",
      "description": "Validated foundational understanding of AWS Cloud services and architecture.",
      "skills": ["AWS", "Cloud Computing"]
    }
  ],
  "philosopher": [
    {
      "id": "hist-phil-1",
      "title": "Published First Peer-Reviewed Essay",
      "date": "2023-10-14",
      "type": "success",
      "category": "publication",
      "description": "A 20-page exploration of existential phenomenology in modern digital spaces.",
      "skills": ["Writing", "Phenomenology", "Research"]
    },
    {
      "id": "hist-phil-2",
      "title": "Completed 10-Day Vipassana Retreat",
      "date": "2024-03-01",
      "type": "success",
      "category": "wellness",
      "description": "Total silence and deep meditation, solidifying the capacity for uninterrupted focus.",
      "skills": ["Focus", "Mindfulness", "Resilience"]
    },
    {
      "id": "hist-phil-3",
      "title": "Rejected by Major Publishing House",
      "date": "2024-11-12",
      "type": "failure",
      "category": "career",
      "description": "First draft of the Magnum Opus was deemed 'too esoteric'. Used the feedback to rebuild the arguments stronger.",
      "skills": ["Resilience", "Editing"]
    }
  ],
  "astronaut": [
    {
      "id": "hist-astro-1",
      "title": "Selected for NASA Astronaut Candidate Class",
      "date": "2022-01-10",
      "type": "success",
      "category": "career",
      "description": "Chosen from over 12,000 applicants to join the elite training program.",
      "skills": ["Leadership", "Physical Fitness", "STEM"]
    },
    {
      "id": "hist-astro-2",
      "title": "Survived Winter Survival Training",
      "date": "2023-02-15",
      "type": "success",
      "category": "training",
      "description": "Endured 72 hours in extreme cold weather environments to build team cohesion and survival skills.",
      "skills": ["Survival", "Teamwork", "Resilience"]
    },
    {
      "id": "hist-astro-3",
      "title": "Failed Initial Centrifuge Spin Test",
      "date": "2023-06-20",
      "type": "failure",
      "category": "training",
      "description": "Lost consciousness at 7Gs. Required intense cardiovascular re-conditioning before passing on the second attempt.",
      "skills": ["Physical Endurance", "G-Force Tolerance"]
    }
  ],
  "space-scientist": [
    {
      "id": "hist-sci-1",
      "title": "First Co-Author Publication in Nature",
      "date": "2023-09-05",
      "type": "success",
      "category": "publication",
      "description": "Groundbreaking paper on atmospheric modeling of gas giants.",
      "skills": ["Astrophysics", "Data Analysis", "Academic Writing"]
    },
    {
      "id": "hist-sci-2",
      "title": "Awarded Post-Doctoral Fellowship",
      "date": "2024-04-12",
      "type": "success",
      "category": "career",
      "description": "Secured funding for 3 years to independently study exoplanet habitability.",
      "skills": ["Grant Writing", "Research Design"]
    },
    {
      "id": "hist-sci-3",
      "title": "Equipment Failure during Telescope Observation",
      "date": "2025-01-18",
      "type": "failure",
      "category": "research",
      "description": "Lost 14 hours of crucial observational data due to a cryogenic cooling malfunction.",
      "skills": ["Troubleshooting", "Crisis Management"]
    }
  ],
  "professor": [
    {
      "id": "hist-prof-1",
      "title": "Awarded University Teaching Excellence Award",
      "date": "2022-05-20",
      "type": "success",
      "category": "award",
      "description": "Recognized by the student body and faculty for outstanding dedication to mentorship.",
      "skills": ["Public Speaking", "Mentorship", "Pedagogy"]
    },
    {
      "id": "hist-prof-2",
      "title": "First PhD Student Successfully Defends Thesis",
      "date": "2023-08-15",
      "type": "success",
      "category": "mentorship",
      "description": "A deeply rewarding moment validating years of guidance and academic cultivation.",
      "skills": ["Advising", "Academic Leadership"]
    },
    {
      "id": "hist-prof-3",
      "title": "Major Grant Proposal Denied by NSF",
      "date": "2024-02-10",
      "type": "failure",
      "category": "finance",
      "description": "A highly anticipated $1M grant was rejected. Resulted in a complete restructuring of the lab's financial strategy.",
      "skills": ["Grant Writing", "Resilience", "Strategic Planning"]
    }
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
      const idProp = obj.getProperty('id');
      if (!idProp || !idProp.isKind(SyntaxKind.PropertyAssignment)) continue;
      
      const idText = idProp.getInitializer()?.getText().replace(/['"]/g, '');
      if (!idText || !customHistory[idText]) continue;

      const dataProp = obj.getProperty('data');
      if (!dataProp || !dataProp.isKind(SyntaxKind.PropertyAssignment)) continue;
      
      const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!dataObj) continue;

      const historyProp = dataObj.getProperty('history');
      const newHistoryStr = JSON.stringify(customHistory[idText], null, 2);
      
      if (historyProp && historyProp.isKind(SyntaxKind.PropertyAssignment)) {
        historyProp.setInitializer(newHistoryStr);
      } else {
        dataObj.addPropertyAssignment({
          name: 'history',
          initializer: newHistoryStr
        });
      }
    }
  }
  
  sourceFile.saveSync();
  console.log(`Updated history in ${filePath}`);
}

main().catch(console.error);
