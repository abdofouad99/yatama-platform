import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 جاري إنشاء البيانات الأولية...');

  // الأدوار
  const roles = await Promise.all([
    prisma.role.upsert({ where: { slug: 'super_admin' },    update: {}, create: { name: 'مشرف عام',        slug: 'super_admin',      description: 'صلاحيات كاملة' } }),
    prisma.role.upsert({ where: { slug: 'finance_manager' },update: {}, create: { name: 'مدير مالي',      slug: 'finance_manager',  description: 'إدارة التبرعات والتقارير' } }),
    prisma.role.upsert({ where: { slug: 'project_manager' },update: {}, create: { name: 'مدير مشاريع',   slug: 'project_manager',  description: 'إدارة المشاريع والمستفيدين' } }),
    prisma.role.upsert({ where: { slug: 'hr_staff' },       update: {}, create: { name: 'موظف موارد بشرية', slug: 'hr_staff',         description: 'إدارة الموظفين والمتطوعين' } }),
    prisma.role.upsert({ where: { slug: 'field_staff' },    update: {}, create: { name: 'موظف ميداني',   slug: 'field_staff',      description: 'تنفيذ المهام الميدانية' } }),
    prisma.role.upsert({ where: { slug: 'volunteer' },      update: {}, create: { name: 'متطوع',          slug: 'volunteer',         description: 'عرض المهام المخصصة' } }),
  ]);

  const adminRole = roles[0];
  const pmRole    = roles[2];

  // المستخدم المشرف
  const hashedPassword = await bcrypt.hash('Admin@2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yatama-charity.org' },
    update: {},
    create: {
      roleId:   adminRole.id,
      fullName: 'مشرف النظام',
      email:    'admin@yatama-charity.org',
      phone:    '+967000000000',
      password: hashedPassword,
      isActive: true,
    },
  });

  // مدير مشروع
  const pm = await prisma.user.upsert({
    where: { email: 'pm@yatama-charity.org' },
    update: {},
    create: {
      roleId:   pmRole.id,
      fullName: 'أحمد علي — مدير المشاريع',
      email:    'pm@yatama-charity.org',
      phone:    '+967111111111',
      password: hashedPassword,
      isActive: true,
    },
  });

  // المشاريع
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title:         'كفالة 100 يتيم في صنعاء',
        description:   'مشروع لكفالة مئة يتيم في أحياء صنعاء القديمة، يشمل الكفالة الشهرية والدعم التعليمي والمتابعة الصحية.',
        category:      'sponsorship',
        goalAmount:    25000,
        currentAmount: 14800,
        status:        'active',
        isFeatured:    true,
        managedBy:     pm.id,
        startDate:     new Date('2026-01-01'),
        endDate:       new Date('2026-12-31'),
      },
    }),
    prisma.project.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title:         'إغاثة طارئة — ضحايا الفيضانات',
        description:   'مساعدات عاجلة للأسر المتضررة من الفيضانات في محافظة حضرموت، تشمل مواد غذائية وملابس وإيواء مؤقت.',
        category:      'relief',
        goalAmount:    15000,
        currentAmount: 9200,
        status:        'active',
        isFeatured:    true,
        managedBy:     pm.id,
        startDate:     new Date('2026-02-01'),
        endDate:       new Date('2026-06-30'),
      },
    }),
    prisma.project.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title:         'مدرسة الأمل — دعم تعليمي لـ 200 طالب',
        description:   'توفير الكتب والقرطاسية والرسوم الدراسية لـ 200 طالب من الأسر المحتاجة في المناطق الريفية.',
        category:      'education',
        goalAmount:    12000,
        currentAmount: 5600,
        status:        'active',
        isFeatured:    false,
        managedBy:     pm.id,
        startDate:     new Date('2026-03-01'),
        endDate:       new Date('2026-09-01'),
      },
    }),
    prisma.project.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title:         'رعاية طبية — كشف مجاني للأيتام',
        description:   'حملة كشف طبي مجانية تشمل الفحص الشامل وصرف الأدوية لـ 500 يتيم في عدة محافظات يمنية.',
        category:      'medical',
        goalAmount:    8000,
        currentAmount: 3400,
        status:        'active',
        isFeatured:    false,
        managedBy:     pm.id,
        startDate:     new Date('2026-04-01'),
        endDate:       new Date('2026-07-31'),
      },
    }),
    prisma.project.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title:         'سلة رمضان الخيرية — 500 أسرة',
        description:   'توزيع 500 سلة غذائية على الأسر المتعففة خلال شهر رمضان المبارك في مختلف المحافظات.',
        category:      'relief',
        goalAmount:    10000,
        currentAmount: 10000,
        status:        'completed',
        isFeatured:    false,
        managedBy:     pm.id,
        startDate:     new Date('2025-03-01'),
        endDate:       new Date('2025-04-15'),
      },
    }),
  ]);

  // إنشاء ميزانيات للمشاريع
  for (const p of projects) {
    await prisma.budget.upsert({
      where: { projectId: p.id },
      update: {},
      create: {
        projectId:   p.id,
        totalAmount: p.goalAmount,
        spentAmount: p.currentAmount * 0.8,
        fiscalYear:  2026,
      },
    });
  }

  // متبرعون نموذجيون
  const [donor1, donor2, donor3] = await Promise.all([
    prisma.donor.upsert({
      where: { id: 1 }, update: {},
      create: { fullName: 'محمد عبدالله الشامي', email: 'donor1@example.com', phone: '+966501234567', country: 'السعودية', totalDonated: 500 },
    }),
    prisma.donor.upsert({
      where: { id: 2 }, update: {},
      create: { fullName: 'فاطمة أحمد العمري',  email: 'donor2@example.com', phone: '+971501234567', country: 'الإمارات',  totalDonated: 250 },
    }),
    prisma.donor.upsert({
      where: { id: 3 }, update: {},
      create: { fullName: 'متبرع كريم',           isAnonymous: true,            country: 'الكويت',   totalDonated: 1000 },
    }),
  ]);

  // تبرعات نموذجية
  await Promise.all([
    prisma.donation.create({ data: { donorId: donor1.id, projectId: projects[0].id, amount: 200, currency: 'USD', type: 'one_time',  paymentMethod: 'stripe',       receiptNumber: 'YCF-001', status: 'completed' } }),
    prisma.donation.create({ data: { donorId: donor1.id, projectId: projects[1].id, amount: 150, currency: 'USD', type: 'one_time',  paymentMethod: 'bank_transfer', receiptNumber: 'YCF-002', status: 'completed' } }),
    prisma.donation.create({ data: { donorId: donor2.id, projectId: projects[0].id, amount: 100, currency: 'USD', type: 'monthly',   paymentMethod: 'stripe',       receiptNumber: 'YCF-003', status: 'completed' } }),
    prisma.donation.create({ data: { donorId: donor3.id, projectId: projects[2].id, amount: 500, currency: 'USD', type: 'sadaqa',    paymentMethod: 'bank_transfer', receiptNumber: 'YCF-004', status: 'completed' } }),
    prisma.donation.create({ data: { donorId: donor2.id, projectId: projects[3].id, amount: 80,  currency: 'USD', type: 'one_time',  paymentMethod: 'stripe',       receiptNumber: 'YCF-005', status: 'completed' } }),
  ]);

  // الأسر
  const family1 = await prisma.family.upsert({
    where: { id: 1 }, update: {},
    create: { headName: 'أم يحيى — أرملة',   membersCount: 6, monthlyIncome: 0,   address: 'صنعاء، الحي الغربي', governorate: 'صنعاء',    status: 'active' },
  });
  const family2 = await prisma.family.upsert({
    where: { id: 2 }, update: {},
    create: { headName: 'أم خالد — مطلقة',   membersCount: 4, monthlyIncome: 5000, address: 'عدن، كريتر',         governorate: 'عدن',      status: 'active' },
  });

  // الأيتام
  await Promise.all([
    prisma.orphan.upsert({
      where: { id: 1 }, update: {},
      create: { familyId: family1.id, fullName: 'يحيى محمد سالم',  gender: 'male',   dateOfBirth: new Date('2015-03-10'), guardianName: 'أم يحيى',  healthStatus: 'good',      schoolLevel: 'الصف الخامس', governorate: 'صنعاء', sponsorshipStatus: 'sponsored',   registeredBy: admin.id },
    }),
    prisma.orphan.upsert({
      where: { id: 2 }, update: {},
      create: { familyId: family1.id, fullName: 'مريم محمد سالم',  gender: 'female', dateOfBirth: new Date('2017-07-22'), guardianName: 'أم يحيى',  healthStatus: 'good',      schoolLevel: 'الصف الثالث', governorate: 'صنعاء', sponsorshipStatus: 'unsponsored', registeredBy: admin.id },
    }),
    prisma.orphan.upsert({
      where: { id: 3 }, update: {},
      create: { familyId: family2.id, fullName: 'خالد عبدالله علي', gender: 'male',   dateOfBirth: new Date('2013-11-05'), guardianName: 'أم خالد', healthStatus: 'moderate',  schoolLevel: 'الصف السابع', governorate: 'عدن',   sponsorshipStatus: 'partial',     registeredBy: admin.id },
    }),
  ]);

  // طلب إلكتروني نموذجي
  await prisma.onlineApplication.create({
    data: {
      applicantName:   'نور أحمد حسين',
      applicantPhone:  '+967733456789',
      applicantEmail:  'noor@example.com',
      governorate:     'تعز',
      address:         'تعز، حي سبأ',
      applicationType: 'family_support',
      membersCount:    5,
      monthlyIncome:   0,
      description:     'أسرة مكونة من 5 أفراد، المعيل توفي منذ سنتين، الأطفال بحاجة لكفالة ودعم تعليمي.',
      status:          'pending',
    },
  });

  console.log('✅ تم إنشاء البيانات الأولية بنجاح!');
  console.log('');
  console.log('📌 بيانات تسجيل الدخول:');
  console.log('   البريد: admin@yatama-charity.org');
  console.log('   كلمة المرور: Admin@2026');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
