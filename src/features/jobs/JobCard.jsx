import React from "react";
import { Link } from "react-router-dom";

const DragHandleIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path d="M7 2a2 2 0 100 4 2 2 0 000-4zM3 2a2 2 0 100 4 2 2 0 000-4zM7 8a2 2 0 100 4 2 2 0 000-4zM3 8a2 2 0 100 4 2 2 0 000-4zM7 14a2 2 0 100 4 2 2 0 000-4zM3 14a2 2 0 100 4 2 2 0 000-4zM12 2a2 2 0 100 4 2 2 0 000-4zM16 2a2 2 0 100 4 2 2 0 000-4zM12 8a2 2 0 100 4 2 2 0 000-4zM16 8a2 2 0 100 4 2 2 0 000-4zM12 14a2 2 0 100 4 2 2 0 000-4zM16 14a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);
const ArchiveIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h14" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const colors = {
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    archived: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.closed}`}
    >
      {status}
    </span>
  );
};

const TagBadge = ({ tag }) => (
  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 text-xs font-medium">
    {tag}
  </span>
);

export default function JobCard({ job, onEdit, onArchive }) {
  const isArchived = job.status === "archived";
  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 transition-all hover:shadow-md ${isArchived ? "opacity-60" : ""} dark:bg-gray-800 dark:border-gray-700`}>
      <div className="cursor-grab text-gray-400" title="Drag to reorder">
        <DragHandleIcon />
      </div>

      <div className="flex-grow">
        <Link to={`/jobs/${job.id}`} className="font-semibold text-lg text-gray-800 hover:text-sky-600 hover:underline dark:text-gray-100 dark:hover:text-sky-500">
          {job.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={job.status} />
          {(job.tags || []).map((tag, idx) => (
            <TagBadge key={`${tag}-${idx}`} tag={tag} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onArchive(job.id)}
          title={isArchived ? "Unarchive" : "Archive"}
          className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <ArchiveIcon />
        </button>
        <button
          onClick={() => onEdit(job)}
          title="Edit"
          className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-sky-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-sky-500"
        >
          <EditIcon />
        </button>
      </div>
    </div>
  );
}