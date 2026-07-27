const fs = require('fs');
const dir = 'src/data/archetypes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const mapping = require('./task_mapping.json');

files.forEach(f => {
  const p = dir + '/' + f;
  let content = fs.readFileSync(p, 'utf-8');
  let newContent = content;

  // We want to match milestones and inject the tasks property if it exists as [] or doesn't exist
  // A milestone looks like: { id: "m-r1", title: "Finalize trial protocols", completed: true }
  // or { id: "ms-phil-1", title: "Distill Core Archetypal Thesis", status: "completed", tasks: [ ... ] }

  const regex = /{([^}]*title:\s*['"]([^'"]+)['"][^}]*)}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const inner = match[1];
    const title = match[2];

    if (mapping[title]) {
      const taskTitles = mapping[title];
      
      // Determine if completed
      let isCompleted = false;
      if (inner.includes('completed: true') || inner.includes('status: "completed"')) {
        isCompleted = true;
      }
      
      let tasksStr = "tasks: [\n";
      for (let i = 0; i < taskTitles.length; i++) {
        const idMatch = inner.match(/id:\s*['"]([^'"]+)['"]/);
        const msId = idMatch ? idMatch[1] : ('ms-' + Math.random().toString(36).substr(2, 5));
        
        // For completed milestones, all tasks completed. For pending, maybe the first one is completed.
        let taskCompleted = isCompleted ? true : (i === 0 ? true : false);
        
        tasksStr += `                  { id: '${msId}-t${i+1}', title: '${taskTitles[i].replace(/'/g, "\\'")}', completed: ${taskCompleted} }${i === taskTitles.length - 1 ? '' : ','}\n`;
      }
      tasksStr += "                ]";

      let newInner = fullMatch;
      if (fullMatch.includes('tasks: [')) {
        // replace empty tasks array
        newInner = fullMatch.replace(/tasks:\s*\[\s*\]/, tasksStr);
      } else {
        // insert tasks before closing brace
        newInner = fullMatch.substring(0, fullMatch.lastIndexOf('}')) + ', ' + tasksStr + ' }';
      }
      
      // replace in newContent
      newContent = newContent.replace(fullMatch, newInner);
    }
  }
  
  fs.writeFileSync(p, newContent);
});

console.log("Tasks injected successfully!");
