import 'dotenv/config';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import t from '@babel/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  console.log("Starting void data generation...");
  const content = fs.readFileSync('src/data/archetypes/index.ts', 'utf-8');
  
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['typescript']
  });

  let archetypes = [];

  // Extract archetype IDs and Titles
  traverse.default(ast, {
    ObjectExpression(path) {
      if (path.parentPath.isArrayExpression() && path.parentPath.parentPath.isVariableDeclarator()) {
        const varDecl = path.parentPath.parentPath.node;
        if (varDecl.id.name === 'mastermindArchetypes') {
          let id, title;
          let hasVoids = false;
          let needsUpdate = false;
          
          path.node.properties.forEach(prop => {
            if (prop.key.name === 'id') id = prop.value.value;
            if (prop.key.name === 'title') title = prop.value.value;
            if (prop.key.name === 'voids') {
              hasVoids = true;
              if (prop.value.elements.length === 0) {
                needsUpdate = true;
              } else {
                // check maxAllowed
                prop.value.elements.forEach(el => {
                  el.properties.forEach(p => {
                    if (p.key.name === 'maxAllowed' && p.value.value === 0) {
                      needsUpdate = true;
                    }
                  });
                });
              }
            }
          });

          if (!hasVoids || needsUpdate) {
            archetypes.push({ id, title, path });
          }
        }
      }
    }
  });

  console.log(`Found ${archetypes.length} archetypes needing voids update.`);
  if (archetypes.length === 0) return;

  const batchSize = 15;
  for (let i = 0; i < archetypes.length; i += batchSize) {
    const batch = archetypes.slice(i, i + batchSize);
    console.log(`Processing batch ${i/batchSize + 1}...`);
    
    const prompt = `
Generate exactly 3 highly specific, emotionally resonant "Void Protocols" (anti-habits / distractions) for EACH of the following professional archetypes.
Return a valid JSON object mapping the archetype ID to an array of 3 void objects. 
Each void object must have EXACTLY these keys:
- id: a unique string like "void-ARCHETYPEID-1"
- text: The specific, realistic anti-habit or distraction (e.g. "Endlessly tuning vim configurations instead of coding")
- impact: "medium" or "high"
- engagedCount: 0
- maxAllowed: 3

Archetypes:
${batch.map(a => `${a.id}: ${a.title}`).join('\n')}

Output ONLY raw valid JSON (no markdown formatting, no backticks).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let voidData;
    try {
      voidData = JSON.parse(jsonStr);
    } catch(e) {
      console.error("Failed to parse JSON:", jsonStr);
      continue;
    }

    for (const a of batch) {
      const voids = voidData[a.id];
      if (!voids) continue;

      const voidElements = voids.map(v => {
        return t.objectExpression([
          t.objectProperty(t.identifier('id'), t.stringLiteral(v.id)),
          t.objectProperty(t.identifier('text'), t.stringLiteral(v.text)),
          t.objectProperty(t.identifier('impact'), t.stringLiteral(v.impact)),
          t.objectProperty(t.identifier('engagedCount'), t.numericLiteral(v.engagedCount)),
          t.objectProperty(t.identifier('maxAllowed'), t.numericLiteral(v.maxAllowed))
        ]);
      });

      let replaced = false;
      a.path.node.properties.forEach(prop => {
        if (prop.key.name === 'voids') {
          prop.value = t.arrayExpression(voidElements);
          replaced = true;
        }
      });

      if (!replaced) {
        a.path.node.properties.push(
          t.objectProperty(t.identifier('voids'), t.arrayExpression(voidElements))
        );
      }
    }
  }

  const output = generate.default(ast, {}, content);
  fs.writeFileSync('src/data/archetypes/index.ts', output.code);
  console.log("Successfully updated archetypes/index.ts!");
}

run();
