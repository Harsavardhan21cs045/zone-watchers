import React from 'react';

interface Official {
  id: number;
  name: string;
  status: string;
}

interface OfficialsListProps {
  officials: Official[];
}

export const OfficialsList: React.FC<OfficialsListProps> = ({ officials }) => {
  return (
    <div className="space-y-4">
      {officials.map(official => (
        <div 
          key={official.id}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 className="font-medium text-bandobast-primary">{official.name}</h3>
          <p className="text-sm text-gray-600">Status: {official.status}</p>
        </div>
      ))}
    </div>
  );
};