import { expect, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

test('Demo Data Integrity: Skill Alignment and Counts', async () => {
  const archetypesDir = path.join(process.cwd(), 'src', 'data', 'archetypes');
  const files = fs.readdirSync(archetypesDir).filter(f => f.endsWith('.ts') && !f.endsWith('utils.ts'));
  
  let allValid = true;
  const errors: string[] = [];

  for (const file of files) {
    const mod = await import(path.join(archetypesDir, file));
    const exportKey = Object.keys(mod).find(k => Array.isArray(mod[k]));
    if (!exportKey) continue;
    
    const archetypes = mod[exportKey];
    for (const archetype of archetypes) {
      const data = archetype.data;
      const skills = data.skills || [];
      const ambitions = data.ambitions || [];

      // 1. Verify at least 7 personal skills
      const personalSkills = skills.filter((s: any) => s.type === 'personal');
      if (personalSkills.length < 7) {
        errors.push(`[${archetype.id}] Missing personal skills. Expected >= 7, got ${personalSkills.length}`);
        allValid = false;
      }

      // 2. Verify at least 3 hard skills per ambition
      for (const ambition of ambitions) {
        const ambitionSkills = skills.filter((s: any) => s.type === 'ambition' && s.ambitionId === ambition.id);
        if (ambitionSkills.length < 3) {
          errors.push(`[${archetype.id}] Ambition '${ambition.title}' (${ambition.id}) is missing hard skills. Expected >= 3, got ${ambitionSkills.length}`);
          allValid = false;
        }
      }
    }
  }

  if (!allValid) {
    console.error('Demo Data Skill Audit Failed:\n' + errors.join('\n'));
  }
  expect(allValid).toBe(true);
});
