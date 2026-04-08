import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import '../../index.css';

const Sidebar: React.FC = () => (
  <aside style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0 }}>
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>🌙 مؤسسة اليتامى</div>
    </div>
    <nav style={{ padding: '0 0.75rem' }}>
      {[
        { href: '/admin/dashboard', label: '📊 لوحة التحكم' },
        { href: '/admin/projects',  label: '📁 المشاريع' },
        { href: '/admin/donations', label: '💰 التبرعات' },
        { href: '/admin/applications', label: '📋 الطلبات', active: true },
      ].map(item => (
        <Link key={item.href} to={item.href} style={{
          display: 'block', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
          textDecoration: 'none', background: item.active ? 'rgba(255,140,0,0.15)' : 'transparent',
          color: item.active ? '#FF8C00' : 'rgba(255,255,255,0.7)',
          fontWeight: item.active ? 700 : 500, fontSize: '0.95rem',
          borderRight: item.active ? '3px solid #FF8C00' : '3px solid transparent',
          fontFamily: 'Tajawal, sans-serif',
        }}>{item.label}</Link>
      ))}
    </nav>
    <div style={{ padding: '1rem 1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>← عرض الموقع</Link>
    </div>
  </aside>
);

const ApplicationsAdminPage: React.FC = () => {
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('pending');
  const [selected, setSelected] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', statusFilter],
    queryFn: () => api.get('/applications', { params: { status: statusFilter || undefined, limit: 50 } }).then(r => r.data),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      api.patch(`/applications/${id}/review`, { status, reviewNotes: notes }),
    onSuccess: () => {
      toast.success('تم تحديث الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setSelected(null);
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  const apps = (data?.data?.applications || []).filter((a: any) =>
    !search || a.applicantName?.includes(search) || a.applicantPhone?.includes(search)
  );

  const TYPE_LABELS: Record<string, string> = {
    orphan_sponsorship: '🧒 كفالة يتيم',
    emergency_relief:   '🆘 إغاثة طارئة',
    education:          '📚 دعم تعليمي',
    medical:            '🏥 رعاية طبية',
    general:            '🤲 دعم عام',
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginRight: '250px', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C', marginBottom: '0.5rem' }}>📋 إدارة الطلبات</h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>مراجعة وقبول/رفض طلبات المستفيدين</p>

        {/* فلاتر */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..."
              style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {[
            { v: 'pending',  l: '⏳ معلقة' },
            { v: 'approved', l: '✅ مقبولة' },
            { v: 'rejected', l: '❌ مرفوضة' },
            { v: '',         l: 'الكل' },
          ].map(s => (
            <button key={s.v} onClick={() => setStatus(s.v)}
              style={{ padding: '0.5rem 1rem', border: `2px solid ${statusFilter === s.v ? '#1B3A5C' : '#E0E0E0'}`, borderRadius: '8px', background: statusFilter === s.v ? '#1B3A5C' : '#fff', color: statusFilter === s.v ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '0.85rem' }}>
              {s.l}
            </button>
          ))}
        </div>

        {/* قائمة الطلبات */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>⏳ جاري التحميل...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {apps.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', color: '#9CA3AF' }}>لا توجد طلبات</div>}
            {apps.map((a: any) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#1B3A5C', fontSize: '1rem' }}>{a.applicantName}</span>
                    <span style={{ background: '#EBF0F7', color: '#1B3A5C', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {TYPE_LABELS[a.applicationType] || a.applicationType}
                    </span>
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.85rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>📞 {a.applicantPhone}</span>
                    <span>📍 {a.governorate}</span>
                    <span>👨‍👩‍👧 {a.membersCount} أفراد</span>
                    <span>📅 {new Date(a.createdAt).toLocaleDateString('ar')}</span>
                  </div>
                  {a.description && <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{a.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button onClick={() => setSelected(a)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', border: '2px solid #E0E0E0', borderRadius: '8px', background: '#fff', cursor: 'pointer', color: '#374151', fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Eye size={15} /> تفاصيل
                  </button>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => reviewMutation.mutate({ id: a.id, status: 'approved' })}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', border: 'none', borderRadius: '8px', background: '#1F7A4A', cursor: 'pointer', color: '#fff', fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>
                        <CheckCircle size={15} /> قبول
                      </button>
                      <button onClick={() => reviewMutation.mutate({ id: a.id, status: 'rejected' })}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', border: 'none', borderRadius: '8px', background: '#E74C3C', cursor: 'pointer', color: '#fff', fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>
                        <XCircle size={15} /> رفض
                      </button>
                    </>
                  )}
                  {a.status !== 'pending' && (
                    <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', background: a.status === 'approved' ? '#F0FDF4' : '#FEF2F2', color: a.status === 'approved' ? '#1F7A4A' : '#E74C3C' }}>
                      {a.status === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal التفاصيل */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
            onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2 style={{ fontWeight: 900, color: '#1B3A5C', marginBottom: '1.25rem', fontSize: '1.3rem' }}>تفاصيل الطلب #{selected.id}</h2>
              {[
                { label: 'الاسم', value: selected.applicantName },
                { label: 'الهاتف', value: selected.applicantPhone },
                { label: 'البريد', value: selected.applicantEmail || '—' },
                { label: 'المحافظة', value: selected.governorate },
                { label: 'العنوان', value: selected.address },
                { label: 'رقم الهوية', value: selected.nationalId || '—' },
                { label: 'عدد الأفراد', value: `${selected.membersCount} فرد` },
                { label: 'الدخل الشهري', value: `${Number(selected.monthlyIncome).toLocaleString()} ريال` },
                { label: 'نوع الطلب', value: TYPE_LABELS[selected.applicationType] || selected.applicationType },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #F5F5F5' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.9rem' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.4rem' }}>الوصف:</p>
                <p style={{ background: '#F9FAFB', borderRadius: '8px', padding: '0.75rem', color: '#374151', lineHeight: 1.7, fontSize: '0.9rem' }}>{selected.description}</p>
              </div>
              {selected.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => reviewMutation.mutate({ id: selected.id, status: 'approved' })}
                    style={{ flex: 1, padding: '0.75rem', background: '#1F7A4A', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem' }}>
                    ✅ قبول الطلب
                  </button>
                  <button onClick={() => reviewMutation.mutate({ id: selected.id, status: 'rejected' })}
                    style={{ flex: 1, padding: '0.75rem', background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem' }}>
                    ❌ رفض الطلب
                  </button>
                </div>
              )}
              <button onClick={() => setSelected(null)}
                style={{ display: 'block', width: '100%', marginTop: '0.75rem', padding: '0.65rem', background: 'transparent', border: '2px solid #E0E0E0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', color: '#6B7280', fontWeight: 600, fontSize: '0.9rem' }}>
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicationsAdminPage;
