import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../services/projects.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import ProjectCard from '../components/ProjectCard';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import '../index.css';

// ==========================================
// الصفحة الرئيسية للموقع
// ==========================================
const HomePage: React.FC = () => {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  // جلب المشاريع المميزة
  const { data: projectsData } = useQuery({
    queryKey: ['featured-projects'],
    queryFn:  () => projectsService.getProjects({ featured: true, limit: 6 }),
  });

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />

      {/* ========================================== */}
      {/* قسم الـ Hero                             */}
      {/* ========================================== */}
      <HeroBanner />

      {/* ========================================== */}
      {/* قسم الإحصائيات السريعة                   */}
      {/* ========================================== */}
      <section
        ref={statsRef}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding:    '5rem 0',
          color:      '#fff',
          position:   'relative',
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { label: 'يتيم مكفول',     end: 1250, suffix: '+', icon: '🧒' },
              { label: 'أسرة مدعومة',   end: 430,  suffix: '+', icon: '👨‍👩‍👧' },
              { label: 'مشروع خيري',     end: 87,   suffix: '',  icon: '📋' },
              { label: 'متبرع كريم',     end: 5600, suffix: '+', icon: '❤️' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FF8C00' }}>
                  {statsInView && <CountUp end={stat.end} duration={2.5} separator="," />}
                  {stat.suffix}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9, marginTop: '0.25rem' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* المشاريع المميزة                          */}
      {/* ========================================== */}
      <section style={{ padding: '5rem 0', background: '#F5F5F5' }}>
        <div className="container">
          <h2 className="section-title">مشاريعنا الخيرية</h2>
          <div className="section-divider" />
          <p className="section-subtitle">تبرعاتكم تصنع الفارق في حياة الأيتام والأسر المحتاجة</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {projectsData?.data?.projects?.map((project: any, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="/projects" className="btn btn-primary">
              عرض جميع المشاريع ←
            </a>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* قسم "من نحن" المختصر                     */}
      {/* ========================================== */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', borderRadius: 'var(--radius-xl)', padding: '4rem 3rem', color: '#fff', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>🌟</div>
                <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>مؤسسة اليتامى الخيرية</h3>
                <p style={{ opacity: 0.85 }}>نضع الحب في كل عمل خير</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                من نحن؟
              </h2>
              <p style={{ color: '#6B7280', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                مؤسسة اليتامى الخيرية مؤسسة يمنية إنسانية تُعنى برعاية الأيتام والأسر المتعففة في اليمن،
                تسعى إلى توفير الكفالة، الدعم التعليمي، الرعاية الصحية، والإغاثة الطارئة من خلال برامجها
                الخيرية الشاملة والشفافة.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="btn btn-primary">تعرف علينا أكثر</div>
                <div className="btn btn-donate" style={{ cursor: 'pointer' }}>
                  🤲 تبرع الآن
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* بانر التبرع CTA                            */}
      {/* ========================================== */}
      <section style={{
        padding:    '4rem 0',
        background: 'linear-gradient(135deg, #FF8C00, #e07b00)',
        textAlign:  'center',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>
              ساهم في صنع مستقبل أفضل
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              تبرعك مهما كان صغيراً يُحدث فرقاً حقيقياً في حياة طفل يتيم
            </p>
            <a href="/donate" className="btn" style={{
              background: '#fff',
              color:      '#FF8C00',
              fontSize:   '1.2rem',
              fontWeight: 900,
              padding:    '1rem 3rem',
              boxShadow:  '0 8px 30px rgba(0,0,0,0.2)',
            }}>
              🤲 تبرع الآن
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
