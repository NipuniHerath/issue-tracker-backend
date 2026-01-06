import db from "../config/db.js";

export const getIssueStatusCount = (req, res) => {
  const sql = `SELECT status, COUNT(*) AS count FROM issues GROUP BY status`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
};

export const getFilteredIssues = (req, res) => {
  const { title, priority, status } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let baseSql =
    "FROM issues INNER JOIN users ON issues.created_by = users.id WHERE 1=1";
  let params = [];
  if (req.user.role !== "ADMIN") {
    baseSql += " AND created_by = ?";
    params.push(req.user.id);
  }
  if (title) {
    baseSql += " AND issues.title LIKE ?";
    params.push(`%${title}%`);
  }
  if (priority) {
    baseSql += " AND issues.priority = ?";
    params.push(priority);
  }
  if (status) {
    baseSql += " AND issues.status = ?";
    params.push(status);
  }

  const countSql = `SELECT COUNT(*) as total ${baseSql}`;
  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ message: "Count failed" });
    const total = countResult[0].total;

    const statsSql = `SELECT status, COUNT(*) as count ${baseSql} GROUP BY status`;
    db.query(statsSql, params, (errStats, statsResults) => {
      if (errStats) return res.status(500).json({ message: "Stats failed" });

      const stats = {};
      for (const row of statsResults) {
        stats[row.status] = row.count;
      }

      const dataSql = `SELECT issues.*, users.name as creator_name, users.email as creator_email ${baseSql} ORDER BY issues.created_at DESC LIMIT ? OFFSET ?`;
      db.query(dataSql, [...params, limit, offset], (err2, results) => {
        if (err2) return res.status(500).json({ message: "Fetch failed" });
        res.json({ total, page, limit, stats, issues: results });
      });
    });
  });
};

export const createIssue = (req, res) => {
  const { title, description, priority } = req.body;
  const sql =
    "INSERT INTO issues (title, description, priority, created_by) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, description, priority, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: "Create failed" });
    res.status(201).json({ message: "Issue created" });
  });
};

export const getAllIssues = (req, res) => {
  let sql,
    params = [];
  if (req.user.role === "ADMIN") {
    sql = "SELECT * FROM issues ORDER BY created_at DESC";
  } else {
    sql = "SELECT * FROM issues WHERE created_by = ? ORDER BY created_at DESC";
    params = [req.user.id];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Fetch failed" });
    res.json(results);
  });
};

export const updateIssue = (req, res) => {
  const { title, description, status, priority } = req.body;
  const sql = `
    UPDATE issues 
    SET title=?, description=?, status=?, priority=? 
    WHERE id=? AND (created_by=? OR ?='ADMIN')
  `;
  db.query(
    sql,
    [
      title,
      description,
      status,
      priority,
      req.params.id,
      req.user.id,
      req.user.role,
    ],
    (err, result) => {
      if (err || result.affectedRows === 0)
        return res.status(403).json({ message: "Not allowed" });

      const selectSql = "SELECT * FROM issues WHERE id = ?";
      db.query(selectSql, [req.params.id], (err2, rows) => {
        if (err2) return res.status(500).json({ message: "Server error" });
        res.json(rows[0]);
      });
    }
  );
};

export const deleteIssue = (req, res) => {
  const sql = `
    DELETE FROM issues
    WHERE id=? AND (created_by=? OR ?='ADMIN')
  `;
  db.query(sql, [req.params.id, req.user.id, req.user.role], (err, result) => {
    if (err || result.affectedRows === 0)
      return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Issue deleted" });
  });
};

export const updateIssueStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatus = ["Open", "In Progress", "Resolved", "Closed"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  const sql = `
    UPDATE issues SET status = ?
    WHERE id = ? AND (created_by=? OR ?='ADMIN')
  `;
  db.query(sql, [status, id, req.user.id, req.user.role], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "Not allowed" });
    res.json({ message: `Issue status updated to ${status}` });
  });
};
