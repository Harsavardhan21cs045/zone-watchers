import React from 'react';
import { MapComponent } from '../components/MapComponent';
import { OfficialsList } from '../components/OfficialsList';
import { useToast } from '@/hooks/use-toast';
import { useControllerData } from '@/hooks/useControllerData';

const ControllerApp = () => {
  const { toast } = useToast();
  const { officials, tasks } = useControllerData();

  const handleZoneViolation = (officialId: string) => {
    const official = officials.find(o => o.id === officialId);
    if (official) {
      toast({
        title: "Zone Violation Alert",
        description: `${official.name} is outside their assigned zone`,
        variant: "destructive"
      });
    }
  };

  const mappedOfficials = officials.map(official => ({
    id: official.id,
    name: official.name,
    location: official.current_location || [80.2707, 13.0827],
    status: official.status
  }));

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold text-bandobast-primary mb-4">Controller Dashboard</h1>
        <OfficialsList officials={officials} showLocation={true} />
      </div>
      <div className="w-3/4 p-4">
        <div className="h-full">
          <MapComponent 
            officials={mappedOfficials}
            onZoneViolation={handleZoneViolation} 
          />
        </div>
      </div>
    </div>
  );
};

export default ControllerApp;