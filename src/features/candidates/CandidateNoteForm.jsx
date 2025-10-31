import React, { useState } from "react";

const MENTION_SUGGESTIONS = [
  "alex_smith",
  "hr_manager",
  "jane_doe",
  "recruiting_team",
];

export default function CandidateNoteForm({ onSubmit, loading }) {
  const [note, setNote] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleChange(e) {
    const text = e.target.value;
    setNote(text);

    const lastChar = text.slice(-1);
    const lastWord = text.split(" ").pop();
    if (lastWord.startsWith("@")) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(name) {
    setNote((currentNote) => {
      const words = currentNote.split(" ");
      words.pop();
      return [...words, `@${name} `].join(" ");
    });
    setShowSuggestions(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit(note);
    setNote("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative"
    >
      <label
        htmlFor="note"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Add a note or event
      </label>
      <textarea
        id="note"
        value={note}
        onChange={handleChange}
        rows={3}
        className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
        placeholder="Type a note... use @ to mention a user"
      />

      {showSuggestions && (
        <div className="absolute z-10 w-full max-w-xs mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-700">
          <div className="py-1 text-sm text-gray-500 dark:text-gray-400 px-3">Suggestions:</div>
          <div className="max-h-40 overflow-y-auto">
            {MENTION_SUGGESTIONS.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() => handleSuggestionClick(name)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}