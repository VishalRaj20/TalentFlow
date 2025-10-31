export function Search({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
      />
      <button onClick={() => onChange("")} className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Clear</button>
    </div>
  );
}