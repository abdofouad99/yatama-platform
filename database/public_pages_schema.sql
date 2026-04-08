-- ==============================================
-- وحدة الموقع العام (Public Pages Data)
-- ==============================================

CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    image_url TEXT,
    beneficiary_type VARCHAR(50),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    author_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    logo_url TEXT,
    website_url TEXT,
    type VARCHAR(50) -- donor, execution_partner, govt
);
