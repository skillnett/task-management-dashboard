import { screen } from "@testing-library/react";
import { render, createMockStore, mockInitialState } from "../../test-utils";
import TaskList from "./TaskList";

// Mock the color mode hook
jest.mock("../ui/color-mode", () => ({
  useColorModeValue: jest.fn((light, dark) => light),
}));

describe("TaskList", () => {
  it("should render task cards for all tasks", () => {
    render(<TaskList />, { store: createMockStore(mockInitialState) });

    // Should render all 3 tasks from mockInitialState
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.getByText("Test Task 3")).toBeInTheDocument();
  });

  it("should display loading state when tasks are loading", () => {
    const loadingState = {
      tasks: {
        ...mockInitialState.tasks,
        loading: true,
      },
    };

    render(<TaskList />, { store: createMockStore(loadingState) });

    // Check for skeleton loaders
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(6); // 6 skeleton loaders
    expect(skeletons[0]).toBeInTheDocument();
  });

  it("should display error state when there is an error", () => {
    const errorState = {
      tasks: {
        ...mockInitialState.tasks,
        error: "Failed to fetch tasks",
      },
    };

    render(<TaskList />, { store: createMockStore(errorState) });

    expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument();
  });

  it("should display empty state when no tasks", () => {
    const emptyState = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [],
      },
    };

    render(<TaskList />, { store: createMockStore(emptyState) });

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("should display filtered tasks when filters are applied", () => {
    const filteredState = {
      tasks: {
        ...mockInitialState.tasks,
        filters: { status: "todo", assignee: "" },
      },
    };

    render(<TaskList />, { store: createMockStore(filteredState) });

    // Should only show todo tasks
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument(); // in-progress
    expect(screen.queryByText("Test Task 3")).not.toBeInTheDocument(); // done
  });

  it("should display tasks filtered by assignee", () => {
    const assigneeFilteredState = {
      tasks: {
        ...mockInitialState.tasks,
        filters: { status: "", assignee: "John Doe" },
      },
    };

    render(<TaskList />, { store: createMockStore(assigneeFilteredState) });

    // Should only show tasks assigned to John Doe
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 3")).toBeInTheDocument();
    expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument(); // Jane Smith
  });

  it("should display tasks filtered by both status and assignee", () => {
    const bothFilteredState = {
      tasks: {
        ...mockInitialState.tasks,
        filters: { status: "todo", assignee: "John Doe" },
      },
    };

    render(<TaskList />, { store: createMockStore(bothFilteredState) });

    // Should only show todo tasks assigned to John Doe
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Task 3")).not.toBeInTheDocument();
  });

  it("should display empty state when no tasks match filters", () => {
    const noMatchState = {
      tasks: {
        ...mockInitialState.tasks,
        filters: { status: "non-existent", assignee: "Non-existent" },
      },
    };

    render(<TaskList />, { store: createMockStore(noMatchState) });

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("should handle tasks with different statuses", () => {
    const stateWithVariousStatuses = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          {
            id: 1,
            title: "Todo Task",
            status: "todo" as const,
            priority: "high" as const,
            assignee: "User 1",
            dueDate: "2024-02-15",
          },
          {
            id: 2,
            title: "In Progress Task",
            status: "in-progress" as const,
            priority: "medium" as const,
            assignee: "User 2",
            dueDate: "2024-02-16",
          },
          {
            id: 3,
            title: "Done Task",
            status: "done" as const,
            priority: "low" as const,
            assignee: "User 3",
            dueDate: "2024-02-17",
          },
        ],
      },
    };

    render(<TaskList />, { store: createMockStore(stateWithVariousStatuses) });

    expect(screen.getByText("Todo Task")).toBeInTheDocument();
    expect(screen.getByText("In Progress Task")).toBeInTheDocument();
    expect(screen.getByText("Done Task")).toBeInTheDocument();
  });

  it("should handle tasks with different priorities", () => {
    const stateWithVariousPriorities = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          {
            id: 1,
            title: "Critical Task",
            status: "todo" as const,
            priority: "critical" as const,
            assignee: "User 1",
            dueDate: "2024-02-15",
          },
          {
            id: 2,
            title: "High Task",
            status: "todo" as const,
            priority: "high" as const,
            assignee: "User 2",
            dueDate: "2024-02-16",
          },
          {
            id: 3,
            title: "Low Task",
            status: "todo" as const,
            priority: "low" as const,
            assignee: "User 3",
            dueDate: "2024-02-17",
          },
        ],
      },
    };

    render(<TaskList />, {
      store: createMockStore(stateWithVariousPriorities),
    });

    expect(screen.getByText("Critical Task")).toBeInTheDocument();
    expect(screen.getByText("High Task")).toBeInTheDocument();
    expect(screen.getByText("Low Task")).toBeInTheDocument();
  });

  it("should handle large number of tasks", () => {
    const manyTasks = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      title: `Task ${index + 1}`,
      status: "todo" as const,
      priority: "medium" as const,
      assignee: `User ${index + 1}`,
      dueDate: "2024-02-15",
    }));

    const stateWithManyTasks = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: manyTasks,
      },
    };

    render(<TaskList />, { store: createMockStore(stateWithManyTasks) });

    // Should render all tasks
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 50")).toBeInTheDocument();
  });

  it("should handle tasks with special characters in titles", () => {
    const stateWithSpecialTitles = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          {
            id: 1,
            title: 'Task with "quotes"',
            status: "todo" as const,
            priority: "high" as const,
            assignee: "User 1",
            dueDate: "2024-02-15",
          },
          {
            id: 2,
            title: "Task with <HTML> tags",
            status: "todo" as const,
            priority: "medium" as const,
            assignee: "User 2",
            dueDate: "2024-02-16",
          },
          {
            id: 3,
            title: "Task with émojis 🚀",
            status: "todo" as const,
            priority: "low" as const,
            assignee: "User 3",
            dueDate: "2024-02-17",
          },
        ],
      },
    };

    render(<TaskList />, { store: createMockStore(stateWithSpecialTitles) });

    expect(screen.getByText('Task with "quotes"')).toBeInTheDocument();
    expect(screen.getByText("Task with <HTML> tags")).toBeInTheDocument();
    expect(screen.getByText("Task with émojis 🚀")).toBeInTheDocument();
  });

  it("should handle filter loading state", () => {
    const filterLoadingState = {
      tasks: {
        ...mockInitialState.tasks,
        filterLoading: true,
      },
    };

    render(<TaskList />, { store: createMockStore(filterLoadingState) });

    // Should still show tasks when filter is loading
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<TaskList />, { store: createMockStore(mockInitialState) });

    // Should have proper grid structure
    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
  });

  it("should handle tasks with missing optional fields", () => {
    const stateWithIncompleteTasks = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          {
            id: 1,
            title: "Complete Task",
            status: "todo" as const,
            priority: "high" as const,
            assignee: "User 1",
            dueDate: "2024-02-15",
            createdAt: "2024-02-01",
          },
          {
            id: 2,
            title: "Incomplete Task",
            status: "todo" as const,
            priority: "medium" as const,
            assignee: "User 2",
            dueDate: "2024-02-16",
          }, // Missing createdAt
        ],
      },
    };

    render(<TaskList />, { store: createMockStore(stateWithIncompleteTasks) });

    expect(screen.getByText("Complete Task")).toBeInTheDocument();
    expect(screen.getByText("Incomplete Task")).toBeInTheDocument();
  });
});
