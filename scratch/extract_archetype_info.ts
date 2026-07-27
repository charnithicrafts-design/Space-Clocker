import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();
project.addSourceFilesAtPaths('src/data/archetypes/*.ts');

const extraction: Record<string, any> = {};

for (const file of project.getSourceFiles()) {
  const arrays = file.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression);
  // Find the archetype array
  let archetypeArray;
  for (const arr of arrays) {
    if (arr.getParentIfKind(SyntaxKind.VariableDeclaration)?.getName().endsWith('Profiles')) {
      archetypeArray = arr;
      break;
    }
  }

  if (archetypeArray) {
    const elements = archetypeArray.getElements();
    for (const el of elements) {
      if (el.isKind(SyntaxKind.ObjectLiteralExpression)) {
        const idProp = el.getProperty('id');
        const idVal = idProp?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.StringLiteral)?.getLiteralValue();
        if (idVal) {
          const milestones: any[] = [];
          
          const dataProp = el.getProperty('data')?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
          const ambitionsArr = dataProp?.getProperty('ambitions')?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
          
          if (ambitionsArr) {
            for (const amb of ambitionsArr.getElements()) {
              if (amb.isKind(SyntaxKind.ObjectLiteralExpression)) {
                const msArr = amb.getProperty('milestones')?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
                if (msArr) {
                  for (const ms of msArr.getElements()) {
                    if (ms.isKind(SyntaxKind.ObjectLiteralExpression)) {
                      const msId = ms.getProperty('id')?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.StringLiteral)?.getLiteralValue();
                      const msTitle = ms.getProperty('title')?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.StringLiteral)?.getLiteralValue();
                      if (msId && msTitle) {
                        milestones.push({ id: msId, title: msTitle });
                      }
                    }
                  }
                }
              }
            }
          }

          extraction[idVal] = { milestones };
        }
      }
    }
  }
}

import fs from 'fs';
fs.writeFileSync('scratch/archetype_info.json', JSON.stringify(extraction, null, 2));
console.log('Extraction complete');
