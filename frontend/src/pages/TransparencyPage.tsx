import React from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const TransparencyPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-transparency'],
    queryFn: () => api.get('/public/transparency').then(r => r.data)
  });
  const tData = data?.data;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', textAlign: 'center' }}>🔍 الشفافية والتقارير المالية</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '3rem' }}>نحن نؤمن بأن كل قرش يذهب لمستحقيه. إليك تفصيل ميزانياتنا.</p>
        
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px', background: '#fff', padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#1B3A5C', marginBottom: '1.5rem' }}>كيف تُصرف أموال التبرعات؟</h3>
              {tData?.budgetAllocations?.map((item: any) => (
                <div key={item.label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{item.label}</strong>
                    <span>{item.percentage}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#E0E0E0', height: '10px', borderRadius: '5px' }}>
                    <div style={{ width: `${item.percentage}%`, background: '#1F7A4A', height: '10px', borderRadius: '5px' }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ flex: '1 1 300px', background: '#fff', padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ color: '#1B3A5C', marginBottom: '1.5rem' }}>التقارير للتحميل (PDF)</h3>
              {tData?.downloadableReports?.map((r: any) => (
                <a key={r.title} href={r.url} style={{ display: 'block', padding: '1rem', background: '#F5F5F5', color: '#FF8C00', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                  📄 {r.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TransparencyPage;
