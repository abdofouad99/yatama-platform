import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
    title: 'نرعى الأيتام',
    highlight: 'ونعيد الأمل',
    desc: 'مؤسسة اليتامى الخيرية تسعى لتغيير واقع الأيتام في اليمن وتوفير حياة كريمة لهم ولعائلاتهم.'
  },
  {
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop',
    title: 'مشاريع الإغاثة',
    highlight: 'العاجلة',
    desc: 'كن جزءاً من قوافل الخير التي تصل إلى أشد المناطق احتياجاً في اليمن.'
  },
  {
    image: 'https://images.unsplash.com/photo-1593113580332-ceb47bfbf8e9?q=80&w=2069&auto=format&fit=crop',
    title: 'كفالة طالب',
    highlight: 'علم',
    desc: 'ساهم في بناء جيل الغد من خلال توفير الحقيبة المدرسية والرسوم التعليمية للأيتام.'
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
  <section style={{
    minHeight:  '92vh',
    position:   'relative',
    display:    'flex',
    alignItems: 'center',
    overflow:   'hidden',
    direction:  'rtl',
    backgroundColor: '#1B4DA1'
  }}>
    {/* شريط الصور المتحرك (Carousel Background) */}
    <AnimatePresence initial={false}>
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `url(${SLIDES[currentSlide].image}) center/cover no-repeat`,
          zIndex: 0
        }}
      />
    </AnimatePresence>

    {/* طبقة تظليل لضمان وضوح النصوص (Overlay) */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(27,77,161,0.85) 0%, rgba(27,77,161,0.5) 50%, rgba(0,0,0,0.6) 100%)',
      zIndex: 1
    }} />

    {/* أزرار التحكم بالـ Slider */}
    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
      {SLIDES.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          style={{
            width: '12px', height: '12px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: i === currentSlide ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s'
          }}
        />
      ))}
    </div>

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 2, width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

        {/* النص الرئيسي */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '0.5rem',
              background:   'rgba(255,140,0,0.15)',
              border:       '1px solid rgba(255,140,0,0.3)',
              borderRadius: '999px',
              padding:      '0.35rem 1rem',
              color:        '#FF8C00',
              fontSize:     '0.85rem',
              fontWeight:   600,
              marginBottom: '1.5rem',
            }}
          >
            <Shield size={14} /> مؤسسة خيرية معتمدة — اليمن
          </motion.div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: '1.25rem' }}>
            <motion.span
              key={`t1-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {SLIDES[currentSlide].title}
            </motion.span>{' '}
            <motion.span
              key={`t2-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ color: 'var(--color-accent)' }}
            >
              {SLIDES[currentSlide].highlight}
            </motion.span>
          </h1>

          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, marginBottom: '2rem', maxWidth: '480px' }}
          >
            {SLIDES[currentSlide].desc}
          </motion.p>

          {/* إحصائية سريعة */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            {[
              { num: '+1,250', label: 'يتيم مكفول' },
              { num: '+430',   label: 'أسرة مدعومة' },
              { num: '+87',    label: 'مشروع منجز' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FF8C00' }}>{stat.num}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* أزرار CTA */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.a
              href="/donate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '0.5rem',
                background:   '#FF8C00',
                color:        '#fff',
                padding:      '0.875rem 2rem',
                borderRadius: '10px',
                fontWeight:   800,
                fontSize:     '1.05rem',
                textDecoration: 'none',
                boxShadow:    '0 8px 30px rgba(255,140,0,0.4)',
                fontFamily:   'Tajawal, sans-serif',
              }}
            >
              <Heart size={18} fill="#fff" /> تبرع الآن
            </motion.a>

            <motion.a
              href="/projects"
              whileHover={{ scale: 1.03 }}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '0.5rem',
                background:   'rgba(255,255,255,0.1)',
                border:       '2px solid rgba(255,255,255,0.3)',
                color:        '#fff',
                padding:      '0.875rem 2rem',
                borderRadius: '10px',
                fontWeight:   700,
                fontSize:     '1rem',
                textDecoration: 'none',
                fontFamily:   'Tajawal, sans-serif',
              }}
            >
              استعرض مشاريعنا <ArrowLeft size={16} />
            </motion.a>
          </div>
        </motion.div>

        {/* البطاقة الزجاجية */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{
            background:      'rgba(255,255,255,0.07)',
            backdropFilter:  'blur(20px)',
            border:          '1px solid rgba(255,255,255,0.15)',
            borderRadius:    '20px',
            padding:         '2rem',
          }}>
            <h3 style={{ color: '#FF8C00', fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem' }}>
              🤲 تبرع سريع
            </h3>

            {/* مبالغ سريعة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[10, 25, 50, 100, 250, 500].map(amount => (
                <a
                  key={amount}
                  href={`/donate?amount=${amount}`}
                  style={{
                    padding:      '0.75rem',
                    background:   'rgba(255,255,255,0.1)',
                    border:       '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color:        '#fff',
                    textAlign:    'center',
                    fontWeight:   700,
                    textDecoration: 'none',
                    fontFamily:   'Tajawal, sans-serif',
                    transition:   'all 0.2s',
                    display:      'block',
                  }}
                >
                  ${amount}
                </a>
              ))}
            </div>

            <a href="/donate" style={{
              display:      'block',
              textAlign:    'center',
              background:   '#FF8C00',
              color:        '#fff',
              padding:      '0.875rem',
              borderRadius: '10px',
              fontWeight:   800,
              textDecoration: 'none',
              fontFamily:   'Tajawal, sans-serif',
              fontSize:     '1.05rem',
            }}>
              تبرع بمبلغ مخصص →
            </a>

            <p style={{
              textAlign:  'center',
              color:      'rgba(255,255,255,0.5)',
              fontSize:   '0.78rem',
              marginTop:  '0.75rem',
            }}>
              🔒 الدفع آمن ومشفر بالكامل
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
  );
};

export default HeroBanner;
