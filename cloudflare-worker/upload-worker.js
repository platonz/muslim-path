/**
 * Muslim's Path — Cloudflare R2 Upload Worker
 *
 * Deploy this to Cloudflare Workers and bind your R2 bucket to it.
 *
 * Setup:
 *  1. Create a Cloudflare account → Workers & Pages → Create Worker
 *  2. Name it "muslims-path-upload"
 *  3. Paste this code and deploy
 *  4. Go to Settings → Bindings → Add binding:
 *       Type: R2 Bucket, Variable name: BUCKET, Bucket: your-bucket-name
 *  5. Go to Settings → Variables → Add secret:
 *       Name: ADMIN_KEY, Value: (a strong secret password you choose)
 *  6. Copy the Worker URL and paste into App.jsx:
 *       const UPLOAD_WORKER_URL = "https://muslims-path-upload.YOUR_NAME.workers.dev";
 *       const UPLOAD_WORKER_KEY = "your-chosen-secret-key";
 *
 * The worker accepts:
 *   POST /
 *   Headers:
 *     X-Admin-Key: <ADMIN_KEY>
 *     X-Filename: filename.mp3 (or .pdf)
 *     X-Folder: audio/Ligjerata  (optional, defaults to "uploads")
 *     Content-Type: audio/mpeg or application/pdf
 *   Body: raw file bytes
 *
 * Returns: { url: "https://pub-xxx.r2.dev/audio/Ligjerata/filename.mp3" }
 */

// Your R2 public bucket base URL (Settings → Public Access in R2)
const R2_PUBLIC_URL = "https://cdn.muslimspath.app";

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "X-Admin-Key, X-Filename, X-Folder, Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // GET — serve a file from R2 with CORS + inline display headers
    if (request.method === "GET") {
      const key = new URL(request.url).pathname.slice(1); // e.g. "KANDILI-I-RAMAZANIT.pdf"
      if (!key) return json({ error: "No key" }, 400);
      const obj = await env.BUCKET.get(key);
      if (!obj) return new Response("Not found", { status: 404 });
      return new Response(obj.body, {
        headers: {
          "Content-Type": obj.httpMetadata?.contentType || "application/pdf",
          "Content-Disposition": "inline",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Only allow POST beyond this point
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // Auth check
    const adminKey = request.headers.get("X-Admin-Key");
    if (!adminKey || adminKey !== env.ADMIN_KEY) {
      return json({ error: "Unauthorised" }, 401);
    }

    // Get filename and folder
    const rawFilename = request.headers.get("X-Filename") || "upload";
    const filename = rawFilename.replace(/[^a-zA-Z0-9._\-\u0080-\uFFFF]/g, "_");
    const folder = request.headers.get("X-Folder") || "uploads";
    const key = `${folder}/${filename}`;
    const contentType = request.headers.get("Content-Type") || "application/octet-stream";

    // Read body
    const body = await request.arrayBuffer();
    if (!body || body.byteLength === 0) {
      return json({ error: "Empty file" }, 400);
    }

    // Upload to R2
    try {
      await env.BUCKET.put(key, body, {
        httpMetadata: { contentType },
      });

      const url = `${R2_PUBLIC_URL}/${key}`;
      return json({ url, key, size: body.byteLength }, 200);
    } catch (err) {
      return json({ error: "Upload failed: " + err.message }, 500);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
