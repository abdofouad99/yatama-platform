-- ==============================================
-- وحدة المهام الميدانية (Field Tasks)
-- ==============================================

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL, -- عنوان المهمة
    description TEXT, -- التفاصيل
    project_id INT, -- المشروع المرتبط (اختياري)
    assigned_to INT, -- الشخص المسندة إليه (user_id)
    assigned_by INT, -- الشخص الذي أنشأها (user_id)
    status VARCHAR(50) DEFAULT 'todo', -- الحالة: todo, in_progress, completed
    priority VARCHAR(50) DEFAULT 'medium', -- الأولوية: low, medium, high, urgent
    location TEXT, -- الموقع الميداني إن وجد
    due_date TIMESTAMP, -- تاريخ التسليم
    completed_at TIMESTAMP, -- تاريخ الإنجاز الفعلي
    notes TEXT, -- ملاحظات
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_task_assigner FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);
