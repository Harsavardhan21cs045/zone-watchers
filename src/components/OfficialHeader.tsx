import React from 'react';
import { Official } from '@/lib/types';

interface OfficialHeaderProps {
  official: Official;
  onLocationUpdate?: (location: [number, number]) => void;
  onStatusUpdate?: (status: string) => void;
}

export const OfficialHeader = ({ 
  official, 
  onLocationUpdate, 
  onStatusUpdate 
}: OfficialHeaderProps) => {
  return (
    <div className="bg-primary text-primary-foreground p-4">
      <h1 className="text-xl font-bold">Official Dashboard</h1>
      <div className="flex justify-between items-center">
        <p className="text-sm opacity-90">Chennai Police Department</p>
        <p className="text-sm">
          Welcome, {official.name} ({official.status})
        </p>
      </div>
    </div>
  );
};