export async function fetchCandidates({ search = "", stage = "", page = 1 } = {}) {
  const params = new URLSearchParams({ search, stage, page });
  const resp = await fetch(`/candidates?${params.toString()}`);
  if (!resp.ok) throw new Error("Failed to fetch candidates");
  return resp.json();
}

export async function addNote(candidateId, eventPayload) {
  const resp = await fetch(`/candidates/${candidateId}/timeline`, {
    method: "POST",
    body: JSON.stringify(eventPayload),
    headers: { "Content-Type": "application/json" },
  });
  if (!resp.ok) throw new Error("Failed to add note");
  return resp.json();
}

export async function deleteNote(candidateId, noteId) {
  const resp = await fetch(`/candidates/${candidateId}/timeline/${noteId}`, {
    method: "DELETE",
  });
  if (!resp.ok) throw new Error("Failed to delete note");
  return resp.json();
}