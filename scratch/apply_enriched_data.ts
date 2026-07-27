import { Project, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const project = new Project({
    tsConfigFilePath: './tsconfig.json'
  });

  const enrichedData: Record<string, any> = {};

  // Load all 5 chunks
  for (let i = 0; i < 5; i++) {
    const chunkPath = path.join(process.cwd(), 'scratch', `enriched_${i}.json`);
    if (fs.existsSync(chunkPath)) {
      const data = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
      Object.assign(enrichedData, data);
    } else {
      console.error(`Chunk ${i} not found!`);
    }
  }

  const filePaths = [
    'src/data/archetypes/creative-artisans.ts',
    'src/data/archetypes/digital-institutional.ts',
    'src/data/archetypes/heavy-builders.ts',
    'src/data/archetypes/medical.ts',
    'src/data/archetypes/operational.ts',
    'src/data/archetypes/business-owners.ts'
  ];

  let totalUpdated = 0;

  for (const filePath of filePaths) {
    const sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) {
      console.error(`Could not find ${filePath}`);
      continue;
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
        if (!idText || !enrichedData[idText]) continue;

        const archetypeData = enrichedData[idText];
        
        // Update history
        const historyProp = obj.getProperty('history');
        if (historyProp && historyProp.isKind(SyntaxKind.PropertyAssignment)) {
           // We'll replace it completely with the new history array string
           const newHistoryStr = JSON.stringify(archetypeData.history, null, 2);
           historyProp.setInitializer(newHistoryStr);
        } else {
           // Add it if it doesn't exist
           obj.addPropertyAssignment({
               name: 'history',
               initializer: JSON.stringify(archetypeData.history, null, 2)
           });
        }

        // Update milestones
        const milestonesProp = obj.getProperty('milestones');
        if (milestonesProp && milestonesProp.isKind(SyntaxKind.PropertyAssignment)) {
          const milestonesArr = milestonesProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
          if (milestonesArr) {
            for (const milestone of milestonesArr.getElements()) {
              if (!milestone.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
              
              const mObj = milestone as ObjectLiteralExpression;
              const mIdProp = mObj.getProperty('id');
              if (mIdProp && mIdProp.isKind(SyntaxKind.PropertyAssignment)) {
                const mId = mIdProp.getInitializer()?.getText().replace(/['"]/g, '');
                if (mId && archetypeData.tasks[mId]) {
                  const tasksProp = mObj.getProperty('tasks');
                  const newTasksStr = JSON.stringify(archetypeData.tasks[mId], null, 2);
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
        totalUpdated++;
      }
    }
    sourceFile.saveSync();
    console.log(`Updated ${filePath}`);
  }
  
  console.log(`Total archetypes updated: ${totalUpdated}/30`);
}

main().catch(console.error);
