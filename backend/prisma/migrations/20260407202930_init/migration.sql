-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "families" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "head_name" TEXT NOT NULL,
    "members_count" INTEGER NOT NULL DEFAULT 1,
    "monthly_income" REAL NOT NULL DEFAULT 0,
    "address" TEXT,
    "governorate" TEXT,
    "district" TEXT,
    "phone" TEXT,
    "national_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "orphans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "family_id" INTEGER,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATETIME,
    "gender" TEXT NOT NULL,
    "guardian_name" TEXT,
    "guardian_phone" TEXT,
    "health_status" TEXT NOT NULL DEFAULT 'good',
    "school_level" TEXT,
    "school_name" TEXT,
    "address" TEXT,
    "governorate" TEXT,
    "photo_url" TEXT,
    "sponsorship_status" TEXT NOT NULL DEFAULT 'unsponsored',
    "notes" TEXT,
    "registered_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orphans_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orphans_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "donors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT DEFAULT 'اليمن',
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "total_donated" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "goal_amount" REAL NOT NULL DEFAULT 0,
    "current_amount" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "start_date" DATETIME,
    "end_date" DATETIME,
    "cover_image_url" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "managed_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "projects_managed_by_fkey" FOREIGN KEY ("managed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "donations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donor_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "type" TEXT NOT NULL DEFAULT 'one_time',
    "payment_method" TEXT NOT NULL DEFAULT 'stripe',
    "payment_ref" TEXT,
    "receipt_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "donated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "donations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "support_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orphan_id" INTEGER,
    "family_id" INTEGER,
    "project_id" INTEGER,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "description" TEXT,
    "document_url" TEXT,
    "provided_by" INTEGER,
    "support_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "support_records_orphan_id_fkey" FOREIGN KEY ("orphan_id") REFERENCES "orphans" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_records_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_records_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_records_provided_by_fkey" FOREIGN KEY ("provided_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "project_id" INTEGER,
    "donation_id" INTEGER,
    "description" TEXT,
    "receipt_url" TEXT,
    "trans_date" DATETIME NOT NULL,
    "created_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "financial_transactions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "financial_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "total_amount" REAL NOT NULL,
    "spent_amount" REAL NOT NULL DEFAULT 0,
    "reserved_amount" REAL NOT NULL DEFAULT 0,
    "fiscal_year" INTEGER,
    "notes" TEXT,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "budgets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "position" TEXT,
    "department" TEXT,
    "salary" REAL NOT NULL DEFAULT 0,
    "hire_date" DATETIME,
    "contract_type" TEXT NOT NULL DEFAULT 'full_time',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "skills" TEXT,
    "availability" TEXT NOT NULL DEFAULT 'on_demand',
    "joined_date" DATETIME,
    "total_hours" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    CONSTRAINT "volunteers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "project_id" INTEGER,
    "assigned_to" INTEGER,
    "assigned_by" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "due_date" DATETIME,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "online_applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicant_name" TEXT NOT NULL,
    "applicant_phone" TEXT NOT NULL,
    "applicant_email" TEXT,
    "national_id" TEXT,
    "governorate" TEXT,
    "address" TEXT,
    "application_type" TEXT NOT NULL,
    "members_count" INTEGER NOT NULL DEFAULT 1,
    "monthly_income" REAL NOT NULL DEFAULT 0,
    "description" TEXT,
    "document_1_url" TEXT,
    "document_2_url" TEXT,
    "document_3_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "review_notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "online_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "families_national_id_key" ON "families"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "donors_user_id_key" ON "donors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "donations_receipt_number_key" ON "donations"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_project_id_key" ON "budgets"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_user_id_key" ON "volunteers"("user_id");
