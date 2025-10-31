export async function fetchJobs({ search = "", status = "", page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({ search, status, page, pageSize });
  const resp = await fetch(`/jobs?${params.toString()}`);
  if (!resp.ok) throw new Error("Failed to fetch jobs");
  return resp.json();
}

export async function createJob(payload) {
  const resp = await fetch("/jobs", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  if (!resp.ok) throw new Error("Failed to create job");
  return resp.json();
}

export async function patchJob(id, patch) {
  const resp = await fetch(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(patch), headers: { "Content-Type": "application/json" } });
  if (!resp.ok) throw new Error("Failed to patch job");
  return resp.json();
}

export async function reorderJob(id, newIndex) {
  const resp = await fetch(`/jobs/${id}/reorder`, { method: "PATCH", body: JSON.stringify({ newIndex }), headers: { "Content-Type": "application/json" } });
  if (!resp.ok) throw new Error("Reorder failed");
  return resp.json();
}