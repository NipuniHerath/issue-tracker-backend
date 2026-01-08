# Issue Tracker Backend

## Features

- User registration/login (JWT)
- Role-based access (admin/user)
- Create, view, edit, delete issues
- Search, filter, pagination, status stats
- MySQL backend

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then update the values in `.env`:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=issue_tracker
JWT_SECRET=your_generated_secret
```

**To generate a secure JWT_SECRET:**

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value in the `.env` file.

### 3. Database Setup

1. Open MySQL Workbench (or your SQL tool).
2. Run the following SQL script to create tables and the first admin user:

```sql
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


-- Insert the first admin user (replace <sha256-hash-here> with your generated hash)
INSERT INTO users (name, email, password, role)
VALUES (
  'Super Admin',
  'admin@mail.com',
  '<sha256-hash-here>',
  'ADMIN'
);
```

## Default Admin Login

- Email: admin@mail.com
- Password: (the password you used to generate the hash)

## Usage

## How to Run the Backend

After setup, start the server with:

```bash
npm start
```

Or directly:

```bash
node app.js
```

The server will run on the port specified in your code (default: 5000).

- Register or login as a user or admin.
- Create, view, edit, and delete issues.
- Use filters, search, and pagination.
- Admins can see all issues; users see their own.

## Environment Variables

- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT signing

## License

MIT
"# issue-tracker-backend"
