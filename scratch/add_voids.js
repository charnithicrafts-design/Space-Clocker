import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const content = fs.readFileSync('src/data/archetypes.ts', 'utf-8');
  
  // Extract the archetypes array using a regex or simple eval
  const arrayStr = content.substring(content.indexOf('export const launchArchetypes: Archetype[] = [') + 'export const launchArchetypes: Archetype[] = ['.length - 1, content.lastIndexOf('];') + 1);
  
  let archetypes;
  try {
    archetypes = eval(`(${arrayStr})`);
  } catch (e) {
    console.error("Eval failed", e);
    return;
  }

  const prompt = `
For the following list of professional archetypes, generate exactly 3 highly specific, emotionally resonant "Void Protocols" (anti-habits / distractions) for EACH archetype.
Return a JSON object mapping the archetype ID to an array of 3 void objects. 
Each void object must have:
- id: a unique string like "void-ARCHETYPEID-1"
- text: The specific, realistic anti-habit or distraction (e.g. "Endlessly tuning vim configurations instead of coding")
- impact: "medium" or "high"
- engagedCount: 0
- maxAllowed: 3

Here are the archetypes:
${archetypes.map(a => `${a.id}: ${a.title}`).join('\n')}

Output ONLY valid JSON.
`;

  console.log("Calling Gemini...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  let jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  let voidData = JSON.parse(jsonStr);

  let newContent = content;
  
  for (const a of archetypes) {
    if (!voidData[a.id]) continue;
    
    // Check if voids already exists in the file for this archetype
    const idRegex = new RegExp(`id:\\s*['"]${a.id}['"]`);
    const match = newContent.match(idRegex);
    if (match) {
      // Very naive approach: replace the entire archetype string using AST or just a good script
      // Better to write a generic replacement if possible.
    }
  }
}
run();
