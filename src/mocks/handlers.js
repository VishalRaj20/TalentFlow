import { http } from "msw";
import db from "../db/indexedDB";

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function randomLatency() {
  return 0;
}

function randomFail(rate = 0.08) {
  return Math.random() < rate;
}

export const handlers = [
  http.get("/jobs", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sort = url.searchParams.get("sort") || "order";

    await wait(randomLatency());
    let all = await db.jobs.toArray();
    if (search) {
      const s = search.toLowerCase();
      all = all.filter((j) => j.title.toLowerCase().includes(s) || (j.tags || []).some(t => t.includes(s)));
    }
    if (status) {
      all = all.filter((j) => j.status === status);
    }
    all = all.sort((a, b) => a.order - b.order);
    const total = all.length;
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return Response.json({ items, total });
  }),

  http.post("/jobs", async ({ request }) => {
    const body = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated server error creating job" }, { status: 500 });
    }
    const id = body.id || (Math.random().toString(36).slice(2));
    const order = (await db.jobs.count());
    const job = { ...body, id, order };
    await db.jobs.add(job);
    return Response.json(job, { status: 201 });
  }),

  http.patch("/jobs/:id", async ({ request, params }) => {
    const { id } = params;
    const patch = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error updating job" }, { status: 500 });
    }
    await db.jobs.update(id, patch);
    const updated = await db.jobs.get(id);
    return Response.json(updated);
  }),

  http.patch("/jobs/:id/reorder", async ({ request, params }) => {
    const { id } = params;
    const { newIndex } = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Reorder failed (simulated)" }, { status: 500 });
    }
    const all = await db.jobs.orderBy("order").toArray();
    const idx = all.findIndex(j => j.id === id);
    if (idx === -1) return new Response(null, { status: 404 });
    const [moved] = all.splice(idx, 1);
    all.splice(newIndex, 0, moved);
    await db.transaction("rw", db.jobs, async () => {
      for (let i = 0; i < all.length; i++) {
        await db.jobs.update(all[i].id, { order: i });
      }
    });
    return Response.json({ success: true });
  }),

  http.get("/candidates", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "50", 10);
    await wait(randomLatency());
    let all = await db.candidates.toArray();
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
    }
    if (stage) {
      all = all.filter(c => c.stage === stage);
    }
    const total = all.length;
    const items = all.slice((page - 1) * pageSize, page * pageSize);
    return Response.json({ items, total });
  }),

  http.post("/candidates", async ({ request }) => {
    const body = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error creating candidate" }, { status: 500 });
    }
    const id = body.id || Math.random().toString(36).slice(2);
    const candidate = { ...body, id, createdAt: new Date().toISOString() };
    await db.candidates.add(candidate);
    return Response.json(candidate, { status: 201 });
  }),

  http.patch("/candidates/:id", async ({ request, params }) => {
    const { id } = params;
    const patch = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error updating candidate" }, { status: 500 });
    }
    await db.candidates.update(id, patch);
    const updated = await db.candidates.get(id);
    return Response.json(updated);
  }),

  http.get("/candidates/:id/timeline", async ({ params }) => {
    const { id } = params;
    await wait(randomLatency());
    const timeline = await db.timelines.where({ candidateId: id }).first();
    return Response.json(timeline || { events: [] });
  }),

  http.post("/candidates/:id/timeline", async ({ request, params }) => {
    const { id: candidateId } = params;
    const newEvent = await request.json();
    
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error saving note" }, { status: 500 });
    }

    let timeline = await db.timelines.where({ candidateId }).first();
    
    if (timeline) {
      const updatedEvents = [newEvent, ...(timeline.events || [])];
      await db.timelines.update(timeline.id, { events: updatedEvents });
      return Response.json({ success: true, events: updatedEvents });
    } else {
      const newTimelineId = "tl-" + Math.random().toString(36).slice(2);
      await db.timelines.add({
        id: newTimelineId,
        candidateId,
        events: [newEvent],
      });
      return Response.json({ success: true, events: [newEvent] }, { status: 201 });
    }
  }),
  
  http.delete("/candidates/:id/timeline/:noteId", async ({ params }) => {
    const { id: candidateId, noteId } = params;
    
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error deleting note" }, { status: 500 });
    }

    let timeline = await db.timelines.where({ candidateId }).first();
    
    if (timeline) {
      const updatedEvents = (timeline.events || []).filter(ev => ev.id !== noteId);
      await db.timelines.update(timeline.id, { events: updatedEvents });
      return Response.json({ success: true, events: updatedEvents });
    } else {
      return Response.json({ success: true, events: [] });
    }
  }),

  http.get("/assessments/:jobId", async ({ params }) => {
    const { jobId } = params;
    await wait(randomLatency());
    const assessment = await db.assessments.where({ jobId }).first();
    if (!assessment) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }
    return Response.json(assessment);
  }),

  http.put("/assessments/:jobId", async ({ request, params }) => {
    const { jobId } = params;
    const payload = await request.json();
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error saving assessment" }, { status: 500 });
    }
    const existing = await db.assessments.where({ jobId }).first();
    if (existing) {
      await db.assessments.update(existing.id, { data: payload, updatedAt: new Date().toISOString() });
      return Response.json({ success: true });
    } else {
      const id = Math.random().toString(36).slice(2);
      await db.assessments.add({ id, jobId, data: payload, updatedAt: new Date().toISOString() });
      return Response.json({ success: true }, { status: 201 });
    }
  }),

  http.post("/assessments/:jobId/submit", async () => {
    await wait(randomLatency());
    if (randomFail()) {
      return Response.json({ message: "Simulated error" }, { status: 500 });
    }
    return Response.json({ success: true }, { status: 201 });
  })
];