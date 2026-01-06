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

-- Insert the first admin user (replace <bcrypt-hash-here> with your generated hash)
INSERT INTO users (name, email, password, role)
VALUES (
  'Super Admin',
  'admin@mail.com',
  '<bcrypt-hash-here>',
  'ADMIN'
);
```

### How to generate a bcrypt hash for the admin password

#### Example Node.js REPL Session

```
> const bcrypt = require("bcrypt");
undefined
> const password = "2424";
undefined
> const hashedPassword = bcrypt.hashSync(password, 10);
undefined
> console.log(hashedPassword);
$2b$10$eD4ogUYkDakXZV507mtdF.NhqQFnb9XSvG2o.i4D/KPvw0kAsVwSW
undefined
```

Copy the hash (e.g., `$2b$10$eD4ogUYkDakXZV507mtdF.NhqQFnb9XSvG2o.i4D/KPvw0kAsVwSW`) and use it in your SQL insert statement.

1. Open a Node.js REPL or create a quick script:

**Option 1: Node.js REPL**

In your terminal, run:

```
node
```

Then enter:

**For CommonJS projects:**

```
const bcrypt = require("bcrypt");
const password = "your_admin_password";
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
```

**For ESM projects (Node.js REPL):**

```
const { default: bcrypt } = await import("bcrypt");
const password = "your_admin_password";
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
```

If you get a syntax error with `import`, use the dynamic import example above.

**Option 2: Quick Script**

Create a file named `hash.js` with one of the above code blocks (choose import or require based on your Node.js setup), then run:

```
node hash.js
```

2. Copy the printed hash.

3. Insert the admin into your MySQL database:

You can use your generated hash, or copy and use this example directly:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'admin@mail.com', '$2b$10$eD4ogUYkDakXZV507mtdF.NhqQFnb9XSvG2o.i4D/KPvw0kAsVwSW', 'ADMIN');
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
