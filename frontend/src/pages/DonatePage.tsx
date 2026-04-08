import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Heart, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';
import { projectsService }  from '../services/projects.service';
import { donationsService } from '../services/donations.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

// ==========================================
// مخطط التحقق
// ==========================================
const donationSchema = z.object({
  donorName:     z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  donorEmail:    z.string().email('بريد إلكتروني غير صالح'),
  donorPhone:    z.string().optional(),
  amount:        z.number({ invalid_type_error: 'أدخل مبلغاً صحيحاً' }).min(1, 'المبلغ يجب أن يكون 1 على الأقل'),
  projectId:     z.number().optional(),
  type:          z.enum(['one_time','monthly','zakat','sadaqa','kafala']),
  paymentMethod: z.enum(['stripe','bank_transfer']),
  isAnonymous:   z.boolean().optional(),
});
type DonationFormData = z.infer<typeof donationSchema>;

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

// ==========================================
// صفحة "تبرع الآن"
// ==========================================
const DonatePage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSuccess, setIsSuccess]           = useState(false);
  const [receiptNumber, setReceiptNumber]   = useState('');

  // جلب المشاريع للاختيار
  const { data: projectsData } = useQuery({
    queryKey: ['projects-for-donation'],
    queryFn:  () => projectsService.getProjects({ status: 'active' }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount:        50,
      type:          'one_time',
      paymentMethod: 'stripe',
      isAnonymous:   false,
    },
  });

  const watchedAmount = watch('amount');

  const handlePresetAmount = (amount: number) => {
    setSelectedAmount(amount);
    setValue('amount', amount);
  };

  const onSubmit = async (data: DonationFormData) => {
    try {
      const response = await donationsService.createDonation(data);
      setReceiptNumber(response.data.receiptNumber);
      setIsSuccess(true);
      toast.success('جزاك الله كل خير على تبرعك الكريم 🤲');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  };

  // ==========================================
  // شاشة النجاح
  // ==========================================
  if (isSuccess) {
    return (
      <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', maxWidth: '500px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 2, duration: 0.5 }}
            >
              <CheckCircle size={80} color="#1F7A4A" style={{ margin: '0 auto 1.5rem' }} />
            </motion.div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1B3A5C', marginBottom: '0.75rem' }}>
              تبرعك وصل! شكراً لك 🤲
            </h1>
            <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: '1rem' }}>
              بارك الله في مالك وجعله في ميزان حسناتك. تبرعك سيصنع فرقاً حقيقياً في حياة يتيم.
            </p>
            <div style={{
              background: '#F0FDF4', border: '2px solid #1F7A4A',
              borderRadius: '12px', padding: '1rem', marginBottom: '2rem',
            }}>
              <p style={{ font: 'bold', color: '#1F7A4A' }}>رقم إيصالك: {receiptNumber}</p>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>احتفظ بهذا الرقم للمتابعة</p>
            </div>
            <a href="/" className="btn btn-primary">العودة للصفحة الرئيسية</a>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />

      {/* رأس الصفحة */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A5C, #1F7A4A)',
        padding:    '4rem 0 2rem',
        textAlign:  'center',
        color:      '#fff',
      }}>
        <Heart size={40} style={{ margin: '0 auto 1rem' }} fill="#FF8C00" color="#FF8C00" />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>تبرع الآن</h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem', marginTop: '0.5rem' }}>
          تبرعك الآن يفتح أبواب الرحمة ويُغير واقع أسرة بأكملها
        </p>
      </div>

      {/* نموذج التبرع */}
      <section style={{ padding: '3rem 0', background: '#F5F5F5' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card" style={{ padding: '2rem' }}>

              {/* اختيار المبلغ */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem' }}>💰 اختر مبلغ التبرع (بالدولار)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {PRESET_AMOUNTS.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetAmount(amount)}
                      style={{
                        padding:      '0.75rem',
                        border:       `2px solid ${selectedAmount === amount ? '#FF8C00' : '#E0E0E0'}`,
                        borderRadius: '10px',
                        background:   selectedAmount === amount ? '#FFF3E0' : '#fff',
                        color:        selectedAmount === amount ? '#FF8C00' : '#333',
                        fontWeight:   700,
                        fontSize:     '1rem',
                        cursor:       'pointer',
                        fontFamily:   'Tajawal, sans-serif',
                        transition:   'all 0.2s',
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="أو أدخل مبلغاً مخصصاً..."
                  onChange={(e) => { setSelectedAmount(null); }}
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    border: `2px solid ${errors.amount ? '#E74C3C' : '#E0E0E0'}`,
                    borderRadius: '10px', fontSize: '1rem',
                    fontFamily: 'Tajawal, sans-serif', outline: 'none',
                  }}
                />
                {errors.amount && <p style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.amount.message}</p>}
              </div>

              {/* نوع التبرع */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem' }}>🎯 نوع التبرع</h3>
                <select
                  {...register('type')}
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    border: '2px solid #E0E0E0', borderRadius: '10px',
                    fontSize: '1rem', fontFamily: 'Tajawal, sans-serif',
                    background: '#fff', outline: 'none',
                  }}
                >
                  <option value="one_time">تبرع عام (مرة واحدة)</option>
                  <option value="monthly">تبرع شهري متكرر</option>
                  <option value="zakat">زكاة مال</option>
                  <option value="sadaqa">صدقة</option>
                  <option value="kafala">كفالة يتيم</option>
                </select>
              </div>

              {/* اختيار المشروع */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem' }}>📋 المشروع (اختياري)</h3>
                <select
                  {...register('projectId', { valueAsNumber: true })}
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    border: '2px solid #E0E0E0', borderRadius: '10px',
                    fontSize: '1rem', fontFamily: 'Tajawal, sans-serif',
                    background: '#fff', outline: 'none',
                  }}
                >
                  <option value="">تبرع عام للمؤسسة</option>
                  {projectsData?.data?.projects?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* بيانات المتبرع */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem' }}>👤 بياناتك</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <input {...register('donorName')} placeholder="الاسم الكريم *"
                    style={{ padding: '0.75rem 1rem', border: `2px solid ${errors.donorName ? '#E74C3C' : '#E0E0E0'}`, borderRadius: '10px', fontSize: '1rem', fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />

                  <input {...register('donorEmail')} type="email" placeholder="البريد الإلكتروني *"
                    style={{ padding: '0.75rem 1rem', border: `2px solid ${errors.donorEmail ? '#E74C3C' : '#E0E0E0'}`, borderRadius: '10px', fontSize: '1rem', fontFamily: 'Tajawal, sans-serif', outline: 'none', direction: 'ltr', textAlign: 'right' }} />

                  <input {...register('donorPhone')} placeholder="رقم الهاتف (اختياري)"
                    style={{ padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '10px', fontSize: '1rem', fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                </div>
              </div>

              {/* طريقة الدفع */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem' }}>💳 طريقة الدفع</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { value: 'stripe',        label: 'بطاقة ائتمان / Stripe',    icon: <CreditCard size={20} /> },
                    { value: 'bank_transfer', label: 'تحويل بنكي',               icon: <Building2  size={20} /> },
                  ].map(method => (
                    <label
                      key={method.value}
                      style={{
                        display:    'flex', alignItems: 'center', gap: '0.75rem',
                        padding:    '1rem', border: `2px solid ${watch('paymentMethod') === method.value ? '#1B3A5C' : '#E0E0E0'}`,
                        borderRadius: '10px', cursor: 'pointer',
                        background: watch('paymentMethod') === method.value ? '#EBF0F7' : '#fff',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input type="radio" value={method.value} {...register('paymentMethod')} style={{ display: 'none' }} />
                      <span style={{ color: '#1B3A5C' }}>{method.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* زر التبرع */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="btn btn-donate"
                style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}
              >
                {isSubmitting ? '⏳ جاري المعالجة...' : `🤲 تبرع الآن — $${watchedAmount || 0}`}
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF', marginTop: '1rem' }}>
                🔒 جميع المدفوعات آمنة ومشفرة بمعايير SSL
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonatePage;
