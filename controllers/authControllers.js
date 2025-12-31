const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.registerUser = (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkEmail = "SELECT * FROM users WHERE email = ?";

  db.query(checkEmail, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password, role, company) VALUES (?, ?, ?, ?, ?)";

    db.query(
      sql,
      [name, email, hashedPassword, role, company || null],
      (err, result) => {
        if (err)
          return res.status(500).json({ message: "Database error", err });

        return res.status(200).json({ message: "Registration successful" });
      }
    );
  });
};
