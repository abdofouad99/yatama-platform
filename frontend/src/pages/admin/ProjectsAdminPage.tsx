import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, Search, X } from 'lucide-react';
import api from '../../services/api';
import '../../index.css';

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar: React.FC = () => (
  <aside style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0 }}>
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>🌙 مؤسسة اليتامى</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>لوحة الإدارة</div>
    </div>
    <nav style={{ padding: '0 0.75rem', flex: 1 }}>
      {[
        { href: '/admin/dashboard',    icon: '📊', label: 'لوحة التحكم' },
        { href: '/admin/projects',     icon: '📁', label: 'المشاريع', active: true },
        { href: '/admin/donations',    icon: '💰', label: 'التبرعات' },
        { href: '/admin/applications', icon: '📋', label: 'الطلبات' },
      ].map(item => (
        <Link key={item.href} to={item.href} style={{
          display: 'block', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
          textDecoration: 'none',
          background: item.active ? 'rgba(255,140,0,0.15)' : 'transparent',
          color: item.active ? '#FF8C00' : 'rgba(255,255,255,0.7)',
          fontWeight: item.active ? 700 : 500, fontSize: '0.95rem',
          borderRight: item.active ? '3px solid #FF8C00' : '3px solid transparent',
          fontFamily: 'Tajawal, sans-serif',
        }}>{item.icon} {item.label}</Link>
      ))}
    </nav>
    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>← عرض الموقع</Link>
    </div>
  </aside>
);

// ─── Schema ──────────────────────────────────────────────────────────────────
const projectSchema = z.object({
  title:       z.string().min(3, 'العنوان مطلوب'),
  description: z.string().min(10, 'الوصف مطلوب'),
  category:    z.enum(['sponsorship', 'education', 'medical', 'relief', 'infrastructure']),
  goalAmount:  z.number().min(1, 'المبلغ يجب أن يكون أكبر من صفر'),
  status:      z.enum(['active', 'completed', 'paused', 'cancelled']),
  isFeatured:  z.boolean().optional(),
});
type ProjectFormData = z.infer<typeof projectSchema>;

const CATEGORIES = [
  { value: 'sponsorship',    label: '🧒 كفالة أيتام' },
  { value: 'education',      label: '📚 دعم تعليمي' },
  { value: 'medical',        label: '🏥 رعاية طبية' },
  { value: 'relief',         label: '🆘 إغاثة طارئة' },
  { value: 'infrastructure', label: '🏗️ بنية تحتية' },
];
const STATUSES = [
  { value: 'active',     label: 'نشط',     color: '#1F7A4A' },
  { value: 'completed',  label: 'مكتمل',   color: '#2980B9' },
  { value: 'paused',     label: 'موقوف',   color: '#FF8C00' },
  { value: 'cancelled',  label: 'ملغي',    color: '#E74C3C' },
];

const statusStyle = (status: string): React.CSSProperties => {
  const s = STATUSES.find(x => x.value === status);
  return { background: `${s?.color || '#9CA3AF'}18`, color: s?.color || '#9CA3AF', padding: '0.22rem 0.7rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 };
};

// ─── Project Modal ────────────────────────────────────────────────────────────
const ProjectModal: React.FC<{
  project?: any;
  onClose: () => void;
  onSave: (data: ProjectFormData, id?: number) => void;
  isSaving: boolean;
}> = ({ project, onClose, onSave, isSaving }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      title:       project.title,
      description: project.description || '',
      category:    project.category,
      goalAmount:  project.goalAmount,
      status:      project.status,
      isFeatured:  project.isFeatured,
    } : { category: 'sponsorship', status: 'active', goalAmount: 1000, isFeatured: false },
  });

  const inp = (err?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.7rem 1rem', border: `2px solid ${err ? '#E74C3C' : '#E0E0E0'}`,
    borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'Tajawal, sans-serif',
    outline: 'none', boxSizing: 'border-box',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
       onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 900, color: '#1B3A5C', fontSize: '1.3rem' }}>
            {project ? '✏️ تعديل المشروع' : '➕ مشروع جديد'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit(d => onSave(d, project?.id))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>عنوان المشروع *</label>
            <input {...register('title')} style={inp(!!errors.title)} placeholder="مثال: كفالة 50 يتيم في عدن" />
            {errors.title && <p style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '0.2rem' }}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الوصف *</label>
            <textarea {...register('description')} rows={4} style={{ ...inp(!!errors.description), resize: 'vertical' }} placeholder="وصف تفصيلي للمشروع وأهدافه..." />
            {errors.description && <p style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '0.2rem' }}>{errors.description.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>التصنيف *</label>
              <select {...register('category')} style={inp()}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>الحالة *</label>
              <select {...register('status')} style={inp()}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: '#374151', fontSize: '0.9rem' }}>المبلغ المستهدف ($) *</label>
            <input {...register('goalAmount', { valueAsNumber: true })} type="number" min={1} style={inp(!!errors.goalAmount)} placeholder="10000" />
            {errors.goalAmount && <p style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '0.2rem' }}>{errors.goalAmount.message}</p>}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input {...register('isFeatured')} type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#FF8C00' }} />
            <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>تمييز هذا المشروع (Featured)</span>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={isSaving}
              style={{ flex: 1, padding: '0.8rem', background: isSaving ? '#9CA3AF' : '#1B3A5C', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem' }}>
              {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ المشروع'}
            </button>
            <button type="button" onClick={onClose}
              style={{ padding: '0.8rem 1.5rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem' }}>
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────────────────────────
const DeleteConfirm: React.FC<{ name: string; onConfirm: () => void; onCancel: () => void; isLoading: boolean }> = ({ name, onConfirm, onCancel, isLoading }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
    <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }}
      style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '380px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗑️</div>
      <h3 style={{ fontWeight: 900, color: '#1B3A5C', marginBottom: '0.5rem' }}>تأكيد الحذف</h3>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        هل أنت متأكد من حذف مشروع <strong>"{name}"</strong>؟ لا يمكن التراجع عن هذا الإجراء.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onConfirm} disabled={isLoading}
          style={{ flex: 1, padding: '0.75rem', background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
          {isLoading ? '⏳ جاري الحذف...' : '✅ نعم، احذف'}
        </button>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '0.75rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
          إلغاء
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProjectsAdminPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Fetch
  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', catFilter],
    queryFn: () => api.get('/projects', { params: { limit: 100, category: catFilter || undefined } }).then(r => r.data),
  });
  const projects = (data?.data?.projects || []).filter((p: any) =>
    !search || p.title.includes(search) || p.description?.includes(search)
  );

  // Create / Update
  const saveMutation = useMutation({
    mutationFn: ({ data, id }: { data: ProjectFormData; id?: number }) =>
      id ? api.put(`/projects/${id}`, data) : api.post('/projects', data),
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'تم تحديث المشروع ✅' : 'تم إنشاء المشروع ✅');
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      setShowModal(false);
      setEditProject(null);
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success('تم حذف المشروع');
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('لا يمكن حذف المشروع — قد تكون هناك تبرعات مرتبطة به'),
  });

  const openNew  = () => { setEditProject(null); setShowModal(true); };
  const openEdit = (p: any) => { setEditProject(p); setShowModal(true); };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginRight: '250px', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C' }}>📁 إدارة المشاريع</h1>
            <p style={{ color: '#6B7280', marginTop: '0.2rem' }}>{projects.length} مشروع</p>
          </div>
          <button onClick={openNew}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FF8C00', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(255,140,0,0.35)' }}>
            <Plus size={18} /> مشروع جديد
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في المشاريع..."
              style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem', border: '2px solid #E0E0E0', borderRadius: '8px', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {[{ v: '', l: 'الكل' }, ...CATEGORIES.map(c => ({ v: c.value, l: c.label }))].map(f => (
            <button key={f.v} onClick={() => setCatFilter(f.v)}
              style={{ padding: '0.5rem 1rem', border: `2px solid ${catFilter === f.v ? '#1B3A5C' : '#E0E0E0'}`, borderRadius: '8px', background: catFilter === f.v ? '#1B3A5C' : '#fff', color: catFilter === f.v ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
              {f.l}
            </button>
          ))}
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
                  {['المشروع', 'التصنيف', 'المبلغ المستهدف', 'المُجمَّع', 'الإنجاز', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.82rem', color: '#6B7280', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any) => {
                  const progress = Math.min(Math.round((p.currentAmount / p.goalAmount) * 100), 100);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.92rem' }}>{p.title}</div>
                        {p.isFeatured && <span style={{ background: '#FFF3E0', color: '#FF8C00', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '4px' }}>⭐ مميز</span>}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                          {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1B3A5C' }}>${Number(p.goalAmount).toLocaleString()}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1F7A4A' }}>${Number(p.currentAmount).toLocaleString()}</td>
                      <td style={{ padding: '1rem', minWidth: '100px' }}>
                        <div style={{ background: '#E0E0E0', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '0.25rem' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? '#1F7A4A' : '#FF8C00', borderRadius: '999px', transition: 'width 0.5s' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{progress}%</span>
                      </td>
                      <td style={{ padding: '1rem' }}><span style={statusStyle(p.status)}>{STATUSES.find(s => s.value === p.status)?.label || p.status}</span></td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/projects/${p.id}`} target="_blank"
                            style={{ padding: '0.4rem 0.5rem', background: '#EBF0F7', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1B3A5C', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Eye size={15} />
                          </Link>
                          <button onClick={() => openEdit(p)}
                            style={{ padding: '0.4rem 0.5rem', background: '#F0FDF4', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1F7A4A' }}>
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteTarget(p)}
                            style={{ padding: '0.4rem 0.5rem', background: '#FEF2F2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#E74C3C' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {projects.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>لا توجد مشاريع</td></tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <ProjectModal
            project={editProject}
            onClose={() => { setShowModal(false); setEditProject(null); }}
            onSave={(data, id) => saveMutation.mutate({ data, id })}
            isSaving={saveMutation.isPending}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            name={deleteTarget.title}
            onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
            isLoading={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsAdminPage;
