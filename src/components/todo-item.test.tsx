import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoItem } from "@/components/todo-item";

describe("TodoItem", () => {
  it("renders an incomplete todo item", () => {
    render(
      <ul>
        <TodoItem
          completed={false}
          id="todo-1"
          onDelete={vi.fn()}
          onToggle={vi.fn()}
          title="Write spec"
        />
      </ul>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Mark Write spec as complete",
    });
    const title = screen.getByText("Write spec");

    expect(checkbox).toHaveProperty("checked", false);
    expect(title.className).toContain("text-stone-900");
    expect(title.className).not.toContain("line-through");
  });

  it("renders a completed todo item", () => {
    render(
      <ul>
        <TodoItem
          completed
          id="todo-1"
          onDelete={vi.fn()}
          onToggle={vi.fn()}
          title="Review plan"
        />
      </ul>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Mark Review plan as incomplete",
    });
    const title = screen.getByText("Review plan");

    expect(checkbox).toHaveProperty("checked", true);
    expect(title.className).toContain("text-stone-400");
    expect(title.className).toContain("line-through");
  });

  it("calls onToggle with the todo id when the checkbox is activated", () => {
    const onToggle = vi.fn();

    render(
      <ul>
        <TodoItem
          completed={false}
          id="todo-1"
          onDelete={vi.fn()}
          onToggle={onToggle}
          title="Toggle me"
        />
      </ul>,
    );

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Mark Toggle me as complete" }),
    );

    expect(onToggle).toHaveBeenCalledExactlyOnceWith("todo-1");
  });

  it("calls onDelete with the todo id when the delete button is activated", () => {
    const onDelete = vi.fn();

    render(
      <ul>
        <TodoItem
          completed={false}
          id="todo-1"
          onDelete={onDelete}
          onToggle={vi.fn()}
          title="Delete me"
        />
      </ul>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Delete me" }),
    );

    expect(onDelete).toHaveBeenCalledExactlyOnceWith("todo-1");
  });

  it("keeps controls accessible and title wrapping classes for a long title", () => {
    const longTitle =
      "Document the todo item extraction with a long title that should wrap inside the row without hiding controls";

    render(
      <ul>
        <TodoItem
          completed={false}
          id="todo-1"
          onDelete={vi.fn()}
          onToggle={vi.fn()}
          title={longTitle}
        />
      </ul>,
    );

    expect(
      screen.getByRole("checkbox", {
        name: `Mark ${longTitle} as complete`,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: `Delete ${longTitle}` }),
    ).toBeTruthy();

    const title = screen.getByText(longTitle);

    expect(title.className).toContain("min-w-0");
    expect(title.className).toContain("flex-1");
    expect(title.className).toContain("break-words");
  });
});
