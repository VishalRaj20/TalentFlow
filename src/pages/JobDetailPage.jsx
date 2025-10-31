import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../db/indexedDB";
import { Spinner } from "../components/ui/Spinner";

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

const StageBadge = ({ stage }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      {
        applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        phone: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        onsite: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        offer: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        hired: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      }[stage] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }`}
  >
    {stage}
  </span>
);

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      
      const [j, c] = await Promise.all([
        db.jobs.get(jobId),
        db.candidates.where({ jobId }).toArray()
      ]);
      
      if (!canceled) {
        setJob(j);
        setCandidates(c);
        setLoading(false);
      }
    }
    load();
    return () => { canceled = true; };
  }, [jobId]);

  if (loading) return <Spinner />;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{job.title}</h1>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Slug: <span className="font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-300 p-1 rounded">{job.slug}</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <StatusBadge status={job.status} />
          <div className="flex items-center gap-2">
            {(job.tags || []).map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Candidates ({candidates.length})
        </h2>
        
        {candidates.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No candidates have applied for this job yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {candidates.map(c => (
              <Link
                key={c.id}
                to={`/candidates/${c.id}`}
                className="flex items-center justify-between p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{c.email}</div>
                </div>
                <div>
                  <StageBadge stage={c.stage} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}