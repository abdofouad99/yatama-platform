import React from 'react';
import Navbar from '../components/Navbar';

const VolunteersFrontPage: React.FC = () => {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', fontWeight: 900 }}>🙋 كن جزءاً من التغيير</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem', lineHeight: '1.8' }}>
          نحن نبحث دائماً عن أيادي معطاءة للتطوع معانا، سواء بالجهد، أو الوقت، أو الخبرة المهنية. 
          انضم إلينا اليوم وكن سبباً في رسم الابتسامة.
        </p>
        
        <form style={{ marginTop: '3rem', background: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'right' }} onSubmit={(e) => { e.preventDefault(); alert('شكراً لتقديمك! سنتواصل معك قريباً'); }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الاسم الكامل</label>
            <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>رقم الهاتف (واتساب)</label>
            <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>المهارات / التخصص</label>
            <textarea rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required></textarea>
          </div>
          <button type="submit" style={{ width: '100%', padding: '1rem', background: '#1F7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>سجل كمتطوع الآن</button>
        </form>
      </div>
    </div>
  );
};
export default VolunteersFrontPage;
