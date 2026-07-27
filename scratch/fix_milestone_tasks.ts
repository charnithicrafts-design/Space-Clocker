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

  let totalMilestonesUpdated = 0;

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
        if (!archetypeData.tasks) continue;

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
            
            if (archetypeData.tasks[mId]) {
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
              totalMilestonesUpdated++;
            }
          }
        }
      }
    }
    sourceFile.saveSync();
    console.log(`Updated tasks in ${filePath}`);
  }
  
  console.log(`Total milestones updated: ${totalMilestonesUpdated}`);
}

main().catch(console.error);
