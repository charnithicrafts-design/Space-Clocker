import { Task } from '../store/useTrackStore';

export interface ScheduleAnomaly {
  type: 'conflict' | 'pressure';
  taskId: string;
  message: string;
  severity: 'warning' | 'error';
}

export const analyzeSchedule = (tasks: Task[]): ScheduleAnomaly[] => {
  const anomalies: ScheduleAnomaly[] = [];
  const activeTasks = tasks.filter(t => !t.completed);

  // 1. Conflict Detection (Overlapping time slots)
  const sortedTasks = [...activeTasks].sort((a, b) => a.time.localeCompare(b.time));
  
  for (let i = 0; i < sortedTasks.length - 1; i++) {
    const current = sortedTasks[i];
    const next = sortedTasks[i + 1];

    if (current.endTime && current.endTime > next.time) {
      anomalies.push({
        type: 'conflict',
        taskId: next.id,
        message: `Temporal overlap detected with "${current.title}". Shift descent trajectory.`,
        severity: 'error'
      });
    }
  }

  // 2. Pressure Detection (Too many tasks in a short window)
  const taskCount = activeTasks.length;
  if (taskCount > 8) {
    anomalies.push({
      type: 'pressure',
      taskId: 'global',
      message: 'High orbital density. System pressure exceeding 85%. Consider task delegation.',
      severity: 'warning'
    });
  }

  // 3. Deadline Pressure
  const now = new Date();
  activeTasks.forEach(task => {
    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (diffHours > 0 && diffHours < 4) {
        anomalies.push({
          type: 'pressure',
          taskId: task.id,
          message: `Atmospheric entry imminent (< 4h). Prioritize immediate execution.`,
          severity: 'warning'
        });
      } else if (diffHours <= 0) {
        anomalies.push({
          type: 'conflict',
          taskId: task.id,
          message: `Stellar window closed. Deadline breach.`,
          severity: 'error'
        });
      }
    }
  });

  return anomalies;
};
