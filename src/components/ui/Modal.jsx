export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}