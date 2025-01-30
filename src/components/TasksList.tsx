import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/lib/supabase';

interface TasksListProps {
  tasks: Task[];
}

export const TasksList = ({ tasks }: TasksListProps) => {
  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'in-progress':
        return 50;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <Badge variant={getBadgeVariant(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                <Progress value={getProgressValue(task.status)} className="h-2" />
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks assigned</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};