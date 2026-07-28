import { Project, SyntaxKind, Node, ObjectLiteralExpression } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const personalSkillsPool = [
  { name: "Emotional Resilience", rec: "The bedrock of your ambition. Nurture your capacity to bounce back." },
  { name: "Time Management", rec: "Protect your focus. The Void thrives on chaotic scheduling." },
  { name: "Deep Work Focus", rec: "Your most valuable asset in a distracted world. Cultivate extended flow states." },
  { name: "Active Listening", rec: "True leadership requires hearing what isn't said." },
  { name: "Strategic Empathy", rec: "Understanding others' motivations will unlock new collaborative pathways." },
  { name: "Stress Regulation", rec: "Master your nervous system to maintain clarity under pressure." },
  { name: "Growth Mindset", rec: "View every failure as data. Adapt and iterate continuously." },
  { name: "Radical Candor", rec: "Deliver hard truths with genuine care." },
  { name: "Cognitive Flexibility", rec: "The ability to pivot your thinking when the paradigm shifts." }
];

const hardSkillTemplates = [
  "Mastery of this skill will open unforeseen doors for this ambition. Keep your focus sharp.",
  "Your dedication here is rewiring your potential. Don't lose momentum.",
  "An essential pillar of your trajectory. Cultivate it daily.",
  "The Void will try to distract you from this, but the payoff is immense.",
  "A crucial node in your skill tree. Protect your time to develop it."
];

async function main() {
  const project = new Project();
  project.addSourceFilesAtPaths('src/data/archetypes/*.ts');
  project.addSourceFileAtPath('src/data/archetypes.ts');
  
  for (const sourceFile of project.getSourceFiles()) {
    if (sourceFile.getFilePath().endsWith('utils.ts')) continue;
    
    const arrays = sourceFile.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression);
    const dataObjsToModify: { dataObj: ObjectLiteralExpression, elementId: string | undefined }[] = [];
    
    for (const arr of arrays) {
      for (const element of arr.getElements()) {
        if (Node.isObjectLiteralExpression(element)) {
          const dataProp = element.getProperty('data');
          if (dataProp && Node.isPropertyAssignment(dataProp)) {
            const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
            if (!dataObj) continue;
            
            dataObjsToModify.push({ dataObj, elementId: element.getProperty('id')?.getText() });
          }
        }
      }
    }
    
    for (const { dataObj, elementId } of dataObjsToModify) {
      const existingSkills = dataObj.getProperty('skills');
      if (existingSkills) {
        existingSkills.remove();
      }

      const ambitionsProp = dataObj.getProperty('ambitions');
      let ambitionIds: string[] = [];
      if (ambitionsProp && Node.isPropertyAssignment(ambitionsProp)) {
        const arrExp = ambitionsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (arrExp) {
          arrExp.getElements().forEach(e => {
            if (Node.isObjectLiteralExpression(e)) {
              const idProp = e.getProperty('id');
              if (idProp && Node.isPropertyAssignment(idProp)) {
                const idStr = idProp.getInitializer()?.getText().replace(/['"]/g, '');
                if (idStr) ambitionIds.push(idStr);
              }
            }
          });
        }
      }

      const newSkills: any[] = [];
      let skillIdCounter = 0;

      // 1. Add 7 Personal Skills
      const shuffledPersonal = [...personalSkillsPool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 7; i++) {
        newSkills.push({
          id: `skill-p-${Date.now()}-${skillIdCounter++}`,
          name: shuffledPersonal[i].name,
          currentProficiency: 30 + Math.floor(Math.random() * 50),
          targetProficiency: 100,
          type: 'personal',
          recommendation: shuffledPersonal[i].rec,
          ambitionId: null
        });
      }

      // 2. Add 3 Hard Skills per Ambition
      for (const ambId of ambitionIds) {
        for (let i = 0; i < 3; i++) {
          newSkills.push({
            id: `skill-a-${Date.now()}-${skillIdCounter++}`,
            name: `Advanced ${ambId.split('-').map(s=>s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} Tactics ${i+1}`,
            currentProficiency: 20 + Math.floor(Math.random() * 60),
            targetProficiency: 100,
            type: 'ambition',
            recommendation: hardSkillTemplates[Math.floor(Math.random() * hardSkillTemplates.length)],
            ambitionId: ambId
          });
        }
      }

      dataObj.addPropertyAssignment({
        name: 'skills',
        initializer: JSON.stringify(newSkills, null, 2)
      });
      console.log('Forced compliant skills to', elementId);
    }
    await sourceFile.save();
  }
}

main().catch(console.error);
