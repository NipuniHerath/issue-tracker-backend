-- Issue Tracker Database Setup Script
--
-- To insert the admin user, you need a bcrypt hash of your chosen password.
-- See the README.md for instructions on generating a bcrypt hash using Node.js.
-- Example steps:
--   1. Open Node.js REPL: node
--   2. Enter:
--        const bcrypt = require("bcrypt");
--        const password = "your_admin_password";
--        const hashedPassword = bcrypt.hashSync(password, 10);
--        console.log(hashedPassword);
--   3. Copy the printed hash and use it below.
--

CREATE DATABASE IF NOT EXISTS issue_tracker;
USE issue_tracker;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Example: Insert an admin user 
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'admin@mail.com', '$2b$10$eD4ogUYkDakXZV507mtdF.NhqQFnb9XSvG2o.i4D/KPvw0kAsVwSW', 'ADMIN');
