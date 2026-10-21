import crypto from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const directory = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(directory, "data", "db.json");
const app = express();
const sessions = new Map();
const PORT = Number(process.env.PORT || 4000);
const DEMO_EMAIL = process.env.DEMO_EMAIL || "student@campus.edu";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "Campus@123";
const DEMO_USER = { name: "Bhoomika Khilnani", email: DEMO_EMAIL, role: "Student" };

app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));

async function readDatabase() {
  return JSON.parse(await readFile(databasePath, "utf8"));
}

async function saveDatabase(database) {
  const temporaryPath = `${databasePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
  await rename(temporaryPath, databasePath);
}

function requireSession(request, response, next) {
  const authorization = request.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const user = sessions.get(token);
  if (!user) return response.status(401).json({ error: "Your demo session has ended. Please sign in again." });
  request.user = user;
  request.token = token;
  return next();
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createId(prefix) {
  return `${prefix}-${crypto.randomInt(10000, 99999)}`;
}

function sortedNewest(records, dateField) {
  return [...records].sort((left, right) => new Date(right[dateField]) - new Date(left[dateField]));
}

app.get("/api/health", (_request, response) => response.json({ status: "ok", service: "Smart Campus API" }));

app.post("/api/login", (request, response) => {
  const email = cleanText(request.body?.email).toLowerCase();
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (email !== DEMO_EMAIL.toLowerCase() || password !== DEMO_PASSWORD) {
    return response.status(401).json({ error: "That email and password do not match the demo account. Try Fill demo." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, DEMO_USER);
  return response.json({ token, user: DEMO_USER });
});

app.use("/api", requireSession);

app.get("/api/me", (request, response) => response.json({ user: request.user }));

app.post("/api/logout", (request, response) => {
  sessions.delete(request.token);
  return response.json({ success: true });
});

app.get("/api/tickets", async (_request, response, next) => {
  try {
    const database = await readDatabase();
    return response.json({ tickets: sortedNewest(database.tickets, "createdAt") });
  } catch (error) { return next(error); }
});

app.post("/api/tickets", async (request, response, next) => {
  const issue = cleanText(request.body?.issue);
  const building = cleanText(request.body?.building);
  const floor = cleanText(request.body?.floor);
  const room = cleanText(request.body?.room);
  const details = cleanText(request.body?.details);
  if (!issue || !building || !floor || !room) return response.status(400).json({ error: "Issue, building, floor, and room are required." });
  if (issue.length > 100 || room.length > 60 || details.length > 240) return response.status(400).json({ error: "One or more fields exceed the maximum length." });
  try {
    const database = await readDatabase();
    const ticket = { id: createId("CLN"), building, floor, room, issue, details, status: "Open", createdAt: new Date().toISOString() };
    database.tickets.unshift(ticket);
    await saveDatabase(database);
    return response.status(201).json({ ticket });
  } catch (error) { return next(error); }
});

app.patch("/api/tickets/:id/complete", async (request, response, next) => {
  try {
    const database = await readDatabase();
    const ticket = database.tickets.find(record => record.id === request.params.id);
    if (!ticket) return response.status(404).json({ error: "Cleaning request was not found." });
    ticket.status = "Completed";
    ticket.completedAt = new Date().toISOString();
    await saveDatabase(database);
    return response.json({ ticket });
  } catch (error) { return next(error); }
});

app.get("/api/items", async (_request, response, next) => {
  try {
    const database = await readDatabase();
    return response.json({ items: sortedNewest(database.items, "date") });
  } catch (error) { return next(error); }
});

app.post("/api/items", async (request, response, next) => {
  const title = cleanText(request.body?.title);
  const location = cleanText(request.body?.location);
  const category = cleanText(request.body?.category) || "Other";
  const image = typeof request.body?.image === "string" ? request.body.image : "";
  if (!title || !location) return response.status(400).json({ error: "Item title and found location are required." });
  if (title.length > 70 || location.length > 90) return response.status(400).json({ error: "Title or location exceeds the maximum length." });
  if (image && (!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 2_850_000)) {
    return response.status(400).json({ error: "Choose a valid JPEG or PNG image under 2 MB." });
  }
  try {
    const database = await readDatabase();
    const item = { id: createId("LF"), title, location, category, finder: request.user.name, date: new Date().toISOString(), image, status: "Available", messages: [] };
    database.items.unshift(item);
    await saveDatabase(database);
    return response.status(201).json({ item });
  } catch (error) { return next(error); }
});

app.post("/api/items/:id/messages", async (request, response, next) => {
  const message = cleanText(request.body?.message);
  if (!message) return response.status(400).json({ error: "Write a message before sending." });
  if (message.length > 240) return response.status(400).json({ error: "Message must be 240 characters or fewer." });
  try {
    const database = await readDatabase();
    const item = database.items.find(record => record.id === request.params.id);
    if (!item) return response.status(404).json({ error: "Found item was not found." });
    item.messages = [...(item.messages || []), message];
    item.status = "Claimed";
    await saveDatabase(database);
    return response.json({ item });
  } catch (error) { return next(error); }
});

app.use("/api", (_request, response) => response.status(404).json({ error: "API route not found." }));

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error instanceof SyntaxError && "body" in error) return response.status(400).json({ error: "Request body must be valid JSON." });
  return response.status(500).json({ error: "The campus service could not complete that request." });
});

app.listen(PORT, () => console.log(`Smart Campus API listening on http://localhost:${PORT}`));
