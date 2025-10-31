import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../db/indexedDB";
import { Spinner } from "../components/ui/Spinner";
import CandidateNoteForm from "../features/candidates/CandidateNoteForm";
import { addNote, deleteNote } from "../features/candidates/candidatesAPI";
import { nanoid } from "nanoid"; 

const TrashIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c-.269.035-.53.069-.79.1v-2.175A2.25 2.25 0 015.607 2h12.786a2.25 2.25 0 012.25 2.25v2.175c-.26.031-.52.065-.79.1m-12.54 0H12m4.21 0H12m0 0l-1.106-1.106a1.5 1.5 0 010-2.121l.158-.158a1.5 1.5 0 012.122 0l.158.158a1.5 1.5 0 010 2.121L12 5.684z" />
  </svg>
);

function parseMentions(text) {
  return text.split(" ").map((word, i) => {
    if (word.startsWith("@")) {
      return (
        <strong key={i} className="text-sky-600 dark:text-sky-500 font-medium">
          {word}{" "}
        </strong>
      );
    }
    return <span key={i}>{word} </span>;
  });
}

export default function CandidatePage() {
  const { id } = useParams();
  const [cand, setCand] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);

  const timelineEvents = useMemo(() => timeline, [timeline]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const c = await db.candidates.get(id);
      const tl = (await db.timelines.where({ candidateId: id }).first()) || {
        events: [],
      };
      setCand(c);
      setTimeline(tl.events.sort((a, b) => new Date(b.at) - new Date(a.at)));
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleAddNote(noteText) {
    setNoteLoading(true);
    const newEvent = {
      id: nanoid(), 
      type: "note",
      text: noteText,
      at: new Date().toISOString(),
    };

    const previousTimeline = timeline;
    setTimeline((current) => [newEvent, ...current]); 

    try {
      await addNote(id, newEvent);
    } catch (err) {
      console.error("Failed to add note", err);
      setTimeline(previousTimeline); 
    }
    setNoteLoading(false);
  }
  

  async function handleDeleteNote(noteId) {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    
    const previousTimeline = timeline;
    
    setTimeline(current => current.filter(ev => ev.id !== noteId));

    try {
      await deleteNote(id, noteId);
    } catch (err) {
      console.error("Failed to delete note", err);
      setTimeline(previousTimeline); 
    }
  }

  if (loading) return <Spinner />;
  if (!cand) return <div>Candidate not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-semibold mb-2">{cand.name}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cand.email}</div>
          <div>
            <strong>Stage:</strong> {cand.stage}
          </div>
          <div>
            <strong>Applied:</strong>{" "}
            {new Date(cand.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <Link
            to={`/jobs/${cand.jobId}`}
            className="text-sky-600 hover:underline"
          >
            View associated job
          </Link>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <CandidateNoteForm onSubmit={handleAddNote} loading={noteLoading} />

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b dark:border-gray-700">Timeline</h2>
          <div className="space-y-4">
            {timelineEvents.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No events</div>
            ) : (
              timelineEvents.map((ev) => (
                <div key={ev.id || ev.at} className="p-3 bg-gray-50 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center">
                    <span>{new Date(ev.at).toLocaleString()}</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium uppercase text-xs">
                        {ev.type || "NOTE"}
                      </span>
                      {ev.type === "note" && (
                        <button
                          onClick={() => handleDeleteNote(ev.id)}
                          title="Delete note"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-gray-800 dark:text-gray-200">
                    {parseMentions(ev.text)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}