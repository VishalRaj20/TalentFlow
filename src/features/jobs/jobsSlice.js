import { fetchJobs, createJob, patchJob, reorderJob } from "./jobsAPI";
import db from "../../db/indexedDB";

let jobCache = [];
let subscribers = [];
let filters = {
  search: "",
  status: "",
};

function notify() {
  const { search, status } = filters;
  const searchLower = search.toLowerCase();

  let filteredJobs = jobCache.filter(job => {
    if (status && job.status !== status) {
      return false;
    }
    if (searchLower) {
      const titleMatch = job.title.toLowerCase().includes(searchLower);
      const tagMatch = (job.tags || []).some(t => t.toLowerCase().includes(searchLower));
      if (!titleMatch && !tagMatch) {
        return false;
      }
    }
    return true;
  });

  filteredJobs.sort((a, b) => a.order - b.order);

  subscribers.forEach((cb) => cb(filteredJobs));
}

export function subscribeJobs(cb) {
  subscribers.push(cb);
  notify();
  
  return () => {
    subscribers = subscribers.filter((x) => x !== cb);
  };
}

export function setJobFilters(newFilters) {
  filters = { ...filters, ...newFilters };
  notify();
}

export async function loadJobs({ force = false } = {}) {
  if (!force && jobCache.length > 0) {
    notify();
    return jobCache;
  }
  const { items } = await fetchJobs({ page: 1, pageSize: 100 });
  jobCache = items;
  notify();
  return jobCache;
}

export async function addJob(payload) {
  const tempId = "temp-" + Math.random().toString(36).slice(2);
  const optimisticJob = { id: tempId, ...payload, order: jobCache.length, status: "open" };
  const previous = [...jobCache];
  jobCache.unshift(optimisticJob);
  notify();

  try {
    const created = await createJob(payload);
    jobCache = jobCache.map((j) => (j.id === tempId ? created : j));
    await db.jobs.add(created);
    notify();
    return created;
  } catch (err) {
    console.error("[jobsSlice] Create failed, rolling back", err);
    jobCache = previous;
    notify();
    throw err;
  }
}

export async function updateJob(id, patch) {
  const prev = [...jobCache];
  jobCache = jobCache.map((j) => (j.id === id ? { ...j, ...patch } : j));
  notify();

  try {
    const updated = await patchJob(id, patch);
    await db.jobs.update(id, updated);
    jobCache = jobCache.map((j) => (j.id === id ? updated : j));
    notify();
    return updated;
  } catch (err) {
    console.error("[jobsSlice] Update failed, rollback", err);
    jobCache = prev;
    notify();
    throw err;
  }
}

export async function moveJob(jobId, newIndex) {
  const prev = [...jobCache];
  
  const index = jobCache.findIndex((j) => j.id === jobId);
  if (index === -1) return;

  const newJobs = [...jobCache];
  const [moved] = newJobs.splice(index, 1);
  newJobs.splice(newIndex, 0, moved);
  jobCache = newJobs.map((j, i) => ({ ...j, order: i }));
  notify();

  try {
    await reorderJob(jobId, newIndex);
    await Promise.all(jobCache.map((j, i) => db.jobs.update(j.id, { order: i })));
  } catch (err) {
    console.error("[jobsSlice] Reorder failed, rollback", err);
    jobCache = prev;
    notify();
    throw err;
  }
}

export async function toggleArchive(id) {
  const job = jobCache.find((j) => j.id === id);
  if (!job) return;
  const newStatus = job.status === "archived" ? "open" : "archived";
  return updateJob(id, { status: newStatus });
}

export async function getJob(id) {
  const found = jobCache.find((j) => j.id === id);
  if (found) return found;
  return db.jobs.get(id);
}

export async function refreshJobs() {
  return loadJobs({ force: true });
}

export function clearJobsCache() {
  jobCache = [];
  notify();
}