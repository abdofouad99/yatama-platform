import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Download, Filter } from 'lucide-react';
import api from '../../services/api';
import '../../index.css';

// ==========================================
// Sidebar مُستورد من DashboardPage (مُبسط هنا)
// ==========================================
const SidebarLink: React.FC<{ active?: boolean; href: string; icon: string; label: string }> = ({ active, href, icon, label }) => (
  <Link to={href} style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
    borderRadius: '10px', marginBottom: '0.25rem', textDecoration: 'none',
    background: active ? 'rgba(255,140,0,0.15)' : 'transparent',
    color: active ? '#FF8C00' : 'rgba(255,255,255,0.7)',
    fontWeight: active ? 700 : 500, fontSize: '0.95rem',
    borderRight: active ? '3px solid #FF8C00' : '3px solid transparent',
    fontFamily: 'Tajawal, sans-serif',
  }}>{icon} {label}</Link>
);

const Sidebar: React.FC = () => (
  <aside style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0 }}>
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>🌙 مؤسسة اليتامى</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>لوحة الإدارة</div>
    </div>
    <nav style={{ padding: '0 0.75rem' }}>
      <SidebarLink href="/admin/dashboard"    icon="📊" label="لوحة التحكم" />
      <SidebarLink href="/admin/projects"     icon="📁" label="المشاريع" />
      <SidebarLink href="/admin/donations"    icon="💰" label="التبرعات" active />
      <SidebarLink href="/admin/applications" icon="📋" label="الطلبات" />
    </nav>
    <div style={{ padding: '1rem 1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>← عرض الموقع</Link>
    </div>
  </aside>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'معلق',   color: '#FF8C00', bg: '#FFF3E0' },
    completed: { label: 'مكتمل', color: '#1F7A4A', bg: '#F0FDF4' },
    failed:    { label: 'فاشل',  color: '#E74C3C', bg: '#FEF2F2' },
  };
  const s = map[status] || { label: status, color: '#9CA3AF', bg: '#F9FAFB' };
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>{s.label}</span>;
};

const DonationsAdminPage: React.FC = () => {
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-donations', page, statusFilter],
    queryFn: () => api.get('/donations', { params: { page, limit: 15, status: statusFilter || undefined } }).then(r => r.data),
  });

  const donations   = data?.data?.donations || [];
  const pagination  = data?.data?.pagination;
  const totals      = data?.data?.totals;

  const filtered = donations.filter((d: any) =>
    !search || d.donor?.fullName?.includes(search) || d.receiptNumber?.includes(search)
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginRight: '250px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C' }}>💰 إدارة التبرعات</h1>
            {totals && <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>الإجمالي المكتمل: <strong style={{ color: '#1F7A4A' }}>${Number(totals.totalCompleted || 0).toLocaleString()}</strong></p>}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1F7A4A', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem' }}>
            <Download size={16} /> تصدير Excel
          </button>
        </div>

        {/* فلاتر */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو رقم الإيصال..."
              style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {['', 'pending', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              style={{ padding: '0.5rem 1rem', border: `2px solid ${statusFilter === s ? '#1B3A5C' : '#E0E0E0'}`, borderRadius: '8px', background: statusFilter === s ? '#1B3A5C' : '#fff', color: statusFilter === s ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '0.85rem' }}>
              {s === '' ? 'الكل' : s === 'pending' ? 'معلق' : s === 'completed' ? 'مكتمل' : 'فاشل'}
            </button>
          ))}
        </div>

        {/* الجدول */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>⏳ جاري التحميل...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #F0F0F0' }}>
                  {['رقم الإيصال', 'المتبرع', 'المشروع', 'المبلغ', 'الطريقة', 'التاريخ', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.85rem', color: '#6B7280', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #F5F5F5', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6B7280', fontFamily: 'monospace' }}>{d.receiptNumber || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#1B3A5C', fontSize: '0.9rem' }}>
                      {d.donor?.isAnonymous ? '🔒 مجهول' : d.donor?.fullName}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#374151', fontSize: '0.85rem' }}>{d.project?.title || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: '#1F7A4A', fontSize: '0.95rem' }}>${Number(d.amount).toLocaleString()}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#6B7280', fontSize: '0.85rem' }}>
                      {d.paymentMethod === 'stripe' ? '💳 Stripe' : '🏦 تحويل بنكي'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#6B7280', fontSize: '0.8rem' }}>{new Date(d.donatedAt).toLocaleDateString('ar')}</td>
                    <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>لا توجد تبرعات</td></tr>
                )}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: '36px', height: '36px', border: `2px solid ${page === p ? '#1B3A5C' : '#E0E0E0'}`, borderRadius: '8px', background: page === p ? '#1B3A5C' : '#fff', color: page === p ? '#fff' : '#374151', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DonationsAdminPage;
