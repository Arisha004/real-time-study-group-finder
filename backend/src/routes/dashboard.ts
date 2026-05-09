import { Router } from "express";
import pool from "../db";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);



router.get("/stats", async (req: AuthRequest, res) => {
  try {
    
    const total = parseInt((await pool.query("SELECT COUNT(*) FROM projects WHERE user_id = $1", [req.userId])).rows[0].count);
    const completed = parseInt((await pool.query("SELECT COUNT(*) FROM projects WHERE user_id = $1 AND status = 'completed'", [req.userId])).rows[0].count);
    const inProgress = parseInt((await pool.query("SELECT COUNT(*) FROM projects WHERE user_id = $1 AND status = 'active'", [req.userId])).rows[0].count);
    
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      stats: { total_projects: total, completed, in_progress: inProgress, completion_rate: rate },
      chart_data: [
        { week: "W1", progress: 10 }, { week: "W2", progress: 25 }, { week: "W3", progress: 40 },
        { week: "W4", progress: 55 }, { week: "W5", progress: 70 }, { week: "Now", progress: rate },
      ]
    });
  } catch { res.status(500).json({ error: "Failed to fetch stats" }); }
});

export default router;
