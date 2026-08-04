import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processArchetypeFiles() {
  const dataDir = path.join(process.cwd(), 'src/data');
  const archetypesDir = path.join(dataDir, 'archetypes');
  const filesToProcess = [
    path.join(dataDir, 'archetypes.ts'),
    ...fs.readdirSync(archetypesDir).filter(f => f.endsWith('.ts')).map(f => path.join(archetypesDir, f))
  ];

  for (const file of filesToProcess) {
    if (file.includes('utils.ts')) continue;
    console.log(`Processing ${path.basename(file)}...`);
    let content = fs.readFileSync(file, 'utf-8');
    
    // We can use a regex to find all Archetype definitions and their `data` objects,
    // but a simpler way is to just let the LLM rewrite the whole file or extract the JSON, but the file has TS code.
    // Actually, maybe we can just read the file, extract the `ambitions` and `history` arrays using regex, ask LLM for `skills` array, and insert it after `history:`
  }
}
processArchetypeFiles();
