import React from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const PartnersPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-partners'],
    queryFn: () => api.get('/public/partners').then(r => r.data)
  });
  const partners = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', textAlign: 'center' }}>🤝 شركائنا في الخير</h1>
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            {partners.map((p: any) => (
              <div key={p.id} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'center', width: '250px' }}>
                <img src={p.logo} alt={p.name} style={{ width: '100%', height: 'auto', marginBottom: '1rem' }} />
                <h4 style={{ color: '#1B3A5C' }}>{p.name}</h4>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem' }}>{p.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PartnersPage;
