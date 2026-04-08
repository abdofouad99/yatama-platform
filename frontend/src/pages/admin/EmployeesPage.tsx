import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
// Optional: a Sidebar instead if it's strictly an admin layout. We'll build a quick structure.

const EmployeesPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-employees'],
    queryFn: () => api.get('/employees').then(r => r.data),
  });

  const emps = data?.data || [];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#1B3A5C', fontWeight: 800 }}>👥 الموارد البشرية - الموظفين</h1>
        {isLoading ? <p>جاري التحميل...</p> : (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
            {emps.map((e: any) => (
              <div key={e.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1B3A5C' }}>{e.user?.fullName}</h3>
                <p><strong>المنصب:</strong> {e.position}</p>
                <p><strong>القسم:</strong> {e.department}</p>
                <p><strong>تاريخ التعيين:</strong> {new Date(e.hireDate).toLocaleDateString('ar')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default EmployeesPage;
