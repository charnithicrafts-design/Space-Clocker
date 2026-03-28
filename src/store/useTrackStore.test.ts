/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrackStore } from './useTrackStore';

// Mock DB client
vi.mock('../db/client', () => ({
  db: {
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn().mockResolvedValue(undefined),
    waitReady: Promise.resolve(),
  }
}));

// Mock SoundManager
vi.mock('../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
  }
}));

describe('useTrackStore Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state if needed, though Zustand persist is removed
  });

  it('should add a task to state', async () => {
    const { addTask } = useTrackStore.getState();
    const title = 'New Test Task';
    const time = '09:00';
    
    await addTask(time, title);
    
    const state = useTrackStore.getState();
    const task = state.tasks.find(t => t.title === title);
    
    expect(task).toBeDefined();
  });

  it('should update a task in state', async () => {
    const { addTask, updateTask } = useTrackStore.getState();
    await addTask('10:00', 'Original Title');
    
    const state = useTrackStore.getState();
    const task = state.tasks[state.tasks.length - 1];
    
    await updateTask(task.id, { title: 'Updated Title' });
    
    const updatedState = useTrackStore.getState();
    const updatedTask = updatedState.tasks.find(t => t.id === task.id);
    expect(updatedTask?.title).toBe('Updated Title');
  });

  it('should delete a task from state', async () => {
    const { addTask, deleteTask } = useTrackStore.getState();
    await addTask('11:00', 'To Be Deleted');
    
    const state = useTrackStore.getState();
    const task = state.tasks[state.tasks.length - 1];
    
    await deleteTask(task.id);
    
    const updatedState = useTrackStore.getState();
    expect(updatedState.tasks.find(t => t.id === task.id)).toBeUndefined();
  });
});
