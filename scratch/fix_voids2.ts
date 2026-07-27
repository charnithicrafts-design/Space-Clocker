import fs from 'fs';
import path from 'path';

function generateGenericVoidsFor(title, id) {
  // Try to customize slightly based on title keywords
  const lower = title.toLowerCase();
  
  let void1 = "Endlessly researching instead of doing the work";
  let void2 = "Getting distracted by superficial industry drama";
  
  if (lower.includes('tech') || lower.includes('software') || lower.includes('data')) {
    void1 = "Tutorial Hell (Watching endless videos without building)";
    void2 = "Bikeshedding on tooling and config files";
  } else if (lower.includes('business') || lower.includes('founder') || lower.includes('exec')) {
    void1 = "Micromanaging minor operational details";
    void2 = "Endless networking without clear business objectives";
  } else if (lower.includes('art') || lower.includes('creative') || lower.includes('writer')) {
    void1 = "Waiting for 'perfect inspiration' to start";
    void2 = "Over-tweaking finished work instead of publishing";
  } else if (lower.includes('med') || lower.includes('doctor') || lower.includes('surgeon')) {
    void1 = "Ignoring personal bio-metrics for extra shifts";
    void2 = "Excessive doomscrolling during off-call hours";
  }

  return [
    {
      id: `void-${id}-1`,
      text: void1,
      impact: "high",
      engagedCount: 0,
      maxAllowed: 3
    },
    {
      id: `void-${id}-2`,
      text: void2,
      impact: "high",
      engagedCount: 0,
      maxAllowed: 3
    }
  ];
}

async function run() {
  const dir = 'src/data/archetypes';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const regex = /id:\s*['"]([^'"]+)['"],\s*icon:\s*[^,]+,\s*title:\s*['"]([^'"]+)['"]/g;
    let match;
    const missingVoids = [];
    
    while ((match = regex.exec(content)) !== null) {
      const id = match[1];
      const title = match[2];
      
      const nextIdIndex = content.indexOf('id:', match.index + 10);
      const chunk = content.substring(match.index, nextIdIndex === -1 ? content.length : nextIdIndex);
      
      if (!chunk.includes('voids:')) {
        missingVoids.push({ id, title, index: match.index, matchText: match[0] });
      }
    }
    
    if (missingVoids.length === 0) continue;
    
    for (let i = missingVoids.length - 1; i >= 0; i--) {
      const a = missingVoids[i];
      const voids = generateGenericVoidsFor(a.title, a.id);
      
      const voidsStr = `\n    voids: ${JSON.stringify(voids, null, 4).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, '\n    ')},`;
      content = content.substring(0, a.index + a.matchText.length) + voidsStr + content.substring(a.index + a.matchText.length);
      updatedCount++;
    }
    
    fs.writeFileSync(filePath, content);
  }
  
  console.log(`Injected missing voids for ${updatedCount} archetypes.`);
}

run();
