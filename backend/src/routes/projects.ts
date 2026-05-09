import { Router } from "express";
import { z } from "zod";
import pool from "../db";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);



const createSchema = z.object({ title: z.string().min(1).max(200), description: z.string().max(2000).optional() });

router.get("/", async (req: AuthRequest, res) => {
  try {
    
    const result = await pool.query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [req.userId]);
    res.json(result.rows);
    
  } catch { res.status(500).json({ error: "Failed to fetch" }); }
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    
    const result = await pool.query("INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING *", [req.userId, parsed.data.title, parsed.data.description || ""]);
    res.status(201).json(result.rows[0]);
    
  } catch { res.status(500).json({ error: "Failed to create" }); }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    
    const result = await pool.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
    
  } catch { res.status(500).json({ error: "Failed to fetch" }); }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    
    const result = await pool.query(
      "UPDATE projects SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *",
      [req.body.title, req.body.description, req.body.status, req.params.id, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
    
  } catch { res.status(500).json({ error: "Failed to update" }); }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    
    await pool.query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
    
    res.json({ message: "Deleted" });
  } catch { res.status(500).json({ error: "Failed to delete" }); }
});

export default router;
