import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const PermissionsAdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ id: 0, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: () => api.get('/permissions').then(r => r.data)
  });

  const createPerm = useMutation({
    mutationFn: (d: any) => api.post('/permissions', d).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      setFormData({ id: 0, name: '', description: '' });
    }
  });

  const updatePerm = useMutation({
    mutationFn: (d: any) => api.put(`/permissions/${d.id}`, d).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      setFormData({ id: 0, name: '', description: '' });
      setIsEditing(false);
    }
  });

  const deletePerm = useMutation({
    mutationFn: (id: number) => api.delete(`/permissions/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-permissions'] })
  });

  const handleSubmit = () => {
    if (isEditing) updatePerm.mutate(formData);
    else createPerm.mutate({ name: formData.name, description: formData.description });
  };

  const permissions = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>إدارة الصلاحيات (التراخيص)</h1>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'تعديل صلاحية' : 'إضافة صلاحية'}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="الاسم البرمجي (مثال: view_reports)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="وصف الصلاحية (مثال: يمكنه رؤية التقارير)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <div>
              <button onClick={handleSubmit} style={{ padding: '0.8rem 2rem', background: '#2980B9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>
                {isEditing ? 'حفظ التعديلات' : 'إضافة الصلاحية'}
              </button>
              {isEditing && <button onClick={() => { setIsEditing(false); setFormData({ id:0, name:'', description:'' }) }} style={{ padding: '0.8rem 2rem', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {isLoading ? <p>جاري التحميل...</p> : permissions.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1B3A5C' }}>{p.name}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{p.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setIsEditing(true); setFormData({ id: p.id, name: p.name, description: p.description }) }} style={{ padding: '0.5rem', background: '#F39C12', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>تعديل</button>
                <button onClick={() => { if(window.confirm('حذف؟')) deletePerm.mutate(p.id) }} style={{ padding: '0.5rem', background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PermissionsAdminPage;
