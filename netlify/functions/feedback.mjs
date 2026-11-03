import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("feedback");
  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return Response.json({ error: "Format data tidak valid." }, { status: 400 }); }
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ error: "Rating harus 1 sampai 5." }, { status: 400 });
    await store.setJSON(`${Date.now()}-${crypto.randomUUID()}`, { rating, comment: String(body.comment || "").slice(0, 500) });
  }
  const { blobs } = await store.list();
  const rows = await Promise.all(blobs.map(b => store.get(b.key, { type: "json" })));
  const valid = rows.filter(Boolean);
  const sum = valid.reduce((a, r) => a + r.rating, 0);
  return Response.json({ count: valid.length, average: valid.length ? sum / valid.length : 0 });
};

export const config = { path: "/api/feedback" };
