import db from "./indexedDB";

export async function reseed() {
  await db.jobs.clear();
  await db.candidates.clear();
  await db.assessments.clear();
  const { initDB } = await import("./indexedDB");
  await initDB();
  return true;
}
