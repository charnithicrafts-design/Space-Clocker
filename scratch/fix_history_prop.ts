import { Project, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';
import * as path from 'path';

async function main() {
  const project = new Project({
    tsConfigFilePath: './tsconfig.json'
  });

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
        
        // Find history prop on the root object
        const historyProp = obj.getProperty('history');
        if (historyProp && historyProp.isKind(SyntaxKind.PropertyAssignment)) {
           const historyText = historyProp.getInitializer()?.getText();
           
           if (historyText) {
             const dataProp = obj.getProperty('data');
             if (dataProp && dataProp.isKind(SyntaxKind.PropertyAssignment)) {
               const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
               if (dataObj) {
                  // Add it to data
                  dataObj.addPropertyAssignment({
                      name: 'history',
                      initializer: historyText
                  });
               }
             }
           }
           
           // Remove it from the root object
           historyProp.remove();
           totalUpdated++;
        }
      }
    }
    sourceFile.saveSync();
    console.log(`Updated ${filePath}`);
  }
  
  console.log(`Total archetypes fixed: ${totalUpdated}/30`);
}

main().catch(console.error);
