import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import db from "../db/indexedDB";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await db.assessments.toArray();
      setAssessments(all);
    })();
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Assessments</h1>
          <p className="text-gray-600 dark:text-gray-300 text-md mt-1">Manage and edit assessments for open roles</p>
        </div>
        <Link
          to="/assessments/new"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-sky-700 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white/60 backdrop-blur-md rounded-2xl shadow-inner dark:text-gray-400 dark:bg-gray-800/60">
          <p className="text-lg">No assessments yet.</p>
          <p className="text-sm mt-2">Start by creating one for a job posting.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {assessments.map((a) => (
            <motion.div
              key={a.id}
              className="relative group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 dark:bg-gray-800/80 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-100/20 to-indigo-100/10 opacity-0 group-hover:opacity-100 transition-all duration-500 dark:from-sky-900/20 dark:to-indigo-900/10" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-sky-700 transition dark:text-gray-100 dark:group-hover:text-sky-500">
                    {a.data?.title || "Untitled Assessment"}
                  </h2>
                  <Link
                    to={`/assessments/${a.jobId}`}
                    className="text-sky-600 hover:text-sky-800 transition dark:text-sky-500 dark:hover:text-sky-400"
                    title="Edit Assessment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M13.5 7.5L4 17v3h3l9.5-9.5z" />
                    </svg>
                  </Link>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Job ID: <span className="font-medium text-gray-700 dark:text-gray-300">{a.jobId}</span>
                </p>

                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-full font-medium dark:bg-sky-900 dark:text-sky-300">
                    {a.data?.questions?.length || 0} Questions
                  </span>
                  <span className="text-xs text-gray-400">
                    Last updated {new Date(a.updatedAt || a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}