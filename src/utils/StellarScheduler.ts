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

/**
 * Identifies uncompleted tasks from previous days and rolls them forward to the current date.
 * Each drift event is recorded in the reflections log.
 */
export const reconcileDailyTasks = async (db: any, today: string) => {
  // 1. Find tasks from previous days that were not completed
  const overdueTasks = await db.query(`
    SELECT id, title, planned_date 
    FROM tasks 
    WHERE completed = false 
    AND planned_date < $1 
    AND horizon = 'daily'
  `, [today]);

  if (overdueTasks.rows.length === 0) return;

  console.log(`[Reconciliation] Rolling forward ${overdueTasks.rows.length} incomplete tasks.`);

  await db.transaction(async (tx: any) => {
    for (const task of overdueTasks.rows) {
      // 2. Update their planned_date to today
      await tx.query(`
        UPDATE tasks 
        SET planned_date = $1 
        WHERE id = $2
      `, [today, task.id]);

      // 3. Create a reflection entry
      const reflectionId = `drift-${task.id}-${today}`;
      await tx.query(`
        INSERT INTO reflections (id, date, content, type)
        VALUES ($1, $2, $3, 'missed-task')
        ON CONFLICT (id) DO NOTHING
      `, [
        reflectionId, 
        today, 
        `Trajectory Drift: "${task.title}" shifted from ${task.planned_date} to ${today} due to orbital decay.`
      ]);
    }
  });
};
