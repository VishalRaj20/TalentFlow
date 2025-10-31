import React from "react";

export default function CandidateProfile({ candidate, timeline = [] }) {
  if (!candidate) return <div>No candidate</div>;
  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-4 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="text-xl font-semibold">{candidate.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</div>
        <div className="mt-2"><strong>Stage:</strong> {candidate.stage}</div>
      </div>

      <h3 className="font-medium mb-2">Timeline</h3>
      <div className="space-y-2">
        {timeline.length === 0 ? <div className="text-sm text-gray-500 dark:text-gray-400">No timeline events</div> :
          timeline.map((t, i) => (
            <div key={i} className="bg-white p-3 rounded shadow-sm dark:bg-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(t.at).toLocaleString()}</div>
              <div>{t.text}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}