-- ==============================================
-- وحدة المحاسبة والميزانيات (Financial & Budgets)
-- ==============================================

-- جدول المعاملات المالية (Financial Transactions)
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- إما 'income' (دخل) أو 'expense' (منصرف)
    category VARCHAR(100), -- تصنيف (رواتب، إغاثة، صيانة، ...الخ)
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    project_id INT NULL, -- قد يكون مقيداً بمشروع معين
    donation_id INT NULL, -- حال كان المدخول من تبرع معين
    description TEXT,
    receipt_url TEXT, -- فاتورة أو سند قبض مصور
    trans_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ft_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    CONSTRAINT fk_ft_donation FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE SET NULL,
    CONSTRAINT fk_ft_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- جدول ميزانية المشاريع المتقدمة (Budgets)
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    project_id INT UNIQUE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL, -- إجمالي الميزانية المحددة
    spent_amount DECIMAL(12, 2) DEFAULT 0, -- ما تم صرفه فعلياً
    reserved_amount DECIMAL(12, 2) DEFAULT 0, -- المحجوز لمهام قادمة
    fiscal_year INT, -- العام المالي مثل 2026
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budget_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
