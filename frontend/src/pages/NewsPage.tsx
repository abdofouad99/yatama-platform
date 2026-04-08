import React from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const NewsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-news'],
    queryFn: () => api.get('/public/news').then(r => r.data)
  });
  const news = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', textAlign: 'center' }}>📰 الأخبار والمقالات</h1>
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
            {news.map((item: any) => (
              <div key={item.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderRight: '4px solid #1F7A4A' }}>
                <h3 style={{ color: '#1B3A5C', marginBottom: '0.5rem' }}>{item.title}</h3>
                <small style={{ color: '#FF8C00' }}>{item.date}</small>
                <p style={{ marginTop: '1rem', color: '#666' }}>{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default NewsPage;
