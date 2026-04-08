import React from 'react';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => (
  <footer style={{ background: '#0d1e2e', color: '#fff', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>

        {/* عن المؤسسة */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌙</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>مؤسسة اليتامى الخيرية</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            مؤسسة إنسانية يمنية تسعى لرعاية الأيتام والأسر المتعففة عبر برامج شاملة وشفافة.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s' }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#FF8C00' }}>روابط سريعة</h3>
          {['الصفحة الرئيسية', 'مشاريعنا الخيرية', 'تبرع الآن', 'من نحن', 'الشفافية والتقارير', 'تواصل معنا'].map(link => (
            <a key={link} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem', fontSize: '0.9rem', transition: 'color 0.2s', textDecoration: 'none' }}>
              ← {link}
            </a>
          ))}
        </div>

        {/* برامجنا */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#FF8C00' }}>برامجنا</h3>
          {['كفالة الأيتام', 'إغاثة طارئة', 'دعم تعليمي', 'رعاية طبية', 'دعم الأسر', 'مشاريع التنمية'].map(p => (
            <a key={p} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              ← {p}
            </a>
          ))}
        </div>

        {/* تواصل معنا */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#FF8C00' }}>تواصل معنا</h3>
          {[
            { icon: Phone,   text: '+967 01 020 030' },
            { icon: Mail,    text: 'info@yatama-charity.org' },
            { icon: MapPin,  text: 'صنعاء، اليمن' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <Icon size={16} style={{ color: '#1F7A4A', marginTop: '3px', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{text}</span>
            </div>
          ))}

          <a href="/donate" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', background: '#FF8C00', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            <Heart size={16} fill="#fff" /> تبرع الآن
          </a>
        </div>
      </div>

      {/* حقوق النشر */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
        <p>© 2026 مؤسسة اليتامى الخيرية — Yatama Charity Foundation. جميع الحقوق محفوظة.</p>
        <p style={{ marginTop: '0.35rem' }}>
          <a href="/admin/login" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>دخول النظام الإداري</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
