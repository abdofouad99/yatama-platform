import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const TasksKanbanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => api.patch(`/tasks/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tasks'] }),
  });

  const tasks = data?.data || [];
  const todo = tasks.filter((t: any) => t.status === 'todo');
  const inProgress = tasks.filter((t: any) => t.status === 'in_progress');
  const completed = tasks.filter((t: any) => t.status === 'completed');

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('taskId', id.toString());
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) updateTask.mutate({ id: Number(id), status });
  };

  const renderColumn = (title: string, taskList: any[], status: string, color: string) => (
    <div 
      onDragOver={(e) => e.preventDefault()} 
      onDrop={(e) => handleDrop(e, status)}
      style={{ background: '#fff', borderRadius: '12px', padding: '1rem', minHeight: '600px', borderTop: `4px solid ${color}` }}
    >
      <h3 style={{ borderBottom: `2px solid ${color}`, paddingBottom: '0.5rem', marginBottom: '1rem', color: '#1B3A5C' }}>{title} ({taskList.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {taskList.map(t => (
          <div 
            key={t.id} 
            draggable 
            onDragStart={(e) => handleDragStart(e, t.id)}
            style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '8px', cursor: 'grab', border: '1px solid #E0E0E0' }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1B3A5C' }}>{t.title}</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>مُسندة لـ: {t.assignee?.fullName || 'غير محدد'}</p>
            <small style={{ color: t.priority === 'high' ? 'red' : 'gray' }}>أولوية: {t.priority}</small>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1400px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>📋 المهام الميدانية (Kanban)</h1>
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
            {renderColumn('قيد الانتظار', todo, 'todo', '#FF8C00')}
            {renderColumn('قيد التنفيذ', inProgress, 'in_progress', '#3498DB')}
            {renderColumn('مكتملة', completed, 'completed', '#1F7A4A')}
          </div>
        )}
      </div>
    </div>
  );
};
export default TasksKanbanPage;
