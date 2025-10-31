import React from "react";
import { Link } from "react-router-dom";

export default function CandidatesList({ items = [] }) {
  return (
    <div className="space-y-2">
      {items.map(c => (
        <Link key={c.id} to={`/candidates/${c.id}`} className="block p-3 bg-white rounded shadow-sm dark:bg-gray-800">
          <div className="font-medium">{c.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{c.email} • {c.stage}</div>
        </Link>
      ))}
    </div>
  );
}