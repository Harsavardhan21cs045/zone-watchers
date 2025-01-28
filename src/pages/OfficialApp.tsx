import React, { useState, useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: number;
  title: string;
  location: [number, number];
  status: 'pending' | 'in-progress' | 'completed';
}

const OfficialApp = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([80.2707, 13.0827]);
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Traffic Management at T. Nagar",
      location: [80.2326, 13.0418],
      status: 'pending'
    },
    {
      id: 2,
      title: "Security Check at Marina Beach",
      location: [80.2829, 13.0499],
      status: 'in-progress'
    }
  ]);

  useEffect(() => {
    // Simulate receiving location updates
    const interval = setInterval(() => {
      setCurrentLocation(prev => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">Official Dashboard</h1>
        <p className="text-sm opacity-90">Chennai Police Department</p>
      </div>
      
      <div className="flex flex-1 p-4 gap-4">
        <div className="w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 bg-card rounded-lg border shadow-sm"
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      Status: {task.status}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <MapComponent 
            officials={[
              { 
                id: 1, 
                name: 'You', 
                location: currentLocation, 
                status: 'on-duty' 
              },
              ...tasks.map(task => ({
                id: task.id + 100, // Avoid ID collision
                name: task.title,
                location: task.location,
                status: task.status
              }))
            ]}
            isOfficialApp={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OfficialApp;