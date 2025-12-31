import express from "express";
import redbriqApi from "../api/redbriq.js";


const router = express.Router();


// Health check
router.get("/ping", (req, res) => res.json({ ok: true }));


// Trigger a backend login (useful for debugging/admin)
router.post("/login", async (req, res) => {
const user = process.env.REDBRIQ_USER;
const pass = process.env.REDBRIQ_PASS;
const r = await redbriqApi.redbriqLogin(user, pass);


if (r.ok) return res.json({ ok: true, status: r.status });
return res.status(500).json({ ok: false, details: r });
});


// Get projects (proxied). Returns the JSON from Redbriq.
router.get("/projects", async (req, res) => {
try {
const devId = process.env.REDBRIQ_DEV_ID;
const r = await redbriqApi.getProjects(devId);


// r may be an axios response object
if (r?.status >= 200 && r.status < 300) return res.json(r.data);


// propagate status
return res.status(r?.status || 500).json({ ok: false, status: r?.status, data: r?.data });
} catch (err) {
console.error(err);
res.status(500).json({ ok: false, error: err.message });
}
});


export default router;
