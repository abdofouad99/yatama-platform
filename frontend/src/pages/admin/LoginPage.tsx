import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../services/auth.service';
import '../../index.css';

// ==========================================
// مخطط التحقق من المدخلات
// ==========================================
const loginSchema = z.object({
  email:    z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
});
type LoginFormData = z.infer<typeof loginSchema>;

// ==========================================
// صفحة تسجيل الدخول
// ==========================================
const LoginPage: React.FC = () => {
  const navigate    = useNavigate();
  const { setUser } = useAuthStore();
  const [showPass, setShowPass] = React.useState(false);
  const [loading,  setLoading]  = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      setUser(response.data.user, response.data.token);
      toast.success(`مرحباً ${response.data.user.fullName} 👋`);
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:    '100vh',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      background:   'linear-gradient(135deg, #1B3A5C 0%, #122843 50%, #0d1e2e 100%)',
      padding:      '2rem',
      direction:    'rtl',
    }}>
      {/* بطاقة تسجيل الدخول */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width:         '100%',
          maxWidth:      '440px',
          background:    'rgba(255,255,255,0.97)',
          borderRadius:  '20px',
          boxShadow:     '0 25px 80px rgba(0,0,0,0.4)',
          padding:       '2.5rem',
          fontFamily:    'Tajawal, sans-serif',
        }}
      >
        {/* شعار المؤسسة */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width:         '70px',
            height:        '70px',
            background:    'linear-gradient(135deg, #1B3A5C, #1F7A4A)',
            borderRadius:  '50%',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            margin:        '0 auto 1rem',
            boxShadow:     '0 8px 25px rgba(27,58,92,0.3)',
          }}>
            <Shield size={32} color="#FF8C00" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1B3A5C', marginBottom: '0.25rem' }}>
            مؤسسة اليتامى الخيرية
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>
            النظام الإداري الداخلي (ERP)
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* حقل البريد الإلكتروني */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}
              />
              <input
                type="email"
                {...register('email')}
                placeholder="admin@yatama-charity.org"
                style={{
                  width:         '100%',
                  padding:       '0.75rem 2.75rem 0.75rem 1rem',
                  border:        `2px solid ${errors.email ? '#E74C3C' : '#E0E0E0'}`,
                  borderRadius:  '10px',
                  fontSize:      '1rem',
                  fontFamily:    'Tajawal, sans-serif',
                  direction:     'ltr',
                  textAlign:     'right',
                  outline:       'none',
                  transition:    'border-color 0.3s',
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}
              />
              <input
                type={showPass ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                style={{
                  width:        '100%',
                  padding:      '0.75rem 2.75rem 0.75rem 2.75rem',
                  border:       `2px solid ${errors.password ? '#E74C3C' : '#E0E0E0'}`,
                  borderRadius: '10px',
                  fontSize:     '1rem',
                  fontFamily:   'Tajawal, sans-serif',
                  outline:      'none',
                  transition:   'border-color 0.3s',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* زر تسجيل الدخول */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            style={{
              width:         '100%',
              padding:       '0.875rem',
              background:    loading ? '#9CA3AF' : 'linear-gradient(135deg, #1B3A5C, #2d5986)',
              color:         '#fff',
              border:        'none',
              borderRadius:  '10px',
              fontSize:      '1.1rem',
              fontWeight:    700,
              fontFamily:    'Tajawal, sans-serif',
              cursor:        loading ? 'not-allowed' : 'pointer',
              transition:    'all 0.3s',
              boxShadow:     loading ? 'none' : '0 4px 15px rgba(27,58,92,0.3)',
            }}
          >
            {loading ? '⏳ جاري التحقق...' : '🔐 تسجيل الدخول'}
          </motion.button>
        </form>

        {/* تذييل الصفحة */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9CA3AF' }}>
          هذا النظام حصري لموظفي ومشرفي المؤسسة فقط
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          <Link to="/" style={{ color: '#1F7A4A', fontWeight: 600 }}>
            العودة للموقع الرسمي ←
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
