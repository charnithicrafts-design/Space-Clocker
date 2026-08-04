import { Project, SyntaxKind, Node } from 'ts-morph';
import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const project = new Project();
  project.addSourceFilesAtPaths('src/data/archetypes/*.ts');
  project.addSourceFilesAtPaths('src/data/archetypes.ts');
  
  for (const sourceFile of project.getSourceFiles()) {
    if (sourceFile.getFilePath().endsWith('utils.ts')) continue;
    console.log('Processing', sourceFile.getBaseName());
    
    const arrays = sourceFile.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression);
    for (const arr of arrays) {
      for (const element of arr.getElements()) {
        if (Node.isObjectLiteralExpression(element)) {
          const dataProp = element.getProperty('data');
          if (dataProp && Node.isPropertyAssignment(dataProp)) {
            const dataObj = dataProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
            if (!dataObj) continue;
            
            if (dataObj.getProperty('skills')) continue;

            const profileProp = dataObj.getProperty('profile')?.getText() || '';
            const ambitionsProp = dataObj.getProperty('ambitions')?.getText() || '';
            const historyProp = dataObj.getProperty('history')?.getText() || '';
            
            console.log('Found archetype:', element.getProperty('id')?.getText());
            
            const prompt = `
            You are a master RPG class designer and career coach.
            Based on the following professional profile, ambitions, and history:
            ${profileProp}
            ${ambitionsProp}
            ${historyProp}
            
            Generate a realistic, emotionally resonant "skills" array.
            There should be exactly 6-8 skills.
            At least 2 skills should be "personal" (soft skills, life skills).
            The rest should be "ambition" specific (hard skills mapped to a specific ambition_id from the ambitions provided).
            Return ONLY a valid JSON array of objects with this schema:
            [
              {
                "id": "skill-1",
                "name": "Skill Name",
                "currentProficiency": 30, // 30 to 95
                "targetProficiency": 100,
                "type": "personal" | "ambition",
                "recommendation": "A beautifully written, emotional recommendation on how to master this.",
                "ambitionId": "the string ID of the ambition if type is ambition, otherwise null"
              }
            ]
            `;
            
            try {
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                }
              });
              
              let resultText = response.text || '[]';
              
              dataObj.addPropertyAssignment({
                name: 'skills',
                initializer: resultText
              });
              console.log('Added skills for archetype.');
            } catch (err) {
              console.error('LLM error', err);
            }
          }
        }
      }
    }
    await sourceFile.save();
  }
}

main().catch(console.error);
