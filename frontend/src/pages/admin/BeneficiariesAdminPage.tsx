import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Search, X, Eye } from 'lucide-react';
import api from '../../services/api';
import '../../index.css';

const Sidebar: React.FC = () => (
  <aside style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0 }}>
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>🌙 مؤسسة اليتامى</div>
    </div>
    <nav style={{ padding: '0 0.75rem', flex: 1 }}>
      {[
        { href: '/admin/dashboard',    label: '📊 لوحة التحكم' },
        { href: '/admin/projects',     label: '📁 المشاريع' },
        { href: '/admin/donations',    label: '💰 التبرعات' },
        { href: '/admin/applications', label: '📋 الطلبات' },
        { href: '/admin/beneficiaries',label: '🧒 المستفيدون', active: true },
        { href: '/admin/users',        label: '👥 المستخدمون' },
      ].map(item => (
        <Link key={item.href} to={item.href} style={{
          display: 'block', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
          textDecoration: 'none', fontFamily: 'Tajawal, sans-serif',
          background: item.active ? 'rgba(255,140,0,0.15)' : 'transparent',
          color: item.active ? '#FF8C00' : 'rgba(255,255,255,0.7)',
          fontWeight: item.active ? 700 : 500, fontSize: '0.95rem',
          borderRight: item.active ? '3px solid #FF8C00' : '3px solid transparent',
        }}>{item.label}</Link>
      ))}
    </nav>
    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>← عرض الموقع</Link>
    </div>
  </aside>
);

const bSchema = z.object({
  fullName:     z.string().min(2, 'الاسم مطلوب'),
  dateOfBirth:  z.string().min(1, 'التاريخ مطلوب'),
  gender:       z.enum(['male', 'female']),
  governorate:  z.string().min(1, 'المحافظة مطلوبة'),
  guardianName: z.string().optional(),
  guardianPhone:z.string().optional(),
  notes:        z.string().optional(),
});
type BeneficiaryForm = z.infer<typeof bSchema>;

const GOVERNORATES = ['صنعاء','عدن','تعز','إب','ذمار','حضرموت','المكلا','الحديدة','مأرب','البيضاء','رداع','عمران'];

const BeneficiaryModal: React.FC<{
  ben?: any; onClose: () => void; onSave: (d: BeneficiaryForm, id?: number) => void; isSaving: boolean;
}> = ({ ben, onClose, onSave, isSaving }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BeneficiaryForm>({
    resolver: zodResolver(bSchema),
    defaultValues: ben ? {
      fullName: ben.fullName, dateOfBirth: ben.dateOfBirth?.split('T')[0],
      gender: ben.gender, governorate: ben.governorate,
      guardianName: ben.guardianName, guardianPhone: ben.guardianPhone, notes: ben.notes,
    } : { gender: 'male' },
  });
  const inp = (err?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.7rem 1rem', border: `2px solid ${err ? '#E74C3C' : '#E0E0E0'}`,
    borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box',
  });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 900, color: '#1B3A5C', fontSize: '1.3rem' }}>{ben ? '✏️ تعديل بيانات المستفيد' : '➕ تسجيل مستفيد جديد'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="#9CA3AF" /></button>
        </div>
        <form onSubmit={handleSubmit(d => onSave(d, ben?.id))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الاسم الكامل *</label>
              <input {...register('fullName')} style={inp(!!errors.fullName)} placeholder="اسم اليتيم أو المستفيد" />
              {errors.fullName && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.fullName.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>تاريخ الميلاد *</label>
              <input {...register('dateOfBirth')} type="date" style={inp(!!errors.dateOfBirth)} />
              {errors.dateOfBirth && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.dateOfBirth.message}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الجنس *</label>
              <select {...register('gender')} style={inp()}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>المحافظة *</label>
              <select {...register('governorate')} style={inp(!!errors.governorate)}>
                <option value="">اختر المحافظة</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.governorate && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.governorate.message}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>اسم الولي</label>
              <input {...register('guardianName')} style={inp()} placeholder="اسم والد / ولي الأمر" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>هاتف الولي</label>
              <input {...register('guardianPhone')} style={inp()} placeholder="07XXXXXXXX" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>ملاحظات</label>
            <textarea {...register('notes')} rows={3} style={{ ...inp(), resize: 'vertical' }} placeholder="أي معلومات إضافية..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={isSaving}
              style={{ flex: 1, padding: '0.8rem', background: isSaving ? '#9CA3AF' : '#1B3A5C', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem' }}>
              {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ'}
            </button>
            <button type="button" onClick={onClose}
              style={{ padding: '0.8rem 1.5rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal: React.FC<{ ben: any; onClose: () => void; onEdit: () => void }> = ({ ben, onClose, onEdit }) => {
  const age = ben.dateOfBirth
    ? Math.floor((Date.now() - new Date(ben.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg,#1B3A5C,#1F7A4A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem' }}>
            {ben.gender === 'male' ? '👦' : '👧'}
          </div>
          <h2 style={{ fontWeight: 900, color: '#1B3A5C', fontSize: '1.4rem' }}>{ben.fullName}</h2>
          {age && <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>{age} سنة • {ben.governorate}</p>}
        </div>
        {[
          { label: 'الجنس', value: ben.gender === 'male' ? '🧒 ذكر' : '👧 أنثى' },
          { label: 'تاريخ الميلاد', value: ben.dateOfBirth ? new Date(ben.dateOfBirth).toLocaleDateString('ar') : '—' },
          { label: 'المحافظة', value: ben.governorate || '—' },
          { label: 'اسم الولي', value: ben.guardianName || '—' },
          { label: 'هاتف الولي', value: ben.guardianPhone || '—' },
          { label: 'تاريخ التسجيل', value: new Date(ben.createdAt).toLocaleDateString('ar') },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #F5F5F5' }}>
            <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{row.label}</span>
            <span style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.9rem' }}>{row.value}</span>
          </div>
        ))}
        {ben.notes && (
          <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem' }}>
            <p style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: '0.25rem' }}>ملاحظات:</p>
            <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>{ben.notes}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={onEdit}
            style={{ flex: 1, padding: '0.75rem', background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
            ✏️ تعديل
          </button>
          <button onClick={onClose}
            style={{ flex: 1, padding: '0.75rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const BeneficiariesAdminPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch]     = useState('');
  const [govFilter, setGov]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBen, setEditBen]   = useState<any>(null);
  const [viewBen, setViewBen]   = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-beneficiaries', govFilter],
    queryFn: () => api.get('/beneficiaries', { params: { limit: 100, governorate: govFilter || undefined } }).then(r => r.data),
  });

  const bens = (data?.data?.beneficiaries || []).filter((b: any) =>
    !search || b.fullName?.includes(search) || b.guardianName?.includes(search)
  );

  const saveMutation = useMutation({
    mutationFn: ({ data, id }: { data: BeneficiaryForm; id?: number }) =>
      id ? api.put(`/beneficiaries/${id}`, data) : api.post('/beneficiaries', data),
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'تم تحديث بيانات المستفيد ✅' : 'تم تسجيل المستفيد ✅');
      qc.invalidateQueries({ queryKey: ['admin-beneficiaries'] });
      setShowModal(false); setEditBen(null);
    },
    onError: () => toast.error('خطأ في الحفظ'),
  });

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginRight: '250px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C' }}>🧒 إدارة المستفيدين</h1>
            <p style={{ color: '#6B7280', marginTop: '0.2rem' }}>{bens.length} مستفيد مسجل</p>
          </div>
          <button onClick={() => { setEditBen(null); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FF8C00', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 15px rgba(255,140,0,0.35)' }}>
            <Plus size={18} /> تسجيل مستفيد
          </button>
        </div>

        {/* Stats Quick */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'إجمالي المستفيدين', value: data?.data?.total || 0, color: '#1B3A5C', icon: '🧒' },
            { label: 'ذكور', value: bens.filter((b: any) => b.gender === 'male').length, color: '#2980B9', icon: '👦' },
            { label: 'إناث', value: bens.filter((b: any) => b.gender === 'female').length, color: '#E74C3C', icon: '👧' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', borderRight: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو اسم الولي..."
              style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={govFilter} onChange={e => setGov(e.target.value)}
            style={{ padding: '0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
            <option value="">كل المحافظات</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>⏳ جاري التحميل...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
            {bens.map((b: any, i: number) => {
              const age = b.dateOfBirth
                ? Math.floor((Date.now() - new Date(b.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))
                : null;
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.07)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #1B3A5C, #1F7A4A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                        {b.gender === 'male' ? '👦' : '👧'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1B3A5C', fontSize: '0.95rem' }}>{b.fullName}</div>
                        {age !== null && <div style={{ color: '#9CA3AF', fontSize: '0.82rem' }}>{age} سنة</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setViewBen(b)}
                        style={{ padding: '0.35rem', background: '#EBF0F7', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1B3A5C' }}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => { setEditBen(b); setShowModal(true); }}
                        style={{ padding: '0.35rem', background: '#F0FDF4', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1F7A4A' }}>
                        <Pencil size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#F9FAFB', color: '#6B7280', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                      📍 {b.governorate || '—'}
                    </span>
                    {b.guardianName && (
                      <span style={{ background: '#F9FAFB', color: '#6B7280', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                        👨 {b.guardianName}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {bens.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', color: '#9CA3AF', fontSize: '1rem' }}>
                لا يوجد مستفيدون مسجلون
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <BeneficiaryModal
            ben={editBen}
            onClose={() => { setShowModal(false); setEditBen(null); }}
            onSave={(d, id) => saveMutation.mutate({ data: d, id })}
            isSaving={saveMutation.isPending}
          />
        )}
        {viewBen && (
          <DetailModal
            ben={viewBen}
            onClose={() => setViewBen(null)}
            onEdit={() => { setEditBen(viewBen); setViewBen(null); setShowModal(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BeneficiariesAdminPage;
