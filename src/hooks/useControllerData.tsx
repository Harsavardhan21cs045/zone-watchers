import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOfficials, subscribeToOfficials } from '../lib/firebase';
import { mockTasks } from '../data/mockTasks';
import { mockOfficials } from '../data/mockOfficials';
import { useToast } from './use-toast';
import { useEffect } from 'react';

export const useControllerData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch officials with Firebase
  const { data: officials = [], error: officialsError } = useQuery({
    queryKey: ['officials'],
    queryFn: async () => {
      console.log('Fetching officials from Firebase...');
      try {
        const data = await getOfficials();
        console.log('Officials fetched:', data);
        return data;
      } catch (error) {
        console.error('Error fetching officials:', error);
        console.log('Using mock officials data due to error');
        return mockOfficials;
      }
    },
    refetchInterval: 5000,
    retry: 1,
    retryDelay: 1000
  });

  // Use mock tasks and assign them to officials
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Using mock tasks and assigning to officials');
      const availableOfficials = officials.filter(off => off.status === 'on-duty');
      
      return mockTasks.map((task, index) => ({
        ...task,
        assigned_to: availableOfficials[index % availableOfficials.length]?.id || null
      }));
    },
    enabled: !!officials.length,
    staleTime: Infinity
  });

  // Show errors if any
  useEffect(() => {
    if (officialsError) {
      console.error('Officials fetch error:', officialsError);
      toast({
        title: "Connection Issue",
        description: "Using mock data. Please check your connection.",
        variant: "destructive"
      });
    }
  }, [officialsError, toast]);

  // Subscribe to real-time updates using Firebase
  useEffect(() => {
    console.log('Setting up Firebase real-time subscriptions...');
    
    const unsubscribe = subscribeToOfficials((updatedOfficials) => {
      console.log('Officials update received:', updatedOfficials);
      queryClient.setQueryData(['officials'], updatedOfficials);
    });

    return () => {
      console.log('Cleaning up Firebase subscriptions...');
      unsubscribe();
    };
  }, [queryClient]);

  return { 
    officials: officials || mockOfficials, 
    tasks: tasks || mockTasks 
  };
};