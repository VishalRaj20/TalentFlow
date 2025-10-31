import db from "../db/indexedDB";

export async function getJobs() {
  return db.jobs.orderBy("order").toArray();
}

export async function getJob(id) {
  return db.jobs.get(id);
}

export async function updateJob(id, patch) {
  return db.jobs.update(id, patch);
}
