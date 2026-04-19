/**
 * Vercel serverless function — proxies file uploads to Cloudflare Worker.
 * Validates the user's Supabase session server-side before forwarding.
 * The UPLOAD_KEY secret never reaches the browser.
 */

export const config = {
  api: {
    bodyParser: false,          // stream raw bytes through
    sizeLimit: "50mb",
  },
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Filename, X-Folder");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Validate Supabase session ──────────────────────────────────
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  const supaUrl  = process.env.SUPA_URL;
  const supaKey  = process.env.SUPA_ANON_KEY;

  const userRes = await fetch(`${supaUrl}/auth/v1/user`, {
    headers: { apikey: supaKey, Authorization: auth },
  });
  if (!userRes.ok) return res.status(401).json({ error: "Invalid session" });
  const user = await userRes.json();

  // ── 2. Check admin email ──────────────────────────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
  if (!adminEmails.includes(user.email)) {
    return res.status(403).json({ error: "Admin only" });
  }

  // ── 3. Stream body to Cloudflare Worker ──────────────────────────
  const workerUrl = process.env.UPLOAD_WORKER_URL;
  const workerKey = process.env.UPLOAD_KEY;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const workerRes = await fetch(workerUrl, {
    method: "POST",
    headers: {
      "X-Admin-Key":  workerKey,
      "X-Filename":   req.headers["x-filename"] || "upload",
      "X-Folder":     req.headers["x-folder"]   || "uploads",
      "Content-Type": req.headers["content-type"] || "application/octet-stream",
    },
    body,
  });

  const data = await workerRes.json();
  return res.status(workerRes.status).json(data);
}
