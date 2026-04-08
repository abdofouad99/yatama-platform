import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminPartnersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', logoUrl: '', websiteUrl: '', type: 'partner' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: () => api.get('/public/partners').then(r => r.data)
  });

  const createPartner = useMutation({
    mutationFn: (data: any) => api.post('/cms/partners', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      setFormData({ name: '', logoUrl: '', websiteUrl: '', type: 'partner' });
      alert('تم إضافة الشريك بنجاح');
    }
  });

  const deletePartner = useMutation({
    mutationFn: (id: number) => api.delete(`/cms/partners/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
    }
  });

  const partners = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>إدارة الشركاء</h1>

        {/* نموذج الإضافة */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>إضافة شريك جديد</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="اسم الجهة / الشريك" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="رابط الشعار Logo URL" value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input placeholder="رابط الموقع الإلكتروني" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="partner">شريك عام</option>
              <option value="donor">جهة مانحة</option>
              <option value="execution">شريك تنفيذي</option>
            </select>
            <button onClick={() => createPartner.mutate(formData)} style={{ padding: '1rem', background: '#2980B9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              حفظ الشريك
            </button>
          </div>
        </div>

        {/* قائمة الشركاء */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {isLoading ? <p>جاري التحميل...</p> : partners.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #E0E0E0' }}>
              <h4 style={{ color: '#1B3A5C' }}>{p.name}</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{p.type}</p>
              <button onClick={() => { if(window.confirm('متأكد من الحذف؟')) deletePartner.mutate(p.id) }} style={{ padding: '0.5rem 1rem', background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}>
                حذف 🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminPartnersPage;
