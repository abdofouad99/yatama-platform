import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign, Users, FolderOpen, FileText,
  TrendingUp, Clock, CheckCircle, XCircle,
  LogOut, BarChart2, Settings, Heart,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import api from '../../services/api';
import '../../index.css';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data),
};

// ==========================================
// Sidebar
// ==========================================
const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard',    label: 'لوحة التحكم',    icon: <BarChart2 size={20} />,  href: '/admin/dashboard' },
    { key: 'projects',     label: 'المشاريع',        icon: <FolderOpen size={20} />, href: '/admin/projects' },
    { key: 'donations',    label: 'التبرعات',        icon: <Heart size={20} />,      href: '/admin/donations' },
    { key: 'applications', label: 'الطلبات',         icon: <FileText size={20} />,   href: '/admin/applications' },
    { key: 'beneficiaries',label: 'المستفيدون',      icon: <Users size={20} />,      href: '/admin/beneficiaries' },
    { key: 'settings',     label: 'الإعدادات',       icon: <Settings size={20} />,   href: '/admin/settings' },
  ];

  return (
    <aside style={{
      width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #0d1e2e, #1B3A5C)',
      display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, right: 0,
      boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
    }}>
      {/* الشعار */}
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#FF8C00', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌙</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>مؤسسة اليتامى</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>لوحة الإدارة</div>
          </div>
        </div>
      </div>

      {/* القائمة */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {menuItems.map(item => (
          <Link key={item.key} to={item.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: '10px', marginBottom: '0.25rem', textDecoration: 'none',
              background: active === item.key ? 'rgba(255,140,0,0.15)' : 'transparent',
              color: active === item.key ? '#FF8C00' : 'rgba(255,255,255,0.7)',
              fontWeight: active === item.key ? 700 : 500, fontSize: '0.95rem',
              transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif',
              borderRight: active === item.key ? '3px solid #FF8C00' : '3px solid transparent',
            }}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* بيانات المستخدم */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{user?.fullName}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{user?.roleName}</div>
        <button onClick={() => { logout(); navigate('/admin/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(231,76,60,0.15)', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Tajawal, sans-serif', fontWeight: 600, width: '100%' }}>
          <LogOut size={15} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
};

// ==========================================
// Stat Card Component
// ==========================================
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; sub?: string; delay?: number }> =
  ({ title, value, icon, color, sub, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: '#fff', borderRadius: '16px', padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        borderRight: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</p>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: '#1B3A5C', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '0.4rem' }}>{sub}</p>}
        </div>
        <div style={{ width: '50px', height: '50px', background: `${color}18`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

// ==========================================
// SVG Bar Chart (تبرعات شهرية)
// ==========================================
const BarChart: React.FC<{ data: { month: string; amount: number }[] }> = ({ data }) => {
  if (!data.length) return <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>لا توجد بيانات بعد</div>;
  const max = Math.max(...data.map(d => d.amount), 1);
  const W = 480, H = 160, barW = Math.floor(W / data.length) - 8;
  const MONTHS_AR: Record<string, string> = {
    '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
    '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
    '09': 'سبتمبر','10': 'أكتوبر','11': 'نوفمبر','12': 'ديسمبر',
  };
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: '100%', overflow: 'visible', direction: 'ltr' }}>
      {data.map((d, i) => {
        const barH = Math.max((d.amount / max) * H, 4);
        const x = i * (W / data.length) + 4;
        const y = H - barH;
        const monthKey = d.month.split('-')[1];
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={barW} height={barH} rx={4}
              fill="url(#barGrad)" opacity={0.9} />
            <text x={x + barW / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="#9CA3AF">
              {MONTHS_AR[monthKey] || d.month}
            </text>
            {d.amount > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#1B3A5C" fontWeight="bold">
                ${d.amount >= 1000 ? (d.amount / 1000).toFixed(1) + 'k' : d.amount}
              </text>
            )}
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#1F7A4A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ==========================================
// Donut Chart (حالة المشاريع)
// ==========================================
const DonutChart: React.FC<{ segments: { label: string; value: number; color: string }[] }> = ({ segments }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  if (total === 0) return <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF' }}>لا توجد مشاريع</div>;
  let angle = -90;
  const R = 60, cx = 80, cy = 80;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const startAngle = angle;
    angle += pct * 360;
    const endAngle = angle;
    const toRad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(startAngle));
    const y1 = cy + R * Math.sin(toRad(startAngle));
    const x2 = cx + R * Math.cos(toRad(endAngle));
    const y2 = cy + R * Math.sin(toRad(endAngle));
    const large = pct > 0.5 ? 1 : 0;
    return { ...seg, path: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`, pct };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <svg viewBox="0 0 160 160" style={{ width: '120px', flexShrink: 0 }}>
        {arcs.map((arc, i) => <path key={i} d={arc.path} fill={arc.color} opacity={0.9} />)}
        <circle cx={cx} cy={cy} r={36} fill="#fff" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" fill="#1B3A5C">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fill="#9CA3AF">مشروع</text>
      </svg>
      <div style={{ flex: 1 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#374151' }}>{seg.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.85rem' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Status Badge
// ==========================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'معلق', color: '#FF8C00', bg: '#FFF3E0' },
    completed: { label: 'مكتمل', color: '#1F7A4A', bg: '#F0FDF4' },
    approved:  { label: 'مقبول', color: '#2980B9', bg: '#EBF5FB' },
    rejected:  { label: 'مرفوض', color: '#E74C3C', bg: '#FEF2F2' },
    active:    { label: 'نشط',   color: '#1F7A4A', bg: '#F0FDF4' },
  };
  const s = map[status] || { label: status, color: '#9CA3AF', bg: '#F9FAFB' };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
      {s.label}
    </span>
  );
};

// ==========================================
// Dashboard Page
// ==========================================
const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 60000,
  });

  const stats              = data?.data?.stats || {};
  const recentDonations    = data?.data?.recentDonations || [];
  const recentApplications = data?.data?.recentApplications || [];
  const monthlyData        = data?.data?.monthlyData || [];

  // Donut segments من الإحصائيات
  const donutSegments = [
    { label: 'نشطة',   value: stats.activeProjects || 0,                                           color: '#1F7A4A' },
    { label: 'مكتملة', value: (stats.totalProjects || 0) - (stats.activeProjects || 0),            color: '#2980B9' },
  ].filter(s => s.value > 0);

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar active="dashboard" />

      {/* المحتوى الرئيسي */}
      <main style={{ marginRight: '250px', padding: '2rem' }}>
        {/* رأس الصفحة */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B3A5C', marginBottom: '0.25rem' }}>
            مرحباً، {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#6B7280' }}>
            {new Date().toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* الإحصائيات */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>⏳ جاري تحميل الإحصائيات...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <StatCard title="إجمالي التبرعات" value={`$${Number(stats.totalDonationsAmount || 0).toLocaleString()}`} icon={<DollarSign size={24} />} color="#FF8C00" sub={`${stats.totalDonationsCount || 0} عملية تبرع`} delay={0} />
            <StatCard title="المتبرعون" value={stats.totalDonors || 0} icon={<Users size={24} />} color="#1B3A5C" sub="متبرع مسجل" delay={0.05} />
            <StatCard title="المشاريع النشطة" value={stats.activeProjects || 0} icon={<FolderOpen size={24} />} color="#1F7A4A" sub={`من ${stats.totalProjects || 0} مشروع`} delay={0.1} />
            <StatCard title="طلبات معلقة" value={stats.pendingApplications || 0} icon={<FileText size={24} />} color="#E74C3C" sub="تحتاج مراجعة" delay={0.15} />
            <StatCard title="الأيتام / المستفيدون" value={(stats.totalOrphans || 0) + (stats.totalFamilies || 0)} icon={<Heart size={24} />} color="#3498DB" sub="مستفيد مسجل" delay={0.2} />
            <StatCard title="المهام غير المكتملة" value={stats.uncompletedTasks || 0} icon={<CheckCircle size={24} />} color="#9CA3AF" sub="تحتاج تنفيذ ميداني" delay={0.25} />
          </div>
        )}

        {/* الرسوم البيانية */}
        {!isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1B3A5C', marginBottom: '1rem' }}>📈 التبرعات الشهرية ($)</h2>
              <BarChart data={monthlyData} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1B3A5C', marginBottom: '1rem' }}>📊 حالة المشاريع</h2>
              <DonutChart segments={donutSegments} />
            </motion.div>
          </div>
        )}

        {/* الجداول */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* آخر التبرعات */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3A5C' }}>💰 آخر التبرعات</h2>
              <Link to="/admin/donations" style={{ color: '#FF8C00', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>عرض الكل</Link>
            </div>
            {recentDonations.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem 0' }}>لا توجد تبرعات بعد</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentDonations.map((d: any) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F9FAFB', borderRadius: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.9rem' }}>
                        {d.donor?.isAnonymous ? '🔒 متبرع مجهول' : d.donor?.fullName}
                      </p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                        {d.project?.title || 'تبرع عام'} — {new Date(d.donatedAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: 900, color: '#1F7A4A', fontSize: '1rem' }}>${Number(d.amount).toLocaleString()}</p>
                      <StatusBadge status={d.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* آخر الطلبات */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3A5C' }}>📋 آخر الطلبات</h2>
              <Link to="/admin/applications" style={{ color: '#FF8C00', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>عرض الكل</Link>
            </div>
            {recentApplications.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem 0' }}>لا توجد طلبات بعد</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentApplications.map((a: any) => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F9FAFB', borderRadius: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1B3A5C', fontSize: '0.9rem' }}>{a.applicantName}</p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                        {a.membersCount} أفراد — {new Date(a.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* روابط سريعة */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3A5C', marginBottom: '1.25rem' }}>⚡ إجراءات سريعة</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: '+ مشروع جديد',     href: '/admin/projects/new',      color: '#1B3A5C' },
              { label: '📋 مراجعة الطلبات', href: '/admin/applications',      color: '#E74C3C' },
              { label: '📊 تصدير التقارير', href: '/admin/donations',         color: '#1F7A4A' },
              { label: '🌐 عرض الموقع',    href: '/',                         color: '#FF8C00' },
            ].map(btn => (
              <Link key={btn.label} to={btn.href}
                style={{ padding: '0.65rem 1.25rem', background: `${btn.color}12`, color: btn.color, border: `2px solid ${btn.color}30`, borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif' }}>
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
