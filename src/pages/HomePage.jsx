import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import db from "../db/indexedDB";
import { Spinner } from "../components/ui/Spinner";
import { Briefcase, Users, ClipboardList } from "lucide-react";

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const IconWrapper = ({ children }) => (
  <motion.div
    className="bg-gradient-to-br from-purple-500 to-sky-500 p-3 rounded-xl shadow-md text-white"
    whileHover={{ rotate: 5, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 180 }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ title, value, linkTo, loading }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -5 }}
    className="rounded-xl shadow-xl transition-all bg-white/10 backdrop-blur-xl border border-white/20 dark:bg-gray-900/30 cursor-pointer"
  >
    <Link to={linkTo} className="block p-6 h-full">
      <p className="text-sm font-medium text-gray-300 uppercase tracking-wider">
        {title}
      </p>
      {loading ? (
        <div className="mt-4 h-10">
          <Spinner />
        </div>
      ) : (
        <p className="text-4xl font-black mt-3 text-white drop-shadow-sm">
          {value}
        </p>
      )}
    </Link>
  </motion.div>
);

function FeatureCard({ to, title, description, icon }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.06, y: -5 }}>
      <Link
        to={to}
        className="block p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 dark:bg-gray-900/40 transition-all hover:shadow-2xl"
      >
        <div className="flex justify-center mb-6">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [jobs, cands, assess, applied] = await Promise.all([
          db.jobs.count(),
          db.candidates.count(),
          db.assessments.count(),
          db.candidates.where('stage').equals('applied').count(),
        ]);
        setStats({ jobs, cands, assess, applied });
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className="space-y-16 sm:space-y-20 pb-20"
    >
    
      <motion.header
        variants={itemVariants}
        className="text-center py-12 sm:py-20 rounded-3xl bg-gradient-to-r from-purple-600/40 via-sky-500/30 to-blue-500/40 shadow-lg backdrop-blur-xl border border-white/20"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          TalentFlow Dashboard
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-200 px-4">
          Manage hiring workflows with a beautiful and powerful interface.
        </p>
      </motion.header>

      <section>
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold mb-8 text-white"
        >
          Overview
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          <StatCard title="Total Jobs" value={stats?.jobs} linkTo="/jobs" loading={loading} />
          <StatCard title="Candidates" value={stats?.cands} linkTo="/candidates" loading={loading} />
          <StatCard title="New Applicants" value={stats?.applied} linkTo="/candidates" loading={loading} />
          <StatCard title="Assessments" value={stats?.assess} linkTo="/assessments" loading={loading} />
        </motion.div>
      </section>

      <section>
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold mb-10 text-white"
        >
          Manage Workflow
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10"
        >
          <FeatureCard
            to="/jobs"
            title="Manage Jobs"
            description="Post new openings, edit, archive, and organize job listings."
            icon={<IconWrapper><Briefcase size={36} /></IconWrapper>}
          />
          <FeatureCard
            to="/candidates"
            title="Track Candidates"
            description="Monitor hiring pipeline and review candidate profiles."
            icon={<IconWrapper><Users size={36} /></IconWrapper>}
          />
          <FeatureCard
            to="/assessments"
            title="Build Assessments"
            description="Create and assign tests tailored for job requirements."
            icon={<IconWrapper><ClipboardList size={36} /></IconWrapper>}
          />
        </motion.div>
      </section>
    </motion.div>
  );
}