import { Project, SyntaxKind, Node } from 'ts-morph';

const templates = [
  "Mastery of this skill will open unforeseen doors. Keep your focus sharp.",
  "Your dedication here is rewiring your potential. Don't lose momentum.",
  "An essential pillar of your trajectory. Cultivate it daily.",
  "The Void will try to distract you from this, but the payoff is immense.",
  "A crucial node in your skill tree. Protect your time to develop it."
];
const personalTemplates = [
  "Emotional resilience is the bedrock of all your other ambitions.",
  "Your mental bandwidth depends on mastering this soft skill.",
  "A quiet, powerful capability that protects you from burnout.",
  "True leadership starts from within. Nurture this carefully."
];

async function main() {
  const project = new Project();
  project.addSourceFilesAtPaths('src/data/archetypes/*.ts');
  
  for (const sourceFile of project.getSourceFiles()) {
    if (sourceFile.getFilePath().endsWith('utils.ts')) continue;
    
    const arrays = sourceFile.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression);
    for (const arr of arrays) {
      for (const element of arr.getElements()) {
        if (Node.isObjectLiteralExpression(element)) {
          const dataProp = element.getProperty('data');
          if (dataProp && Node.isPropertyAssignment(dataProp)) {
            const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
            if (!dataObj) continue;
            
            // Skip if already has skills
            if (dataObj.getProperty('skills')) continue;

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
            
            const historyProp = dataObj.getProperty('history');
            const skillNames = new Set<string>();
            if (historyProp && Node.isPropertyAssignment(historyProp)) {
              const histArr = historyProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
              if (histArr) {
                histArr.getElements().forEach(h => {
                  if (Node.isObjectLiteralExpression(h)) {
                    const skillsP = h.getProperty('skills');
                    if (skillsP && Node.isPropertyAssignment(skillsP)) {
                      const sArr = skillsP.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
                      if (sArr) {
                        sArr.getElements().forEach(s => skillNames.add(s.getText().replace(/['"]/g, '')));
                      }
                    }
                  }
                });
              }
            }

            const newSkills: any[] = [];
            let i = 0;
            const skillList = Array.from(skillNames);
            
            // Add some generic personal skills if not enough
            if (skillList.length < 3) {
              skillList.push("Emotional Resilience", "Time Management", "Deep Work Focus");
            }

            for (const name of skillList) {
              const isPersonal = Math.random() > 0.7;
              let ambitionId = null;
              let type = 'personal';
              let rec = personalTemplates[Math.floor(Math.random() * personalTemplates.length)];

              if (!isPersonal && ambitionIds.length > 0) {
                ambitionId = ambitionIds[Math.floor(Math.random() * ambitionIds.length)];
                type = 'ambition';
                rec = templates[Math.floor(Math.random() * templates.length)];
              }

              newSkills.push({
                id: `skill-${Date.now()}-${i++}`,
                name,
                currentProficiency: 30 + Math.floor(Math.random() * 50),
                targetProficiency: 100,
                type,
                recommendation: rec,
                ambitionId
              });
            }

            dataObj.addPropertyAssignment({
              name: 'skills',
              initializer: JSON.stringify(newSkills, null, 2)
            });
            console.log('Added structured skills to', element.getProperty('id')?.getText());
          }
        }
      }
    }
    await sourceFile.save();
  }
}

main().catch(console.error);
