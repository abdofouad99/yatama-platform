# إرشادات تفعيل PostgreSQL بدلاً من SQLite

في بيئة الإنتاج الفعلية، SQLite لا تتحمل ضغط العمليات التزامنية العالية للمنصة. يجب الانتقال إلى PostgreSQL.

## 1. إعداد الـ Environment:
تعديل ملف `.env` في الباك اند:
```env
# احذف هذا السطر:
# DATABASE_URL="file:./dev.db"

# وأضف بدلاً منه رابط قاعدة بيانات PostgreSQL (مثال من استضافة أو محلي):
DATABASE_URL="postgresql://postgres:root2026@localhost:5432/yatama_db?schema=public"
```

## 2. تحديث Prisma Schema
افتح ملف `backend/prisma/schema.prisma` وغيّر الـ `provider` كما يلي:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 3. تطبيق التهيئة (Migration)
في الـ Terminal، قم بحذف مجلد `prisma/migrations` القديم، ثم نفّذ الأمر التالي لإنشاء الـ Schema في PostgreSQL:

```bash
npx prisma migrate dev --name init_postgres
npx prisma generate
npx prisma db seed
```
بهذه الخطوات، يصبح النظام يعمل على PostgreSQL.
