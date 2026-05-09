import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import pool from "../db";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  full_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});



router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });

  const { full_name, email, password } = parsed.data;
  try {
    
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
      [email, password_hash, full_name]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.status(201).json({ user, token });
    
  } catch (err) { console.error(err); res.status(500).json({ error: "Registration failed" }); }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const result = await pool.query("SELECT id, email, full_name, password_hash FROM users WHERE email = $1", [email]);
    if (!result.rows.length) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];
    if (!(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name }, token });
    
  } catch (err) { console.error(err); res.status(500).json({ error: "Login failed" }); }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    
    const result = await pool.query("SELECT id, email, full_name FROM users WHERE id = $1", [req.userId]);
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });
    res.json({ user: result.rows[0] });
    
  } catch { res.status(500).json({ error: "Failed to fetch user" }); }
});

export default router;
