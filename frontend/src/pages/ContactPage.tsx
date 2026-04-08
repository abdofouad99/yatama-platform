import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert('فشل في إرسال الرسالة. يرجى المحاولة لاحقاً.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', fontWeight: 900 }}>📞 تواصل معنا</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem', lineHeight: '1.8' }}>
          فريق مؤسسة اليتامى متواجد دائماً للرد على استفساراتكم أو اقتراحاتكم.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: '3rem', background: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'right', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الاسم الكامل</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>رقم الهاتف (اختياري)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الموضوع</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الرسالة</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ContactPage;
