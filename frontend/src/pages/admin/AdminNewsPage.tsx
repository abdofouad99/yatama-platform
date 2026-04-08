import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminNewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', summary: '', content: '', imageUrl: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => api.get('/public/news').then(r => r.data)
  });

  const createNews = useMutation({
    mutationFn: (data: any) => api.post('/cms/news', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setFormData({ title: '', summary: '', content: '', imageUrl: '' });
      alert('تم إضافة الخبر بنجاح');
    }
  });

  const news = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>إدارة الأخبار والمقالات</h1>

        {/* نموذج إضافة خبر جديد */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>إضافة خبر جديد</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="العنوان" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <textarea placeholder="الملخص الواجهة" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows={2} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <textarea placeholder="المحتوى الكامل" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={4} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="رابط الصورة الرئيسية" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button onClick={() => createNews.mutate(formData)} style={{ padding: '1rem', background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              نشر الخبر
            </button>
          </div>
        </div>

        {/* عرض الأخبار الحالية */}
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {isLoading ? <p>جاري التحميل...</p> : news.map((n: any) => (
            <div key={n.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderRight: '4px solid #1F7A4A' }}>
              <h4>{n.title}</h4>
              <p>{n.summary}</p>
              <small>{new Date(n.createdAt).toLocaleDateString('ar')}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminNewsPage;
