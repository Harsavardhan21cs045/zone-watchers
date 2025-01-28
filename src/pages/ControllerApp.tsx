import React, { useState } from 'react';
import { MapComponent } from '../components/MapComponent';
import { OfficialsList } from '../components/OfficialsList';
import { useToast } from '@/hooks/use-toast';

const ControllerApp = () => {
  const { toast } = useToast();
  const [officials] = useState([
    { id: 1, name: 'Officer Kumar', location: [80.2707, 13.0827], status: 'on-duty' },
    { id: 2, name: 'Officer Priya', location: [80.2526, 13.0010], status: 'on-duty' },
  ]);

  const handleZoneViolation = (officialId: number) => {
    const official = officials.find(o => o.id === officialId);
    if (official) {
      toast({
        title: "Zone Violation Alert",
        description: `${official.name} is outside their assigned zone`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold text-bandobast-primary mb-4">Controller Dashboard</h1>
        <OfficialsList officials={officials} />
      </div>
      <div className="w-3/4">
        <MapComponent officials={officials} onZoneViolation={handleZoneViolation} />
      </div>
    </div>
  );
};

export default ControllerApp;