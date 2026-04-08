import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { projectsService } from '../services/projects.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import '../index.css';

const CATEGORIES = [
  { value: '',              label: 'جميع المشاريع' },
  { value: 'relief',       label: '🆘 إغاثة طارئة' },
  { value: 'education',    label: '📚 دعم تعليمي' },
  { value: 'medical',      label: '🏥 رعاية طبية' },
  { value: 'sponsorship',  label: '🧒 كفالة أيتام' },
  { value: 'infrastructure', label: '🏗️ بنية تحتية' },
];

const ProjectsPage: React.FC = () => {
  const [category,    setCategory]    = useState('');
  const [searchTerm,  setSearchTerm]  = useState('');
  const [page,        setPage]        = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', category, page],
    queryFn:  () => projectsService.getProjects({ category: category || undefined, page, limit: 9 }),
  });

  const projects   = data?.data?.projects || [];
  const pagination = data?.data?.pagination;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />

      {/* رأس الصفحة */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A5C, #2d5986)',
        padding: '4rem 0 3rem',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>مشاريعنا الخيرية</h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>
          كل مشروع هو أمل لقلوب تنتظر
        </p>
      </div>

      <section style={{ padding: '3rem 0', background: '#F5F5F5' }}>
        <div className="container">

          {/* أدوات الفلتر */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* بحث */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث عن مشروع..."
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem',
                  border: '2px solid #E0E0E0', borderRadius: '10px',
                  fontSize: '1rem', fontFamily: 'Tajawal, sans-serif', outline: 'none',
                  background: '#fff',
                }}
              />
            </div>

            {/* فلتر التصنيف */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setPage(1); }}
                  style={{
                    padding:      '0.5rem 1rem',
                    border:       `2px solid ${category === cat.value ? '#1B3A5C' : '#E0E0E0'}`,
                    borderRadius: '999px',
                    background:   category === cat.value ? '#1B3A5C' : '#fff',
                    color:        category === cat.value ? '#fff' : '#374151',
                    fontWeight:   600,
                    fontSize:     '0.875rem',
                    cursor:       'pointer',
                    fontFamily:   'Tajawal, sans-serif',
                    transition:   'all 0.2s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* شبكة المشاريع */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
              ⏳ جاري تحميل المشاريع...
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
              لا توجد مشاريع في هذا التصنيف حالياً
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {projects
                .filter((p: any) => !searchTerm || p.title.includes(searchTerm))
                .map((project: any, i: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
            </div>
          )}

          {/* التصفح بين الصفحات */}
          {pagination && pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '40px', height: '40px',
                    border:       `2px solid ${page === p ? '#1B3A5C' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    background:   page === p ? '#1B3A5C' : '#fff',
                    color:        page === p ? '#fff' : '#374151',
                    fontWeight:   700, cursor: 'pointer',
                    fontFamily:   'Tajawal, sans-serif',
                    transition:   'all 0.2s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
