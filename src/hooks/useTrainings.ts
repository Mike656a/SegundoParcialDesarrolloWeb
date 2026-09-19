import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trainingService } from '../services/trainingService';
import type { CreateTrainingDto, UpdateTrainingDto } from '../types';

export const trainingKeys = {
  all: ['trainings'] as const,
};

export function useTrainings() {
  return useQuery({
    queryKey: trainingKeys.all,
    queryFn: trainingService.getAll,
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTrainingDto) => trainingService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.all }),
  });
}

export function useUpdateTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTrainingDto }) =>
      trainingService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.all }),
  });
}

export function useDeleteTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => trainingService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.all }),
  });
}