export const SUPA_URL      = import.meta.env.VITE_SUPA_URL      || "";
export const SUPA_ANON_KEY = import.meta.env.VITE_SUPA_ANON_KEY || "";
export const UPLOAD_WORKER_URL = import.meta.env.VITE_UPLOAD_WORKER_URL || "";
export const UPLOAD_API    = "/api/upload";
export const ADMIN_EMAILS  = ["platoni@live.com"];

export async function supaFetch(table, opts = "") {
  if (!SUPA_URL) return null;
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${opts}`, {
    headers: { apikey: SUPA_ANON_KEY, Authorization: `Bearer ${SUPA_ANON_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}
