import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart, TrendingUp, Users, Calendar, ArrowRight, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { projectsService } from '../services/projects.service';
import '../index.css';

const CATEGORY_LABELS: Record<string, string> = {
  sponsorship:    '🧒 كفالة أيتام',
  education:      '📚 دعم تعليمي',
  medical:        '🏥 رعاية طبية',
  relief:         '🆘 إغاثة طارئة',
  infrastructure: '🏗️ بنية تحتية',
};

const CATEGORY_COLORS: Record<string, string> = {
  sponsorship: '#1B3A5C', education: '#2980B9', medical: '#27AE60',
  relief: '#E74C3C', infrastructure: '#7F8C8D',
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.getProjectById(Number(id)),
    enabled: !!id,
  });

  const project = data?.data;

  if (isLoading) return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#6B7280', fontSize: '1.2rem' }}>
        ⏳ جاري تحميل المشروع...
      </div>
    </div>
  );

  if (isError || !project) return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '4rem' }}>😔</div>
        <h2 style={{ color: '#1B3A5C', marginTop: '1rem' }}>المشروع غير موجود</h2>
        <Link to="/projects" style={{ color: '#FF8C00', fontWeight: 700, marginTop: '1rem', display: 'inline-block' }}>
          ← العودة للمشاريع
        </Link>
      </div>
    </div>
  );

  const progress = Math.min(Math.round((project.currentAmount / project.goalAmount) * 100), 100);
  const remaining = Math.max(project.goalAmount - project.currentAmount, 0);
  const catColor = CATEGORY_COLORS[project.category] || '#1B3A5C';

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />

      {/* رأس الصفحة */}
      <div style={{
        background: `linear-gradient(135deg, ${catColor}ee, ${catColor}99)`,
        padding: '3rem 0', color: '#fff',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Link to="/projects" style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
            <ArrowRight size={16} /> العودة للمشاريع
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 600 }}>
              {CATEGORY_LABELS[project.category] || project.category}
            </span>
            <span style={{ background: project.status === 'active' ? '#1F7A4A' : '#9CA3AF', padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
              {project.status === 'active' ? '✅ نشط' : project.status === 'completed' ? '✔ مكتمل' : project.status}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.3 }}>{project.title}</h1>
        </div>
      </div>

      <section style={{ background: '#F5F5F5', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>

          {/* الجانب الأيمن - التفاصيل */}
          <div>
            {/* صورة المشروع */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: `linear-gradient(135deg, ${catColor}22, ${catColor}44)`, borderRadius: '16px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '2rem' }}>
              {project.category === 'sponsorship' ? '🧒' : project.category === 'education' ? '📚' : project.category === 'medical' ? '🏥' : project.category === 'relief' ? '🆘' : '🏗️'}
            </motion.div>

            {/* الوصف */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, color: '#1B3A5C', marginBottom: '1rem', fontSize: '1.2rem' }}>عن المشروع</h2>
              <p style={{ color: '#374151', lineHeight: 2, fontSize: '1rem' }}>{project.description}</p>
            </div>

            {/* إحصائيات المشروع */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { icon: <TrendingUp size={22} />, label: 'المبلغ المستهدف', value: `$${project.goalAmount?.toLocaleString()}` },
                { icon: <Users size={22} />,     label: 'عدد التبرعات',   value: project._count?.donations || 0 },
                { icon: <Calendar size={22} />,  label: 'الإنجاز',        value: `${progress}%` },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                  <div style={{ color: catColor, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1B3A5C' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيسر - بطاقة التبرع */}
          <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
              {/* شريط التقدم */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#1F7A4A', fontSize: '1.1rem' }}>{progress}% مكتمل</span>
                  <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>${project.currentAmount?.toLocaleString()} جُمع</span>
                </div>
                <div style={{ background: '#E0E0E0', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, #1F7A4A, #27AE60)`, borderRadius: '999px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.8rem', color: '#9CA3AF' }}>
                  <span>الهدف: ${project.goalAmount?.toLocaleString()}</span>
                  <span>المتبقي: ${remaining.toLocaleString()}</span>
                </div>
              </div>

              {/* أزرار تبرع سريع */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[10, 25, 50, 100, 250, 500].map(amount => (
                  <Link key={amount} to={`/donate?projectId=${project.id}&amount=${amount}`}
                    style={{ padding: '0.6rem', border: '2px solid #E0E0E0', borderRadius: '8px', color: '#374151', textAlign: 'center', fontWeight: 700, textDecoration: 'none', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', transition: 'all 0.2s' }}>
                    ${amount}
                  </Link>
                ))}
              </div>

              <Link to={`/donate?projectId=${project.id}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#FF8C00', color: '#fff', padding: '0.875rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '1.05rem', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 6px 20px rgba(255,140,0,0.35)' }}>
                <Heart size={18} fill="#fff" /> تبرع لهذا المشروع
              </Link>

              <button
                onClick={() => { navigator.share?.({ title: project.title, url: window.location.href }); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'transparent', border: '2px solid #E0E0E0', color: '#374151', padding: '0.7rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', marginTop: '0.75rem', fontFamily: 'Tajawal, sans-serif', fontSize: '0.95rem' }}>
                <Share2 size={16} /> مشاركة المشروع
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
