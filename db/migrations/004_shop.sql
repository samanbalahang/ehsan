CREATE TABLE product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE product_category_translations (
  category_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id, lang),
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image VARCHAR(255) NOT NULL DEFAULT '',
  price BIGINT UNSIGNED NULL,               -- NULL = "Call us"
  category_id INT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE product_translations (
  product_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  body MEDIUMTEXT NOT NULL,
  PRIMARY KEY (product_id, lang),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE settings (
  name VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;