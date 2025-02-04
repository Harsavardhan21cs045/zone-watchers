import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/firebase';
import { TasksList } from '@/components/TasksList';
import { OfficialHeader } from '@/components/OfficialHeader';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Official, Task } from '@/lib/types';

const OfficialApp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const officialId = localStorage.getItem('officialId');

  // Fetch official data
  const { data: official, isLoading: officialLoading } = useQuery({
    queryKey: ['official', officialId],
    queryFn: async () => {
      if (!officialId) throw new Error('No official ID found');
      const docRef = doc(db, 'officials', officialId);
      const docSnap = await getDocs(collection(db, 'officials'));
      const officials = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Official[];
      return officials.find(o => o.id === officialId);
    },
  });

  // Fetch tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
    },
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async (location: [number, number]) => {
      if (!officialId) throw new Error('No official ID found');
      const officialRef = doc(db, 'officials', officialId);
      await updateDoc(officialRef, {
        current_location: location,
        last_updated: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official'] });
      toast({
        title: 'Location updated',
        description: 'Your location has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: 'Failed to update location. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!officialId) throw new Error('No official ID found');
      const officialRef = doc(db, 'officials', officialId);
      await updateDoc(officialRef, {
        status,
        last_updated: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official'] });
      toast({
        title: 'Status updated',
        description: 'Your status has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (officialLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  if (!official) {
    return <div>Official not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <OfficialHeader
        official={official}
        onLocationUpdate={(location) => updateLocationMutation.mutate(location)}
        onStatusUpdate={(status) => updateStatusMutation.mutate(status)}
      />
      <main className="container mx-auto px-4 py-8">
        <TasksList tasks={tasks || []} officialId={officialId || ''} />
      </main>
    </div>
  );
};

export default OfficialApp;