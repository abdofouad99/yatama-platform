import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FileText, User, Phone, MapPin, Users, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import '../index.css';

const applicationSchema = z.object({
  applicantName:   z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  applicantPhone:  z.string().min(9, 'رقم الهاتف غير صحيح'),
  applicantEmail:  z.string().email('بريد غير صحيح').optional().or(z.literal('')),
  nationalId:      z.string().optional(),
  governorate:     z.string().min(1, 'يرجى اختيار المحافظة'),
  address:         z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  applicationType: z.enum(['orphan_sponsorship', 'emergency_relief', 'education', 'medical', 'general']),
  membersCount:    z.number().min(1).max(20),
  monthlyIncome:   z.number().min(0),
  description:     z.string().min(20, 'يرجى وصف وضعك بـ 20 حرف على الأقل'),
});
type ApplicationFormData = z.infer<typeof applicationSchema>;

const GOVERNORATES = [
  'صنعاء', 'عدن', 'تعز', 'حضرموت', 'الحديدة', 'إب', 'ذمار', 'المحويت',
  'حجة', 'صعدة', 'عمران', 'البيضاء', 'الجوف', 'مأرب', 'شبوة', 'أبين',
  'لحج', 'الضالع', 'ريمة', 'المهرة', 'سقطرى', 'أرخبيل',
];

const APPLICATION_TYPES = [
  { value: 'orphan_sponsorship', label: '🧒 كفالة يتيم',     color: '#1B3A5C' },
  { value: 'emergency_relief',  label: '🆘 إغاثة طارئة',    color: '#E74C3C' },
  { value: 'education',         label: '📚 دعم تعليمي',     color: '#2980B9' },
  { value: 'medical',           label: '🏥 رعاية طبية',     color: '#27AE60' },
  { value: 'general',           label: '🤲 دعم عام',        color: '#FF8C00' },
];

const ApplyPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [appId, setAppId]         = useState<number | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<ApplicationFormData>({
      resolver: zodResolver(applicationSchema),
      defaultValues: { applicationType: 'general', membersCount: 1, monthlyIncome: 0 },
    });

  const selectedType = watch('applicationType');

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const res = await api.post('/applications', data);
      setAppId(res.data.data?.id);
      setIsSuccess(true);
      toast.success('تم إرسال طلبك بنجاح! سيتواصل معك فريقنا قريباً 🤲');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  };

  if (isSuccess) return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F5F5F5' }}>
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fff', borderRadius: '20px', padding: '3rem', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 50px rgba(0,0,0,0.1)' }}>
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: 2, duration: 0.5 }}>
            <CheckCircle size={80} color="#1F7A4A" style={{ margin: '0 auto 1.5rem' }} />
          </motion.div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1B3A5C', marginBottom: '0.75rem' }}>
            تم استلام طلبك ✅
          </h1>
          <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            شكراً لتواصلك معنا. سيقوم فريق مؤسسة اليتامى الخيرية بمراجعة طلبك والتواصل معك خلال 3-5 أيام عمل.
          </p>
          {appId && (
            <div style={{ background: '#F0FDF4', border: '2px solid #1F7A4A', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 700, color: '#1F7A4A' }}>رقم الطلب: #{appId}</p>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>احتفظ بهذا الرقم للمتابعة</p>
            </div>
          )}
          <a href="/" style={{ display: 'inline-block', background: '#1B3A5C', color: '#fff', padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
            العودة للصفحة الرئيسية
          </a>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.75rem 1rem', border: `2px solid ${hasError ? '#E74C3C' : '#E0E0E0'}`,
    borderRadius: '10px', fontSize: '1rem', fontFamily: 'Tajawal, sans-serif', outline: 'none',
    background: '#fff', boxSizing: 'border-box',
  });
  const errMsg = (msg?: string) => msg ? <p style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '0.25rem' }}>{msg}</p> : null;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <Navbar />

      {/* رأس الصفحة */}
      <div style={{ background: 'linear-gradient(135deg, #1B3A5C, #1F7A4A)', padding: '4rem 0 2rem', textAlign: 'center', color: '#fff' }}>
        <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.9 }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>تقديم طلب دعم</h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem', marginTop: '0.5rem' }}>
          نحن هنا لمساعدتك — أخبرنا بوضعك وسنتواصل معك قريباً
        </p>
      </div>

      <section style={{ padding: '3rem 0', background: '#F5F5F5' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>

              {/* نوع الطلب */}
              <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem', fontSize: '1.1rem' }}>🎯 نوع الدعم المطلوب</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '0.5rem' }}>
                {APPLICATION_TYPES.map(type => (
                  <button key={type.value} type="button"
                    onClick={() => setValue('applicationType', type.value as any)}
                    style={{
                      padding: '0.75rem 0.5rem', border: `2px solid ${selectedType === type.value ? type.color : '#E0E0E0'}`,
                      borderRadius: '10px', background: selectedType === type.value ? `${type.color}15` : '#fff',
                      fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                      color: selectedType === type.value ? type.color : '#374151', transition: 'all 0.2s',
                    }}>{type.label}</button>
                ))}
              </div>
            </motion.div>

            {/* البيانات الشخصية */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1.25rem', fontSize: '1.1rem' }}>👤 بياناتك الشخصية</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>الاسم الكامل *</label>
                  <input {...register('applicantName')} placeholder="أدخل اسمك الكامل" style={inputStyle(!!errors.applicantName)} />
                  {errMsg(errors.applicantName?.message)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>رقم الهاتف *</label>
                    <input {...register('applicantPhone')} placeholder="07XXXXXXXX" style={inputStyle(!!errors.applicantPhone)} />
                    {errMsg(errors.applicantPhone?.message)}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>رقم الهوية (اختياري)</label>
                    <input {...register('nationalId')} placeholder="1234567890" style={inputStyle()} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>البريد الإلكتروني (اختياري)</label>
                  <input {...register('applicantEmail')} type="email" placeholder="email@example.com" style={{ ...inputStyle(), direction: 'ltr', textAlign: 'right' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>المحافظة *</label>
                    <select {...register('governorate')} style={inputStyle(!!errors.governorate)}>
                      <option value="">اختر المحافظة</option>
                      {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errMsg(errors.governorate?.message)}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>عدد أفراد الأسرة *</label>
                    <input {...register('membersCount', { valueAsNumber: true })} type="number" min={1} max={20} style={inputStyle(!!errors.membersCount)} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>العنوان التفصيلي *</label>
                  <input {...register('address')} placeholder="الحي / الشارع / رقم المنزل" style={inputStyle(!!errors.address)} />
                  {errMsg(errors.address?.message)}
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>الدخل الشهري (بالريال اليمني)</label>
                  <input {...register('monthlyIncome', { valueAsNumber: true })} type="number" min={0} placeholder="0" style={inputStyle()} />
                </div>
              </div>
            </motion.div>

            {/* وصف الحالة */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1B3A5C', marginBottom: '1rem', fontSize: '1.1rem' }}>📝 وصف الحالة</h3>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="اشرح وضعك ومتطلباتك بالتفصيل — كلما كانت المعلومات أكثر وضوحاً كلما كان بإمكاننا مساعدتك بشكل أفضل..."
                style={{ ...inputStyle(!!errors.description), resize: 'vertical' }}
              />
              {errMsg(errors.description?.message)}
            </motion.div>

            {/* زر الإرسال */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '1rem', background: isSubmitting ? '#9CA3AF' : 'linear-gradient(135deg, #1B3A5C, #1F7A4A)',
                color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.15rem',
                fontWeight: 800, fontFamily: 'Tajawal, sans-serif', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 25px rgba(27,58,92,0.3)',
              }}
            >
              {isSubmitting ? '⏳ جاري الإرسال...' : '🤲 إرسال الطلب'}
            </motion.button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
              جميع البيانات سرية ولن تُشارك خارج المؤسسة
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ApplyPage;
