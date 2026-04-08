import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminTransparencyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ id: 0, title: '', description: '', year: 2026, fileUrl: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-transparency'],
    queryFn: () => api.get('/public/transparency').then(r => r.data)
  });

  const uploadReport = useMutation({
    mutationFn: (data: any) => api.post('/cms/transparency', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transparency'] });
      setFormData({ id: 0, title: '', description: '', year: 2026, fileUrl: '' });
      setIsEditing(false);
      alert('تم حفظ التقرير بنجاح');
    }
  });

  const updateReport = useMutation({
    mutationFn: (data: any) => api.put(`/cms/transparency/${data.id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transparency'] });
      setFormData({ id: 0, title: '', description: '', year: 2026, fileUrl: '' });
      setIsEditing(false);
    }
  });

  const deleteReport = useMutation({
    mutationFn: (id: number) => api.delete(`/cms/transparency/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transparency'] });
    }
  });

  const reports = data?.data?.downloadableReports || [];

  const handleSubmit = () => {
    if (isEditing) updateReport.mutate(formData);
    else uploadReport.mutate(formData);
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>إدارة تقارير الشفافية</h1>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'تعديل التقرير' : 'رفع تقرير مالي / إداري جديد'}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="عنوان التقرير (مثال: التقرير السنوي 2025)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="السنة المالية" type="number" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="رابط الملف (PDF)" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleSubmit} style={{ padding: '1rem 2rem', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isEditing ? 'حفظ التعديلات' : 'رفع التقرير للموقع'}
              </button>
              {isEditing && (
                <button onClick={() => { setIsEditing(false); setFormData({ id: 0, title: '', description: '', year: 2026, fileUrl: '' }) }} style={{ padding: '1rem 2rem', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  إلغاء التعديل
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {isLoading ? <p>جاري التحميل...</p> : reports.map((r: any) => (
            <div key={r.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1F7A4A' }}>{r.title}</h4>
                <small style={{ color: '#666' }}>سنة التقرير: {r.year}</small>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{ padding: '0.5rem 1rem', background: '#F5F5F5', color: '#1B3A5C', textDecoration: 'none', borderRadius: '6px' }}>عرض الملف</a>
                <button onClick={() => { setIsEditing(true); setFormData({ id: r.id, title: r.title, description: r.description || '', year: r.year, fileUrl: r.fileUrl }) }} style={{ padding: '0.5rem 1rem', background: '#F39C12', color: '#white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>تعديل</button>
                <button onClick={() => { if(window.confirm('حذف التقرير؟')) deleteReport.mutate(r.id) }} style={{ padding: '0.5rem 1rem', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminTransparencyPage;
