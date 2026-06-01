import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (title) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    set((state) => ({
      todos: [
        {
          id: crypto.randomUUID(),
          title: normalizedTitle,
          completed: false,
        },
        ...state.todos,
      ],
    }));
  },
  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }));
  },
  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },
}));
