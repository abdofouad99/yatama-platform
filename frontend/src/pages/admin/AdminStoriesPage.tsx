import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminStoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', summary: '', content: '', imageUrl: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stories'],
    queryFn: () => api.get('/public/stories').then(r => r.data)
  });

  const createStory = useMutation({
    mutationFn: (data: any) => api.post('/cms/stories', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
      setFormData({ title: '', summary: '', content: '', imageUrl: '' });
      alert('تم إضافة القصة بنجاح');
    }
  });

  const stories = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>إدارة قصص النجاح</h1>

        {/* نموذج إضافة قصة جديدة */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>إضافة قصة جديدة</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="العنوان" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="ملخص التصوير" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <textarea placeholder="المحتوى الكامل" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={3} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="رابط الصورة" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button onClick={() => createStory.mutate(formData)} style={{ padding: '1rem', background: '#1F7A4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              نشر القصة
            </button>
          </div>
        </div>

        {/* عرض القصص الحالية */}
        <div style={{ marginTop: '2rem' }}>
          {isLoading ? <p>جاري التحميل...</p> : stories.map((s: any) => (
            <div key={s.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', borderRight: '4px solid #FF8C00' }}>
              <h4>{s.title}</h4>
              <p>{s.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminStoriesPage;
