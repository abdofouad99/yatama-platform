import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const RolesAdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ id: 0, name: '', permissionsString: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => api.get('/roles').then(r => r.data)
  });

  const createRole = useMutation({
    mutationFn: (data: { name: string, permissions: string[] }) => api.post('/roles', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setFormData({ id: 0, name: '', permissionsString: '' });
      setIsEditing(false);
      alert('تم حفظ الدور بنجاح');
    }
  });

  const updateRole = useMutation({
    mutationFn: (data: { id: number, name: string, permissions: string[] }) => api.put(`/roles/${data.id}`, { name: data.name, permissions: data.permissions }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setFormData({ id: 0, name: '', permissionsString: '' });
      setIsEditing(false);
    }
  });

  const deleteRole = useMutation({
    mutationFn: (id: number) => api.delete(`/roles/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    }
  });

  const handleSave = () => {
    const list = formData.permissionsString.split(',').map(p => p.trim()).filter(p => p);
    if (isEditing) updateRole.mutate({ id: formData.id, name: formData.name, permissions: list });
    else createRole.mutate({ name: formData.name, permissions: list });
  };

  const roles = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>🛡️ إدارة الأدوار والصلاحيات المتقدمة</h1>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'تعديل الدور' : 'صناعة دور جديد'}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="اسم الدور (مثال: مدير_مالي)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="الصلاحيات (مفصولة بفاصلة قاطعة , مثال: create_project, view_finance)" value={formData.permissionsString} onChange={e => setFormData({...formData, permissionsString: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleSave} style={{ padding: '1rem', background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isEditing ? 'حفظ التعديلات' : 'إضافة الدور'}
              </button>
              {isEditing && (
                <button onClick={() => { setIsEditing(false); setFormData({ id: 0, name: '', permissionsString: '' }) }} style={{ padding: '1rem', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {isLoading ? <p>جاري التحميل...</p> : roles.map((r: any) => (
            <div key={r.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '4px solid #1B3A5C' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1B3A5C' }}>{r.name}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {r.permissions?.map((p: any) => (
                    <span key={p.id} style={{ background: '#E0E0E0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{p.name}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setIsEditing(true); setFormData({ id: r.id, name: r.name, permissionsString: r.permissions?.map((p:any)=>p.name).join(', ') || '' }) }} style={{ padding: '0.5rem 1rem', background: '#F39C12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>تعديل</button>
                <button onClick={() => { if(window.confirm('تأكيد مسح الدور؟')) deleteRole.mutate(r.id) }} style={{ padding: '0.5rem 1rem', background: '#F5F5F5', color: 'red', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RolesAdminPage;
