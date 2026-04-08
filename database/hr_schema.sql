-- ==============================================
-- وحدة الموارد البشرية والمتطوعين (HR & Volunteers)
-- ==============================================

-- جدول الموظفين (Employees)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL, -- مفتاح أجنبي يربط الموظف بحسابه في النظام
    position VARCHAR(100), -- المسمى الوظيفي
    department VARCHAR(100), -- القسم
    salary DECIMAL(10, 2) DEFAULT 0.00, -- الراتب الشهري
    hire_date TIMESTAMP, -- تاريخ التعيين
    contract_type VARCHAR(50) DEFAULT 'full_time', -- نوع العقد: دوام كامل، جزئي، تعاقد
    is_active BOOLEAN DEFAULT TRUE, -- حالة המوظف
    CONSTRAINT fk_user_employee FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول المتطوعين (Volunteers)
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL, -- مفتاح أجنبي
    skills TEXT, -- مهارات المتطوع (طب، تدريس، برمجة، الخ)
    availability VARCHAR(50) DEFAULT 'on_demand', -- مدى التفرغ المتاح
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- تاريخ الانضمام
    total_hours INT DEFAULT 0, -- إجمالي ساعات التطوع المنجزة
    is_active BOOLEAN DEFAULT TRUE, -- حالة النشاط
    notes TEXT, -- ملاحظات
    CONSTRAINT fk_user_volunteer FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول ربط المتطوعين بالمهام (Volunteer Tasks Link) 
-- (في Prisma نعتمد على جدول Tasks وربط AssignedTo، ولكن هذا هو الجدول المستقل المطلوب)
CREATE TABLE volunteer_tasks_link (
    volunteer_id INT NOT NULL,
    task_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    PRIMARY KEY (volunteer_id, task_id),
    CONSTRAINT fk_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
