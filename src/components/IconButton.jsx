export function IconButton({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
}