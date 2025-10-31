import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import db from "../db/indexedDB";
import CandidateKanban from "../features/candidates/CandidateKanban";

const PAGE_SIZE = 50;
const KANBAN_STAGES = [
  { id: 'applied', title: 'Applied' },
  { id: 'screen', title: 'Screen' },
  { id: 'tech', title: 'Tech' },
  { id: 'offer', title: 'Offer' },
  { id: 'hired', title: 'Hired' },
  { id: 'rejected', title: 'Rejected' },
];

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
};

export default function CandidatesPage() {
  const [viewMode, setViewMode] = useState('list'); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allCandidates, setAllCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await db.candidates.toArray();
      setAllCandidates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredCandidates = useMemo(() => {
    const searchLower = search.toLowerCase();
    if (!searchLower) return allCandidates;
    
    return allCandidates.filter(c => 
      c.name.toLowerCase().includes(searchLower) || 
      c.email.toLowerCase().includes(searchLower)
    );
  }, [allCandidates, search]);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    
    return {
      items: filteredCandidates.slice(start, end),
      totalCount: filteredCandidates.length,
      totalPages: Math.ceil(filteredCandidates.length / PAGE_SIZE)
    };
  }, [filteredCandidates, currentPage]);

  const candidatesByStage = useMemo(() => {
    const grouped = {};
    for (const stage of KANBAN_STAGES) {
      grouped[stage.id] = [];
    }
    for (const cand of filteredCandidates) {
      if (grouped[cand.stage]) {
        grouped[cand.stage].push(cand);
      }
    }
    return grouped;
  }, [filteredCandidates]);

  function handleSearch() {
    setCurrentPage(1);
  }
  
  function handleClearSearch() {
    setSearch("");
    setCurrentPage(1);
  }

  async function handleDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId;
    const candidateId = draggableId;
    const previousCandidates = [...allCandidates];

    setAllCandidates(current => 
      current.map(c => 
        c.id === candidateId ? { ...c, stage: newStage } : c
      )
    );

    try {
      const resp = await fetch(`/candidates/${candidateId}`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: newStage }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!resp.ok) throw new Error('Failed to update stage');
      await db.candidates.update(candidateId, { stage: newStage });

    } catch (err) {
      console.error("Failed to move candidate, rolling back", err);
      setError("❌ Failed to move candidate. Rolled back.");
      setAllCandidates(previousCandidates);
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        variants={headerVariants}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Candidates</h1>
        
        <div className="flex items-center justify-between md:justify-end gap-2 w-full">
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search name or email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition dark:bg-gray-700 dark:border-gray-600"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex-shrink-0 p-1 bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                viewMode === 'kanban' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          className="p-3 rounded-md bg-red-900 text-red-300 border border-red-700"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="p-8 text-center"><Spinner /></div>
      ) : viewMode === 'list' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {paginatedCandidates.items.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 120 }}
                >
                  <Link
                    to={`/candidates/${c.id}`}
                    className="block p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-l-4 border-sky-500 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{c.name}</div>
                      <div
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          c.stage === "applied"
                            ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : c.stage === "screen"
                            ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : c.stage === "tech"
                            ? "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : c.stage === "offer"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : c.stage === "hired"
                            ? "bg-green-500 text-white dark:bg-green-700"
                            : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {c.stage.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.email}</div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {paginatedCandidates.totalPages} ({paginatedCandidates.totalCount} results)
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(paginatedCandidates.totalPages, p + 1))}
              disabled={currentPage === paginatedCandidates.totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="-mx-6">
          <CandidateKanban
            stages={KANBAN_STAGES}
            candidatesByStage={candidatesByStage}
            onDragEnd={handleDragEnd}
          />
        </div>
      )}
    </motion.div>
  );
}