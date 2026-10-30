CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('page','post') NOT NULL DEFAULT 'post',
  slug VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(30) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY type_slug (type, slug)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE post_translations (
  post_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  body MEDIUMTEXT NOT NULL,
  points JSON NOT NULL,
  PRIMARY KEY (post_id, lang),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE category_translations (
  category_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id, lang),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE tag_translations (
  tag_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (tag_id, lang),
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- the two categories you asked for
INSERT INTO categories (slug) VALUES ('services'), ('ourteam');
INSERT INTO category_translations (category_id, lang, name)
SELECT id, 'fa', 'خدمات' FROM categories WHERE slug='services'
UNION ALL SELECT id, 'en', 'Services' FROM categories WHERE slug='services'
UNION ALL SELECT id, 'ar', 'خدمات' FROM categories WHERE slug='services'
UNION ALL SELECT id, 'fa', 'تیم ما' FROM categories WHERE slug='ourteam'
UNION ALL SELECT id, 'en', 'Our Team' FROM categories WHERE slug='ourteam'
UNION ALL SELECT id, 'ar', 'فريقنا' FROM categories WHERE slug='ourteam';

-- copy any services you already created in the old tables
INSERT INTO posts (type, slug, image, sort_order, status)
SELECT 'post', slug, image, sort_order, IF(published=1,'published','draft') FROM services;

INSERT INTO post_translations (post_id, lang, title, summary, body, points)
SELECT p.id, t.lang, t.title, t.summary, t.body, t.points
FROM service_translations t
JOIN services s ON s.id = t.service_id
JOIN posts p ON p.slug = s.slug AND p.type = 'post';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p
JOIN services s ON s.slug = p.slug
JOIN categories c ON c.slug = 'services'
WHERE p.type = 'post';