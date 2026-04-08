import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const ReportsPage: React.FC = () => {
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['admin-reports-summary'],
    queryFn: () => api.get('/finance/reports/summary').then(r => r.data),
  });

  const handleExportPDF = () => {
    // In a real scenario, this could trigger html2canvas + jsPDF or hit a backend endpoint
    alert("جارٍ تجهيز ملف PDF للتحميل...");
    setTimeout(() => alert("تم تحميل التقرير المالي (محاكاة)"), 1500);
  };

  const data = summaryData?.data;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#1B3A5C', fontWeight: 900 }}>📊 التقارير المالية المتطورة</h1>
          <button onClick={handleExportPDF} style={{ background: '#E74C3C', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            📄 تصدير كـ PDF
          </button>
        </div>

        {isLoading ? <p>جاري تحميل البيانات المالية...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ background: '#1F7A4A', padding: '2rem', borderRadius: '12px', color: '#fff', textAlign: 'center' }}>
              <h3>🟢 إجمالي الدخل (Income)</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0 0 0' }}>${data?.totalIncome?.toLocaleString() || 0}</p>
            </div>
            <div style={{ background: '#E74C3C', padding: '2rem', borderRadius: '12px', color: '#fff', textAlign: 'center' }}>
              <h3>🔴 إجمالي المنصرف (Expense)</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0 0 0' }}>${data?.totalExpense?.toLocaleString() || 0}</p>
            </div>
            <div style={{ background: '#1B3A5C', padding: '2rem', borderRadius: '12px', color: '#fff', textAlign: 'center' }}>
              <h3>💰 الرصيد الصافي</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0 0 0' }}>${data?.netBalance?.toLocaleString() || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
