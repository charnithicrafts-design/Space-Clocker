import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Load env vars
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ARCHETYPES_DIR = './src/data/archetypes';

const filesToUpdate = [
  'medical.ts',
  'heavy-builders.ts',
  'business-owners.ts',
  'creative-artisans.ts',
  'operational.ts',
  'digital-institutional.ts'
];

async function run() {
  for (const file of filesToUpdate) {
    const filePath = path.join(ARCHETYPES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} - not found.`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`Processing ${file}...`);

    const prompt = `
You are an expert Human Experience and Empathy Strategist. 
I am giving you a TypeScript file containing mock demo data for user archetypes (professions).
Currently, the \`voids\` array (anti-habits) for each archetype either contains generic placeholders or is missing entirely.

Your task:
Rewrite this ENTIRE file perfectly, keeping all existing tasks, ambitions, and stats exactly the same.
HOWEVER, you must REPLACE the \`voids: [...]\` array for EACH archetype with 3 highly curated, realistic, profession-specific anti-habits (voids).
Think about the real-life psychological friction of that specific profession.

For each void object, use this exact interface:
{
  id: "unique-id-string",
  text: "The specific anti-habit",
  description: "Why it is bad for their trajectory",
  impact: "low" | "medium" | "high",
  maxAllowed: 1 | 2 | 3,
  engagedCount: 0
}

Return ONLY the raw TypeScript code. Do not wrap it in markdown block quotes like \`\`\`typescript. I need to write it directly to the file.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          { role: 'user', parts: [{ text: prompt }, { text: content }] }
        ],
        config: {
          temperature: 0.2
        }
      });

      let newContent = response.text || '';
      // Strip markdown code blocks if any
      if (newContent.startsWith('\`\`\`typescript')) {
        newContent = newContent.replace(/^\`\`\`typescript\n/, '').replace(/\n\`\`\`$/, '');
      } else if (newContent.startsWith('\`\`\`ts')) {
        newContent = newContent.replace(/^\`\`\`ts\n/, '').replace(/\n\`\`\`$/, '');
      } else if (newContent.startsWith('\`\`\`')) {
        newContent = newContent.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
      }

      fs.writeFileSync(filePath, newContent);
      console.log(`Successfully updated ${file}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

run().catch(console.error);
