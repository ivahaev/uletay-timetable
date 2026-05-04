import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const DATA_FILE = process.env.SCHEDULE_FILE || path.join(__dirname, "data", "schedule.json");
const DEFAULT_FILE = path.join(__dirname, "default-schedule.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Admin-Token");
}

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return next();
  const auth = req.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const headerToken = req.get("x-admin-token") || "";
  if (bearer === ADMIN_TOKEN || headerToken === ADMIN_TOKEN) return next();
  res.status(401).json({ error: "Admin token required" });
}

function validateSchedule(data) {
  if (!data || typeof data !== "object") throw new Error("Schedule must be an object");
  if (!data.meta || typeof data.meta !== "object") throw new Error("Missing meta object");
  if (!Array.isArray(data.stages)) throw new Error("Missing stages array");
  if (!Array.isArray(data.days)) throw new Error("Missing days array");
  if (!Array.isArray(data.events)) throw new Error("Missing events array");

  const stageIds = new Set(data.stages.map((stage) => stage.id));
  const dayIds = new Set(data.days.map((day) => day.id));
  const eventIds = new Set();

  data.events.forEach((event, index) => {
    if (!event.id || typeof event.id !== "string") throw new Error(`Event #${index + 1}: missing id`);
    if (eventIds.has(event.id)) throw new Error(`Event #${index + 1}: duplicate id "${event.id}"`);
    eventIds.add(event.id);
    if (!dayIds.has(event.day)) throw new Error(`Event #${index + 1}: unknown day "${event.day}"`);
    if (!stageIds.has(event.stage)) throw new Error(`Event #${index + 1}: unknown stage "${event.stage}"`);
    if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(event.time)) {
      throw new Error(`Event #${index + 1}: invalid time "${event.time}"`);
    }
    if (!event.title || typeof event.title !== "string") throw new Error(`Event #${index + 1}: missing title`);
  });
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.copyFile(DEFAULT_FILE, DATA_FILE);
  }
}

async function readSchedule() {
  await ensureDataFile();
  return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
}

async function writeSchedule(schedule) {
  validateSchedule(schedule);
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(schedule, null, 2)}\n`, "utf8");
  await fs.rename(tmp, DATA_FILE);
}

app.options("*", (_req, res) => {
  setCorsHeaders(res);
  res.sendStatus(204);
});

app.get("/health", (_req, res) => {
  setCorsHeaders(res);
  res.json({ ok: true });
});

app.get("/schedule.json", async (_req, res) => {
  try {
    setCorsHeaders(res);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(`${JSON.stringify(await readSchedule(), null, 2)}\n`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/schedule", requireAdmin, async (_req, res) => {
  try {
    setCorsHeaders(res);
    res.json(await readSchedule());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/schedule", requireAdmin, async (req, res) => {
  try {
    setCorsHeaders(res);
    await writeSchedule(req.body);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Yletai schedule admin listening on :${PORT}`);
});
