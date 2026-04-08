import React from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const StoriesPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-stories'],
    queryFn: () => api.get('/public/stories').then(r => r.data)
  });
  const stories = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', textAlign: 'center' }}>📖 قصص ملهمة من واقع المستفيدين</h1>
        {isLoading ? <p style={{textAlign:'center'}}>جاري التحميل...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {stories.map((s:any) => (
              <div key={s.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <img src={s.imageUrl} alt={s.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#FF8C00', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{s.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default StoriesPage;
