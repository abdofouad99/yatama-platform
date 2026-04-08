import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Globe, Users, Award, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const VALUES = [
  { icon: '🤲', title: 'الرحمة', desc: 'نتعامل مع كل مستفيد بقلب مفتوح ونفس راضية' },
  { icon: '🔍', title: 'الشفافية', desc: 'نُقدّم تقارير مالية دورية لضمان ثقة المتبرعين' },
  { icon: '⚖️', title: 'العدالة', desc: 'نوزّع الدعم بعدالة وفق معايير واضحة وموثوقة' },
  { icon: '🌱', title: 'الاستدامة', desc: 'نبني مشاريع تُحدث أثراً طويل الأمد في المجتمع' },
];

const STATS = [
  { value: '+1,250', label: 'يتيم مكفول', icon: '🧒' },
  { value: '+430',   label: 'أسرة مدعومة', icon: '👨‍👩‍👧' },
  { value: '+87',    label: 'مشروع منجز', icon: '✅' },
  { value: '12',     label: 'محافظة يمنية', icon: '🗺️' },
];

const TEAM = [
  { name: 'أ. محمد الأحمدي',    role: 'المدير التنفيذي',         emoji: '👨‍💼' },
  { name: 'د. سارة الزبيدي',    role: 'مديرة البرامج الخيرية',   emoji: '👩‍⚕️' },
  { name: 'م. خالد المتوكل',    role: 'مدير المشاريع',           emoji: '👨‍💻' },
  { name: 'أ. فاطمة الشيباني',  role: 'مديرة الشؤون المالية',   emoji: '👩‍💼' },
];

const AboutPage: React.FC = () => {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', background: '#fff' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0d1e2e 0%, #1B3A5C 50%, #1F7A4A 100%)', padding: 'clamp(4rem,10vw,8rem) 0', textAlign: 'center', color: '#fff' }}>
        <motion.div {...fadeUp()}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌙</div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.3 }}>
            مؤسسة اليتامى الخيرية
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2.5vw,1.3rem)', opacity: 0.85, maxWidth: '650px', margin: '0 auto', lineHeight: 1.8 }}>
            منذ عام 2015، ونحن نرعى الأيتام والأسر المتعففة في اليمن،
            نحمل أمانة الإنسانية ونُحوّل التبرعات إلى أمل حقيقي.
          </p>
        </motion.div>
      </section>

      {/* القصة */}
      <section style={{ padding: 'clamp(3rem,7vw,6rem) 0', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '3rem', alignItems: 'center' }}>
          <motion.div {...fadeUp(0.1)}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#1B3A5C', marginBottom: '1.25rem' }}>
              قصتنا بدأت من رحم الأزمة
            </h2>
            <p style={{ color: '#374151', lineHeight: 2, fontSize: '1.05rem', marginBottom: '1rem' }}>
              في عام 2015، اندلعت الحرب وتضاعفت معاناة الأسر اليمنية. رأى مجموعة من المحسنين والمتطوعين أن الأطفال لا ذنب لهم فيما يجري، فأسسوا هذه المؤسسة لتكون جسراً بين قلوب المتبرعين الكريمة واحتياجات الأيتام والأسر.
            </p>
            <p style={{ color: '#374151', lineHeight: 2, fontSize: '1.05rem' }}>
              اليوم، نعمل في 12 محافظة يمنية، مع فريق متطوع متخصص ومنظومة رقابية شفافة تضمن وصول كل ريال إلى مستحقه.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.2)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FF8C00' }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* الرسالة والرؤية */}
      <section style={{ padding: 'clamp(3rem,7vw,6rem) 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#1B3A5C' }}>رسالتنا ورؤيتنا</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: <Target size={32} />, color: '#1B3A5C', bg: '#EBF0F7',
                title: 'رسالتنا',
                text: 'تقديم الرعاية الشاملة للأيتام والأسر المحتاجة في اليمن عبر برامج مستدامة تشمل الكفالة الشهرية، الدعم التعليمي، والرعاية الصحية.',
              },
              {
                icon: <Globe size={32} />, color: '#1F7A4A', bg: '#F0FDF4',
                title: 'رؤيتنا',
                text: 'مجتمع يمني يتمتع فيه كل طفل بحق التعليم والصحة والأمان بغض النظر عن ظروفه، ومؤسسة خيرية رائدة على المستوى العربي.',
              },
              {
                icon: <Shield size={32} />, color: '#FF8C00', bg: '#FFF3E0',
                title: 'التزامنا',
                text: 'نلتزم بأعلى معايير الشفافية المالية والحوكمة الرشيدة، ونُصدر تقارير ربع سنوية تُوثّق كل ريال من التبرعات وكيفية صرفه.',
              },
            ].map(card => (
              <motion.div key={card.title} {...fadeUp(0.1)} style={{ background: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', borderTop: `4px solid ${card.color}` }}>
                <div style={{ width: '60px', height: '60px', background: card.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, marginBottom: '1.25rem' }}>
                  {card.icon}
                </div>
                <h3 style={{ fontWeight: 800, color: '#1B3A5C', fontSize: '1.2rem', marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قيمنا */}
      <section style={{ background: '#F9FAFB', padding: 'clamp(3rem,7vw,6rem) 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#1B3A5C' }}>قيمنا الأساسية</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>المبادئ التي تُحرّك كل عمل نقوم به</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem' }}>
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.08)} style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <h3 style={{ fontWeight: 800, color: '#1B3A5C', marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* الفريق */}
      <section style={{ padding: 'clamp(3rem,7vw,6rem) 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#1B3A5C' }}>فريق القيادة</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>الأشخاص الذين يُحوّلون التبرعات إلى تغيير حقيقي</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
            {TEAM.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)} style={{ background: '#fff', borderRadius: '20px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #1B3A5C, #1F7A4A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                  {t.emoji}
                </div>
                <h3 style={{ fontWeight: 800, color: '#1B3A5C', marginBottom: '0.35rem', fontSize: '1rem' }}>{t.name}</h3>
                <p style={{ color: '#FF8C00', fontSize: '0.85rem', fontWeight: 600 }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1B3A5C, #1F7A4A)', padding: 'clamp(3rem,7vw,5rem) 0', textAlign: 'center', color: '#fff' }}>
        <motion.div {...fadeUp()}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            انضم إلينا في صناعة الأمل 💛
          </h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            تبرعك بمبلغ بسيط قد يُغيّر مسيرة حياة يتيم أو أسرة بأكملها
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/donate" style={{ background: '#FF8C00', color: '#fff', padding: '0.9rem 2.5rem', borderRadius: '14px', fontWeight: 800, textDecoration: 'none', fontSize: '1.05rem', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 8px 25px rgba(255,140,0,0.4)' }}>
              🤝 تبرع الآن
            </a>
            <a href="/apply" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.9rem 2.5rem', borderRadius: '14px', fontWeight: 800, textDecoration: 'none', fontSize: '1.05rem', fontFamily: 'Tajawal, sans-serif', border: '2px solid rgba(255,255,255,0.3)' }}>
              🤲 طلب دعم
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
