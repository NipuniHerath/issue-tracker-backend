
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = (req, res) => {
  const { name, email, password } = req.body; 
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, hashedPassword, "USER"], (err) => { 
    if (err) return res.status(500).json({ message: "User already exists" });
    res.status(201).json({ message: "User registered successfully" });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  });
};

export const getAllUsers = (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const userSql = "SELECT id, name, email, role FROM users";
  db.query(userSql, (err, users) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!users.length) return res.json([]);

    const issueSql = "SELECT * FROM issues";
    db.query(issueSql, (err2, issues) => {
      if (err2) return res.status(500).json({ message: "Server error" });
      const userMap = users.map(user => {
        const userIssues = issues.filter(issue => issue.created_by === user.id);
        return {
          ...user,
          issues: userIssues,
          issueCount: userIssues.length
        };
      });
      res.json(userMap);
    });
  });
};