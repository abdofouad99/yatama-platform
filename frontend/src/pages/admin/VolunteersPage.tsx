import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const VolunteersPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-volunteers'],
    queryFn: () => api.get('/volunteers').then(r => r.data),
  });

  const vols = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1F7A4A', fontWeight: 800 }}>🤝 إدارة المتطوعين</h1>
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem', marginTop: '2rem' }}>
            {vols.map((v: any) => (
              <div key={v.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderTop: '4px solid #1F7A4A', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1B3A5C' }}>{v.user?.fullName}</h3>
                <p><strong>المهارات:</strong> {v.skills || 'عام'}</p>
                <p><strong>الوقت المتاح:</strong> {v.availability}</p>
                <p><strong>ساعات التطوع المنجزة:</strong> <span style={{color: '#FF8C00', fontWeight: 'bold'}}>{v.totalHours}</span> ساعة</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default VolunteersPage;
