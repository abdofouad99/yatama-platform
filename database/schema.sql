-- ========================================================
-- قاعدة بيانات منصة اليتامى الخيرية
-- Yatama Charity Foundation - Database Schema
-- الإصدار: 1.0 | التاريخ: 2026-04-07
-- ========================================================

CREATE DATABASE IF NOT EXISTS yatama_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE yatama_db;

-- --------------------------------------------------------
-- 1. جدول الأدوار (Roles)
-- --------------------------------------------------------
CREATE TABLE roles (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL COMMENT 'اسم الدور بالعربية',
  slug        VARCHAR(100) NOT NULL UNIQUE COMMENT 'super_admin, finance_manager, ...',
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='أدوار المستخدمين في النظام';

-- --------------------------------------------------------
-- 2. جدول الصلاحيات (Permissions)
-- --------------------------------------------------------
CREATE TABLE permissions (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(150) NOT NULL,
  slug  VARCHAR(150) NOT NULL UNIQUE COMMENT 'view_donations, edit_orphans, ...'
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 3. ربط الأدوار بالصلاحيات (Role_Permissions)
-- --------------------------------------------------------
CREATE TABLE role_permissions (
  role_id       INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 4. جدول المستخدمين (Users)
-- --------------------------------------------------------
CREATE TABLE users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id      INT UNSIGNED NOT NULL,
  full_name    VARCHAR(200) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(20),
  password     VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  avatar_url   VARCHAR(500),
  is_active    TINYINT(1) DEFAULT 1,
  last_login   TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role_id)
) ENGINE=InnoDB COMMENT='جميع مستخدمي النظام (موظفون + متبرعون + مستفيدون)';

-- --------------------------------------------------------
-- 5. جدول الأسر (Families)
-- --------------------------------------------------------
CREATE TABLE families (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  head_name       VARCHAR(200) NOT NULL COMMENT 'اسم رب الأسرة',
  members_count   TINYINT UNSIGNED NOT NULL DEFAULT 1,
  monthly_income  DECIMAL(10,2) DEFAULT 0 COMMENT 'بالريال اليمني',
  address         VARCHAR(500),
  governorate     VARCHAR(100) COMMENT 'المحافظة',
  district        VARCHAR(100) COMMENT 'المديرية',
  phone           VARCHAR(20),
  national_id     VARCHAR(50) UNIQUE,
  status          ENUM('active','inactive','pending') DEFAULT 'pending',
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_families_status (status),
  INDEX idx_families_gov    (governorate)
) ENGINE=InnoDB COMMENT='الأسر المتعففة المسجلة في المؤسسة';

-- --------------------------------------------------------
-- 6. جدول الأيتام (Orphans)
-- --------------------------------------------------------
CREATE TABLE orphans (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id       INT UNSIGNED NULL COMMENT 'قد يكون اليتيم بلا أسرة مسجلة',
  full_name       VARCHAR(200) NOT NULL,
  date_of_birth   DATE,
  gender          ENUM('male','female') NOT NULL,
  guardian_name   VARCHAR(200),
  guardian_phone  VARCHAR(20),
  health_status   ENUM('good','moderate','needs_care') DEFAULT 'good',
  school_level    VARCHAR(100) COMMENT 'الصف الدراسي',
  school_name     VARCHAR(200),
  address         VARCHAR(500),
  governorate     VARCHAR(100),
  photo_url       VARCHAR(500),
  sponsorship_status ENUM('sponsored','unsponsored','partial') DEFAULT 'unsponsored',
  notes           TEXT,
  registered_by   INT UNSIGNED COMMENT 'المستخدم الذي سجّل البيانات',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id)    REFERENCES families(id) ON DELETE SET NULL,
  FOREIGN KEY (registered_by) REFERENCES users(id)  ON DELETE SET NULL,
  INDEX idx_orphans_family (family_id),
  INDEX idx_orphans_status (sponsorship_status)
) ENGINE=InnoDB COMMENT='بيانات الأيتام المسجلين لدى المؤسسة';

-- --------------------------------------------------------
-- 7. جدول المتبرعين (Donors)
-- --------------------------------------------------------
CREATE TABLE donors (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NULL COMMENT 'إذا كان لديه حساب في النظام',
  full_name       VARCHAR(200) NOT NULL,
  email           VARCHAR(255),
  phone           VARCHAR(20),
  country         VARCHAR(100) DEFAULT 'اليمن',
  is_anonymous    TINYINT(1) DEFAULT 0,
  total_donated   DECIMAL(14,2) DEFAULT 0 COMMENT 'مجموع كل تبرعاته',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_donors_email  (email),
  INDEX idx_donors_user   (user_id)
) ENGINE=InnoDB COMMENT='بيانات المتبرعين';

-- --------------------------------------------------------
-- 8. جدول المشاريع (Projects)
-- --------------------------------------------------------
CREATE TABLE projects (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  category        ENUM('relief','education','medical','sponsorship','infrastructure','other') NOT NULL,
  goal_amount     DECIMAL(14,2) NOT NULL DEFAULT 0,
  current_amount  DECIMAL(14,2) NOT NULL DEFAULT 0,
  status          ENUM('active','completed','paused','cancelled') DEFAULT 'active',
  start_date      DATE,
  end_date        DATE,
  cover_image_url VARCHAR(500),
  is_featured     TINYINT(1) DEFAULT 0 COMMENT 'يظهر في الصفحة الرئيسية',
  managed_by      INT UNSIGNED COMMENT 'مدير المشروع',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (managed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_projects_status   (status),
  INDEX idx_projects_category (category),
  INDEX idx_projects_featured (is_featured)
) ENGINE=InnoDB COMMENT='مشاريع المؤسسة الخيرية';

-- --------------------------------------------------------
-- 9. جدول التبرعات (Donations)
-- --------------------------------------------------------
CREATE TABLE donations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donor_id        INT UNSIGNED NOT NULL,
  project_id      INT UNSIGNED NULL COMMENT 'NULL = تبرع عام',
  amount          DECIMAL(14,2) NOT NULL,
  currency        VARCHAR(10) DEFAULT 'USD',
  type            ENUM('one_time','monthly','zakat','sadaqa','kafala') DEFAULT 'one_time',
  payment_method  ENUM('stripe','bank_transfer','cash','mobile_money') DEFAULT 'stripe',
  payment_ref     VARCHAR(255) COMMENT 'رقم مرجعي من بوابة الدفع',
  receipt_number  VARCHAR(100) UNIQUE,
  status          ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
  notes           TEXT,
  donated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id)   REFERENCES donors(id)   ON DELETE RESTRICT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_donations_donor   (donor_id),
  INDEX idx_donations_project (project_id),
  INDEX idx_donations_status  (status),
  INDEX idx_donations_date    (donated_at)
) ENGINE=InnoDB COMMENT='سجل جميع التبرعات';

-- --------------------------------------------------------
-- 10. جدول سجلات الدعم (Support_Records)
-- --------------------------------------------------------
CREATE TABLE support_records (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  orphan_id   INT UNSIGNED NULL,
  family_id   INT UNSIGNED NULL,
  project_id  INT UNSIGNED NULL,
  type        ENUM('cash','food_basket','education_fees','medical','clothing','other') NOT NULL,
  amount      DECIMAL(14,2) DEFAULT 0,
  description TEXT,
  document_url VARCHAR(500) COMMENT 'صورة الإيصال أو الوثيقة',
  provided_by INT UNSIGNED COMMENT 'المستخدم المسؤول',
  support_date DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orphan_id)  REFERENCES orphans(id)  ON DELETE SET NULL,
  FOREIGN KEY (family_id)  REFERENCES families(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (provided_by) REFERENCES users(id)   ON DELETE SET NULL,
  INDEX idx_support_orphan  (orphan_id),
  INDEX idx_support_family  (family_id),
  INDEX idx_support_date    (support_date)
) ENGINE=InnoDB COMMENT='سجل المساعدات المقدمة للأيتام والأسر';

-- --------------------------------------------------------
-- 11. جدول المعاملات المالية (Transactions)
-- --------------------------------------------------------
CREATE TABLE financial_transactions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type         ENUM('income','expense') NOT NULL,
  category     VARCHAR(100) COMMENT 'رواتب، مشتريات، إيجار، ...',
  amount       DECIMAL(14,2) NOT NULL,
  currency     VARCHAR(10) DEFAULT 'USD',
  project_id   INT UNSIGNED NULL,
  donation_id  INT UNSIGNED NULL,
  description  TEXT,
  receipt_url  VARCHAR(500),
  trans_date   DATE NOT NULL,
  created_by   INT UNSIGNED,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id)      ON DELETE SET NULL,
  FOREIGN KEY (donation_id) REFERENCES donations(id)     ON DELETE SET NULL,
  FOREIGN KEY (created_by)  REFERENCES users(id)         ON DELETE SET NULL,
  INDEX idx_trans_type    (type),
  INDEX idx_trans_project (project_id),
  INDEX idx_trans_date    (trans_date)
) ENGINE=InnoDB COMMENT='دفتر الأستاذ العام للمؤسسة';

-- --------------------------------------------------------
-- 12. جدول الميزانيات (Budgets)
-- --------------------------------------------------------
CREATE TABLE budgets (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id      INT UNSIGNED NOT NULL UNIQUE,
  total_amount    DECIMAL(14,2) NOT NULL,
  spent_amount    DECIMAL(14,2) DEFAULT 0,
  reserved_amount DECIMAL(14,2) DEFAULT 0,
  fiscal_year     YEAR,
  notes           TEXT,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='ميزانيات المشاريع';

-- --------------------------------------------------------
-- 13. جدول الموظفين (Employees)
-- --------------------------------------------------------
CREATE TABLE employees (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL UNIQUE,
  position    VARCHAR(150) COMMENT 'المسمى الوظيفي',
  department  VARCHAR(150),
  salary      DECIMAL(10,2) DEFAULT 0,
  hire_date   DATE,
  contract_type ENUM('full_time','part_time','contract') DEFAULT 'full_time',
  is_active   TINYINT(1) DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_employees_dept (department)
) ENGINE=InnoDB COMMENT='بيانات الموظفين';

-- --------------------------------------------------------
-- 14. جدول المتطوعين (Volunteers)
-- --------------------------------------------------------
CREATE TABLE volunteers (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL UNIQUE,
  skills       TEXT COMMENT 'المهارات مفصولة بفاصلة',
  availability ENUM('full_time','weekends','on_demand') DEFAULT 'on_demand',
  joined_date  DATE,
  total_hours  INT UNSIGNED DEFAULT 0,
  is_active    TINYINT(1) DEFAULT 1,
  notes        TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='بيانات المتطوعين';

-- --------------------------------------------------------
-- 15. جدول المهام الميدانية (Tasks)
-- --------------------------------------------------------
CREATE TABLE tasks (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(300) NOT NULL,
  description  TEXT,
  project_id   INT UNSIGNED NULL,
  assigned_to  INT UNSIGNED NULL COMMENT 'user_id للمتطوع أو الموظف',
  assigned_by  INT UNSIGNED,
  status       ENUM('todo','in_progress','done','cancelled') DEFAULT 'todo',
  priority     ENUM('low','medium','high','urgent') DEFAULT 'medium',
  due_date     DATE,
  completed_at TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id)    ON DELETE SET NULL,
  FOREIGN KEY (assigned_by) REFERENCES users(id)    ON DELETE SET NULL,
  INDEX idx_tasks_assigned (assigned_to),
  INDEX idx_tasks_status   (status),
  INDEX idx_tasks_project  (project_id)
) ENGINE=InnoDB COMMENT='المهام الميدانية للموظفين والمتطوعين';

-- --------------------------------------------------------
-- 16. جدول طلبات المستفيدين الإلكترونية (Online_Applications)
-- --------------------------------------------------------
CREATE TABLE online_applications (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  applicant_name   VARCHAR(200) NOT NULL,
  applicant_phone  VARCHAR(20) NOT NULL,
  applicant_email  VARCHAR(255),
  national_id      VARCHAR(50),
  governorate      VARCHAR(100),
  address          VARCHAR(500),
  application_type ENUM('orphan_sponsorship','family_support','medical','educational','emergency') NOT NULL,
  members_count    TINYINT UNSIGNED DEFAULT 1,
  monthly_income   DECIMAL(10,2) DEFAULT 0,
  description      TEXT COMMENT 'وصف الحالة بكلمات المتقدم',
  document_1_url   VARCHAR(500) COMMENT 'بطاقة الهوية',
  document_2_url   VARCHAR(500) COMMENT 'وثيقة إثبات الحالة',
  document_3_url   VARCHAR(500) COMMENT 'وثيقة إضافية',
  status           ENUM('pending','under_review','approved','rejected') DEFAULT 'pending',
  review_notes     TEXT COMMENT 'ملاحظات لجنة المراجعة',
  reviewed_by      INT UNSIGNED NULL,
  reviewed_at      TIMESTAMP NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_applications_status (status),
  INDEX idx_applications_type   (application_type),
  INDEX idx_applications_gov    (governorate)
) ENGINE=InnoDB COMMENT='الطلبات الإلكترونية للمستفيدين من الموقع';

-- ========================================================
-- البيانات الأولية (Seed Data)
-- ========================================================

-- أدوار النظام
INSERT INTO roles (name, slug, description) VALUES
('مشرف عام',       'super_admin',      'صلاحيات كاملة على جميع أجزاء النظام'),
('مدير مالي',      'finance_manager',  'إدارة التبرعات والتقارير المالية'),
('مدير مشاريع',   'project_manager',  'إدارة المشاريع والمستفيدين'),
('موظف موارد بشرية','hr_staff',        'إدارة الموظفين والمتطوعين'),
('موظف ميداني',   'field_staff',      'تنفيذ المهام الميدانية وتحديثها'),
('متطوع',          'volunteer',        'عرض المهام المخصصة والتقرير عنها'),
('متبرع',          'donor',            'عرض تاريخ التبرعات ومتابعة المشاريع'),
('مستفيد',         'beneficiary',      'متابعة حالة الطلب والمساعدات');

-- صلاحيات النظام الأساسية
INSERT INTO permissions (name, slug) VALUES
('عرض التبرعات',      'view_donations'),
('إضافة تبرع',        'create_donation'),
('عرض المستفيدين',    'view_beneficiaries'),
('إضافة مستفيد',      'create_beneficiary'),
('تعديل مستفيد',      'edit_beneficiary'),
('عرض التقارير المالية','view_reports'),
('إدارة المستخدمين',  'manage_users'),
('إدارة المشاريع',    'manage_projects'),
('مراجعة الطلبات',    'review_applications'),
('إدارة المهام',      'manage_tasks');

-- مستخدم مشرف افتراضي (يجب تغيير كلمة المرور فور التشغيل)
INSERT INTO users (role_id, full_name, email, phone, password, is_active) VALUES
(1, 'مشرف النظام', 'admin@yatama-charity.org', '+967000000000',
 '$2b$12$exampleHashChangeThis', 1);
