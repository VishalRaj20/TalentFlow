import React, { useEffect, useState } from "react";

const Input = ({ label, ...props }) => (
  <label className="block w-full">
    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
    <input
      {...props}
      className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${props.className || ""}`}
    />
  </label>
);

const Select = ({ label, children, ...props }) => (
  <label className="block w-full">
    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
    <select
      {...props}
      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 bg-white dark:bg-gray-700 dark:border-gray-600"
    >
      {children}
    </select>
  </label>
);

export default function JobForm({ initial = null, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [status, setStatus] = useState(initial?.status || "open");
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(", "));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initial) {
      const auto = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setSlug(auto);
    }
  }, [title, initial]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }
    const tags = tagsText.split(",").map(t => t.trim()).filter(Boolean);
    onSave({ title: title.trim(), slug: slug.trim(), status, tags });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}
      
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
        disabled={!!initial}
        className={!!initial ? "bg-gray-100 dark:bg-gray-700" : ""}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </Select>

        <Input
          label="Tags (comma separated)"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="e.g., frontend, react"
        />
      </div>

      <div className="flex items-center gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
}