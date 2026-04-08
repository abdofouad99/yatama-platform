import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Phone } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',         label: 'الرئيسية' },
  { href: '/about',    label: 'من نحن' },
  { href: '/projects', label: 'المشاريع' },
  { href: '/apply',    label: '🤲 طلب دعم' },
  { href: '/donate',   label: 'تبرع الآن', isDonate: true },
  { href: '#contact',  label: 'تواصل معنا' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname }        = useLocation();

  return (
    <header style={{
      position:   'sticky',
      top:        0,
      zIndex:     1000,
      background: 'rgba(27, 77, 161, 0.95)',
      backdropFilter: 'blur(16px)',
      boxShadow:  'var(--shadow-md)',
    }}>
      {/* شريط المعلومات العلوي */}
      <div style={{ background: 'var(--color-primary-dark)', padding: '0.45rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontWeight: '500' }}>
        <span><Phone size={12} style={{ display:'inline', margin:'0 4px' }} /> +967 01 020 030</span>
        <span style={{ margin: '0 1rem' }}>|</span>
        <span>info@yatama-charity.org</span>
      </div>

      {/* الشريط الرئيسي */}
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* الشعار */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #FF8C00, #e07b00)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 10px rgba(255,140,0,0.3)', border: '2px solid rgba(255,255,255,0.2)' }}>
            🌟
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2, fontFamily: 'Tajawal, sans-serif' }}>
              مؤسسة اليتامى الخيرية
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontFamily: 'sans-serif' }}>
              Yatama Charity Foundation
            </div>
          </div>
        </Link>

        {/* روابط الجوال (مخفية) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {NAV_LINKS.map(link => (
            link.isDonate ? (
              <Link key={link.href} to={link.href} style={{
                padding: '0.5rem 1.25rem',
                background: '#FF8C00',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: 'Tajawal, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow:  '0 4px 15px rgba(255, 140, 0, 0.3)',
              }}>
                <Heart size={15} fill="#fff" /> {link.label}
              </Link>
            ) : (
              <Link key={link.href} to={link.href} style={{
                padding: '0.5rem 0.9rem',
                color: pathname === link.href ? '#FF8C00' : 'rgba(255,255,255,0.85)',
                fontWeight: pathname === link.href ? 700 : 500,
                fontSize: '0.95rem',
                borderRadius: '6px',
                fontFamily: 'Tajawal, sans-serif',
                transition: 'color 0.2s',
              }}>
                {link.label}
              </Link>
            )
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
