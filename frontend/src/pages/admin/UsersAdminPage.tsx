import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Shield, X, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../services/api';
import '../../index.css';

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar: React.FC = () => (
  <aside style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0 }}>
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>🌙 مؤسسة اليتامى</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>لوحة الإدارة</div>
    </div>
    <nav style={{ padding: '0 0.75rem', flex: 1 }}>
      {[
        { href: '/admin/dashboard',    label: '📊 لوحة التحكم' },
        { href: '/admin/projects',     label: '📁 المشاريع' },
        { href: '/admin/donations',    label: '💰 التبرعات' },
        { href: '/admin/applications', label: '📋 الطلبات' },
        { href: '/admin/beneficiaries',label: '🧒 المستفيدون' },
        { href: '/admin/users',        label: '👥 المستخدمون', active: true },
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

// ─── Schema ──────────────────────────────────────────────────────────────────
const userSchema = z.object({
  fullName: z.string().min(3, 'الاسم مطلوب'),
  email:    z.string().email('بريد غير صحيح'),
  phone:    z.string().optional(),
  roleId:   z.number().min(1),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل').optional().or(z.literal('')),
});
type UserFormData = z.infer<typeof userSchema>;

const ROLES = [
  { id: 1, label: '🔴 مشرف النظام',       slug: 'super_admin' },
  { id: 2, label: '📁 مدير المشاريع',      slug: 'project_manager' },
  { id: 3, label: '💰 مدير المالية',       slug: 'finance_manager' },
  { id: 4, label: '🤲 مسؤول حالات',       slug: 'case_worker' },
  { id: 5, label: '👁️ مشاهد فقط',         slug: 'viewer' },
];

const roleBadge = (roleName: string) => {
  const colors: Record<string, string> = {
    super_admin: '#E74C3C', project_manager: '#1B3A5C',
    finance_manager: '#1F7A4A', case_worker: '#FF8C00', viewer: '#9CA3AF',
  };
  const color = colors[roleName] || '#9CA3AF';
  return <span style={{ background: `${color}18`, color, padding: '0.22rem 0.7rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>
    {ROLES.find(r => r.slug === roleName)?.label || roleName}
  </span>;
};

// ─── User Modal ───────────────────────────────────────────────────────────────
const UserModal: React.FC<{ user?: any; onClose: () => void; onSave: (d: UserFormData, id?: number) => void; isSaving: boolean }> =
  ({ user, onClose, onSave, isSaving }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
      resolver: zodResolver(userSchema),
      defaultValues: user ? { fullName: user.fullName, email: user.email, phone: user.phone || '', roleId: user.role?.id || 1, password: '' } : { roleId: 5 },
    });
    const inp = (err?: boolean): React.CSSProperties => ({
      width: '100%', padding: '0.7rem 1rem', border: `2px solid ${err ? '#E74C3C' : '#E0E0E0'}`,
      borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box',
    });
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 900, color: '#1B3A5C', fontSize: '1.3rem' }}>{user ? '✏️ تعديل المستخدم' : '➕ مستخدم جديد'}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={22} /></button>
          </div>
          <form onSubmit={handleSubmit(d => onSave(d, user?.id))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الاسم الكامل *</label>
              <input {...register('fullName')} style={inp(!!errors.fullName)} placeholder="أدخل الاسم الكامل" />
              {errors.fullName && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.fullName.message}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>البريد الإلكتروني *</label>
                <input {...register('email')} type="email" style={{ ...inp(!!errors.email), direction: 'ltr' }} placeholder="user@example.com" />
                {errors.email && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>رقم الهاتف</label>
                <input {...register('phone')} style={inp()} placeholder="07XXXXXXXX" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الدور الوظيفي *</label>
              <select {...register('roleId', { valueAsNumber: true })} style={inp()}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>
                {user ? 'كلمة مرور جديدة (اتركها فارغة للإبقاء على القديمة)' : 'كلمة المرور *'}
              </label>
              <input {...register('password')} type="password" style={{ ...inp(!!errors.password), direction: 'ltr' }} placeholder="••••••••" />
              {errors.password && <p style={{ color: '#E74C3C', fontSize: '0.78rem' }}>{errors.password.message}</p>}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const UsersAdminPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]  = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const users = (data?.data?.users || []).filter((u: any) =>
    !search || u.fullName?.includes(search) || u.email?.includes(search)
  );

  const saveMutation = useMutation({
    mutationFn: ({ data, id }: { data: UserFormData; id?: number }) =>
      id ? api.put(`/users/${id}`, data) : api.post('/users', data),
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'تم تحديث المستخدم ✅' : 'تم إنشاء المستخدم ✅');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setShowModal(false); setEditUser(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'خطأ في الحفظ'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/users/${id}/toggle`),
    onSuccess: () => { toast.success('تم تحديث الحالة'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => toast.error('خطأ في التحديث'),
  });

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginRight: '250px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C' }}>👥 إدارة المستخدمين</h1>
            <p style={{ color: '#6B7280', marginTop: '0.2rem' }}>{users.length} مستخدم مسجل</p>
          </div>
          <button onClick={() => { setEditUser(null); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FF8C00', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 15px rgba(255,140,0,0.35)' }}>
            <Plus size={18} /> مستخدم جديد
          </button>
        </div>

        {/* Search */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد الإلكتروني..."
              style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>⏳ جاري التحميل...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #F0F0F0' }}>
                  {['المستخدم', 'البريد الإلكتروني', 'الهاتف', 'الدور', 'آخر دخول', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.82rem', color: '#6B7280', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F5F5F5', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#1B3A5C,#1F7A4A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                          {u.fullName?.[0]}
                        </div>
                        <span style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.92rem' }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>{u.email}</td>
                    <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                    <td style={{ padding: '1rem' }}>{roleBadge(u.role?.slug || '')}</td>
                    <td style={{ padding: '1rem', color: '#9CA3AF', fontSize: '0.8rem' }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('ar') : '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => toggleMutation.mutate(u.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: u.isActive ? '#1F7A4A' : '#E74C3C' }}>
                        {u.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {u.isActive ? 'نشط' : 'معطّل'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => { setEditUser(u); setShowModal(true); }}
                          style={{ padding: '0.4rem 0.5rem', background: '#F0FDF4', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1F7A4A' }}>
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>لا يوجد مستخدمون</td></tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <UserModal
            user={editUser}
            onClose={() => { setShowModal(false); setEditUser(null); }}
            onSave={(d, id) => saveMutation.mutate({ data: d, id })}
            isSaving={saveMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersAdminPage;
