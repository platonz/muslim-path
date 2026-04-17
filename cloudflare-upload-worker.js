// ─── Muslim's Path — R2 Upload Worker ─────────────────────────────────────────
// Deploy this as a Cloudflare Worker and bind your R2 bucket to it.
//
// Setup steps (takes ~5 min):
//   1. Go to cloudflare.com → Workers & Pages → Create → Create Worker
//   2. Name it "muslims-path-upload" → Deploy (empty is fine)
//   3. Open the worker → Settings → Bindings → Add R2 bucket binding:
//        Variable name: R2_BUCKET
//        R2 bucket:     muslims-path-library   (your existing bucket)
//   4. Settings → Variables → Add secret:
//        Name:  ADMIN_KEY
//        Value: pick any secret password, e.g. "mySecret123"  (you'll add this to App.jsx too)
//   5. Go to Edit Code, paste this entire file → Deploy
//   6. Copy your worker URL (e.g. https://muslims-path-upload.YOUR-NAME.workers.dev)

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key, X-Filename",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // ── Auth check ──────────────────────────────────────────────
    const key = request.headers.get("X-Admin-Key");
    if (!key || key !== env.ADMIN_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ── Upload to R2 ────────────────────────────────────────────
    const raw = request.headers.get("X-Filename") || "upload";
    const filename = raw.replace(/[^\w.\-]/g, "_");
    // X-Folder header lets caller choose: "books" or "audio/Ligjerata"
    const folder = request.headers.get("X-Folder") || "books";
    const path = `${folder}/${filename}`;
    const contentType = request.headers.get("Content-Type") || "application/octet-stream";

    try {
      const body = await request.arrayBuffer();
      await env.R2_BUCKET.put(path, body, {
        httpMetadata: { contentType },
      });

      const publicUrl = `https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/${path}`;

      return new Response(JSON.stringify({ url: publicUrl }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
