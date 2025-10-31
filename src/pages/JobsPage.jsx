import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  subscribeJobs,
  loadJobs,
  addJob,
  updateJob,
  moveJob,
  toggleArchive,
  setJobFilters,
} from "../features/jobs/jobsSlice";

import JobsList from "../features/jobs/JobsList";
import JobModal from "../features/jobs/JobModal";
import { Spinner } from "../components/ui/Spinner";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const unsub = subscribeJobs((data) => {
      setJobs(data);
      setLoading(false);
    });
    loadJobs(); 
    return unsub;
  }, []);

  useEffect(() => {
    setJobFilters({ search: debouncedSearch, status: statusFilter });
  }, [debouncedSearch, statusFilter]);

  async function handleCreate(payload) {
    setError(null);
    try {
      await addJob(payload);
      setOpenModal(false);
    } catch {
      setError("❌ Failed to create job (rollback performed)");
    }
  }

  async function handleEdit(payload) {
    setError(null);
    try {
      await updateJob(editing.id, payload);
      setOpenModal(false);
    } catch {
      setError("❌ Failed to update job (rollback performed)");
    }
  }

  function handleSave(payload) {
    if (editing) handleEdit(payload);
    else handleCreate(payload);
  }

  async function handleArchive(id) {
    setError(null);
    try {
      await toggleArchive(id);
    } catch {
      setError("❌ Failed to archive job (rollback performed)");
    }
  }

  function openCreateModal() {
    setEditing(null);
    setOpenModal(true);
  }

  function openEditModal(job) {
    setEditing(job);
    setOpenModal(true);
  }

  async function handleReorder(result) {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const jobId = jobs[sourceIndex].id;
    try {
      await moveJob(jobId, destIndex);
    } catch {
      setError("⚠️ Reorder failed (rollback performed)");
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Jobs</h1>
        <button
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md font-medium shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          New Job
        </button>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4"
      >
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or tag..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </select>
      </motion.div>

      {error && (
        <motion.div 
          variants={itemVariants} 
          className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
        >
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="p-6 flex justify-center"><Spinner /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
            <h3 className="text-lg font-medium">No jobs found</h3>
            <p className="mt-1 text-sm">No jobs match your current filters. Try adjusting your search.</p>
          </div>
        ) : (
          <JobsList
            jobs={jobs}
            onEdit={openEditModal}
            onArchive={handleArchive}
            onDragEnd={handleReorder}
          />
        )}
      </motion.div>

      <JobModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initial={editing}
        onSave={handleSave}
      />
    </motion.div>
  );
}