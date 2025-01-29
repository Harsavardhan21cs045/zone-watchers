import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Official {
  id: string;
  name: string;
  status: string;
  current_location?: [number, number] | null;
}

interface OfficialsListProps {
  officials: Official[];
  showLocation?: boolean;
}

export const OfficialsList: React.FC<OfficialsListProps> = ({ officials, showLocation }) => {
  return (
    <div className="space-y-4">
      {officials.map(official => (
        <div 
          key={official.id}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-bandobast-primary">{official.name}</h3>
              <p className="text-sm text-gray-600">
                Status: <Badge variant={official.status === 'on-duty' ? 'default' : 'secondary'}>
                  {official.status}
                </Badge>
              </p>
            </div>
            {showLocation && official.current_location && (
              <div className="text-xs text-gray-500">
                Location: [{official.current_location[0].toFixed(4)}, {official.current_location[1].toFixed(4)}]
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};