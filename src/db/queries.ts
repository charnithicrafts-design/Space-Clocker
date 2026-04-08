import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbProxy } from './client';

// --- Profile ---
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await dbProxy.getProfile();
      return res.rows[0];
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, level, xp, title }: { name: string, level: number, xp: number, title: string }) => {
      return await dbProxy.updateProfile(name, level, xp, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// --- Tasks ---
export const useTasks = (plannedDate?: string) => {
  return useQuery({
    queryKey: ['tasks', plannedDate],
    queryFn: async () => {
      const res = await dbProxy.getTasks(plannedDate);
      return res.rows;
    },
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: any) => {
      return await dbProxy.addTask(task);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.planned_date] });
      queryClient.invalidateQueries({ queryKey: ['tasks', undefined] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      return await dbProxy.updateTask(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await dbProxy.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
