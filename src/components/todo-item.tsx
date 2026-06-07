"use client";

type TodoItemProps = {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-stone-300 bg-white p-3 shadow-sm">
      <input
        aria-label={`Mark ${title} as ${completed ? "incomplete" : "complete"}`}
        checked={completed}
        className="size-5 shrink-0 accent-emerald-700"
        onChange={() => onToggle(id)}
        type="checkbox"
      />
      <span
        className={`min-w-0 flex-1 break-words text-base ${
          completed ? "text-stone-400 line-through" : "text-stone-900"
        }`}
      >
        {title}
      </span>
      <button
        aria-label={`Delete ${title}`}
        className="min-h-10 shrink-0 rounded-md border border-stone-300 px-3 text-sm font-medium text-stone-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
        onClick={() => onDelete(id)}
        type="button"
      >
        Delete
      </button>
    </li>
  );
}
