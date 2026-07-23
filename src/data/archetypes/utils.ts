export const getToday = () => new Date().toISOString().split('T')[0];

export const generateHistoricalTasks = (
  archetypeId: string, 
  ambitionId: string, 
  templates: string[], 
  count: number = 150
) => {
  const tasks = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365); 
    const taskDate = new Date(now);
    taskDate.setDate(now.getDate() - daysAgo);
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomTime = `${Math.floor(Math.random() * 12 + 8).toString().padStart(2, '0')}:${(Math.floor(Math.random() * 4) * 15).toString().padStart(2, '0')}`;
    
    tasks.push({
      id: `hist-${archetypeId}-${i}`,
      title: randomTemplate,
      completed: true,
      horizon: "daily",
      plannedDate: taskDate.toISOString().split('T')[0],
      time: randomTime,
      ambitionId: ambitionId
    });
  }
  
  // Sort chronically
  return tasks.sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());
};
