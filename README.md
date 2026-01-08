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

### 2. Create a `.env` file (see `.env.example`):

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=issue_tracker
JWT_SECRET=your_jwt_secret
```

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

### How to generate a SHA-256 hash for the admin password

#### Example Node.js REPL Session

```
> const crypto = require("crypto");
undefined
> const password = "2424";
undefined
> const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
undefined
> console.log(hashedPassword);
e3a2b8e2e7e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8
undefined
```

Copy the hash (e.g., `e3a2b8e2e7e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8`) and use it in your SQL insert statement.

1. Open a Node.js REPL or create a quick script:

**Option 1: Node.js REPL**

In your terminal, run:

```
node
```

Then enter:

```
const crypto = require("crypto");
const password = "your_admin_password";
const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
console.log(hashedPassword);
```

**Option 2: Quick Script**

Create a file named `hash.js` with the above code, then run:

```
node hash.js
```

2. Copy the printed hash.

3. Insert the admin into your MySQL database:

You can use your generated hash, or copy and use this example directly:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'admin@mail.com', 'e3a2b8e2e7e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8e2e8', 'ADMIN');
```

Replace the hash with your own if you want a different password.

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
