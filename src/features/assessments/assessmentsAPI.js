export async function getAssessment(jobId) {
  const resp = await fetch(`/assessments/${jobId}`);
  if (!resp.ok) throw new Error("Failed to fetch assessment");
  return resp.json();
}

export async function saveAssessment(jobId, payload) {
  const resp = await fetch(`/assessments/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });
  if (!resp.ok) throw new Error("Failed to save assessment");
  return resp.json();
}

export async function submitAssessment(jobId, responsePayload) {
  const resp = await fetch(`/assessments/${jobId}/submit`, {
    method: "POST",
    body: JSON.stringify(responsePayload),
    headers: { "Content-Type": "application/json" }
  });
  if (!resp.ok) throw new Error("Failed to submit assessment");
  return resp.json();
}