import app from './app';
import { testDBConnection } from './config/database';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  // اختبار اتصال قاعدة البيانات أولاً
  await testDBConnection();

  app.listen(PORT, () => {
    console.log('================================================');
    console.log('   🌙 مؤسسة اليتامى الخيرية - Yatama API');
    console.log(`   🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`   🌍 البيئة: ${process.env.NODE_ENV || 'development'}`);
    console.log('================================================');
  });
}

startServer().catch((err) => {
  console.error('فشل تشغيل الخادم:', err);
  process.exit(1);
});
