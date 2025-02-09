import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOfficials, subscribeToOfficials } from '../lib/firebase';
import { mockTasks } from '../data/mockTasks';
import { mockOfficials } from '../data/mockOfficials';
import { useToast } from './use-toast';
import { useEffect } from 'react';
import type { Official } from '@/lib/supabase';

export const useControllerData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    console.log('Setting up Firebase real-time subscriptions...');
    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        unsubscribe = await subscribeToOfficials((updatedOfficials) => {
          console.log('Officials update received:', updatedOfficials);
          queryClient.setQueryData(['officials'], updatedOfficials);
        });
      } catch (error) {
        console.error('Error setting up subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      console.log('Cleaning up Firebase subscriptions...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  return { 
    officials: officials as Official[], 
    tasks: tasks || mockTasks 
  };
};