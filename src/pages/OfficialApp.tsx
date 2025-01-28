import React, { useState, useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { useToast } from '@/hooks/use-toast';

const OfficialApp = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([80.2707, 13.0827]);
  const [duty, setDuty] = useState({
    title: "Traffic Management",
    zone: "Central Chennai",
    status: "active"
  });

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
      <div className="bg-bandobast-primary text-white p-4">
        <h1 className="text-xl font-bold">Official Dashboard</h1>
        <p className="text-sm">Current Duty: {duty.title}</p>
      </div>
      <div className="flex-1">
        <MapComponent 
          officials={[{ id: 1, name: 'You', location: currentLocation, status: 'on-duty' }]}
          isOfficialApp={true}
        />
      </div>
    </div>
  );
};

export default OfficialApp;