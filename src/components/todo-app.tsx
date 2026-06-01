"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTodoStore } from "@/stores/todo-store";

export function TodoApp() {
  const [title, setTitle] = useState("");
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTodo(title);
    setTitle("");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-5 py-8 text-stone-950 sm:px-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-stone-300 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Agentic SDLC baseline
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
                Todo App
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
                Keep the product small so implementation, QA, and review stay
                easy to inspect.
              </p>
            </div>
            <div className="w-fit rounded-md border border-stone-300 bg-white px-4 py-3 shadow-sm">
              <span className="block text-2xl font-semibold text-stone-950">
                {remainingCount}
              </span>
              <span className="text-sm text-stone-600">remaining</span>
            </div>
          </div>
        </header>

        <form
          className="flex flex-col gap-3 rounded-md border border-stone-300 bg-white p-3 shadow-sm sm:flex-row"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="todo-title">
            Todo title
          </label>
          <input
            id="todo-title"
            className="min-h-12 flex-1 rounded-md border border-stone-300 bg-stone-50 px-4 text-base outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="Add a todo"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button
            className="min-h-12 rounded-md bg-emerald-700 px-5 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            type="submit"
          >
            Add Todo
          </button>
        </form>

        <section aria-label="Todo list" className="flex flex-col gap-3">
          {todos.length === 0 ? (
            <div className="rounded-md border border-dashed border-stone-300 bg-white px-5 py-12 text-center text-stone-600">
              No todos yet.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {todos.map((todo) => (
                <li
                  className="flex items-center gap-3 rounded-md border border-stone-300 bg-white p-3 shadow-sm"
                  key={todo.id}
                >
                  <input
                    aria-label={`Mark ${todo.title} as ${
                      todo.completed ? "incomplete" : "complete"
                    }`}
                    checked={todo.completed}
                    className="size-5 shrink-0 accent-emerald-700"
                    onChange={() => toggleTodo(todo.id)}
                    type="checkbox"
                  />
                  <span
                    className={`min-w-0 flex-1 break-words text-base ${
                      todo.completed
                        ? "text-stone-400 line-through"
                        : "text-stone-900"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    className="min-h-10 rounded-md border border-stone-300 px-3 text-sm font-medium text-stone-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                    onClick={() => deleteTodo(todo.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
