import { screen } from "@testing-library/react";
import { render, createMockStore, mockInitialState } from "../../test-utils";
import TaskCounter from "./TaskCounter";

// Mock the color mode hook
jest.mock("../ui/color-mode", () => ({
  useColorModeValue: jest.fn((light, dark) => light),
}));

describe("TaskCounter", () => {
  it("should render task statistics correctly", () => {
    render(<TaskCounter />, { store: createMockStore(mockInitialState) });

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // Total from mockInitialState

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    
    // Check that we have the right number of badges with counts
    const badges = screen.getAllByRole("generic");
    const countBadges = badges.filter(badge => 
      badge.textContent === "1" || badge.textContent === "3"
    );
    expect(countBadges).toHaveLength(4); // 3 total, 1 todo, 1 in-progress, 1 done
  });

  it("should display zero counts when no tasks", () => {
    const emptyState = {
      tasks: {
        tasks: [],
        loading: false,
        filterLoading: false,
        error: null,
        filters: { status: "", assignee: "" },
        retryCount: 0,
      },
    };

    render(<TaskCounter />, { store: createMockStore(emptyState) });

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4); // Total, todo, in-progress, done
  });

  it("should update counts when tasks change", () => {
    const stateWithMoreTasks = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          ...mockInitialState.tasks.tasks,
          {
            id: 4,
            title: "Additional Task",
            status: "todo" as const,
            priority: "medium" as const,
            assignee: "Test User",
            dueDate: "2024-02-25",
          },
        ],
      },
    };

    render(<TaskCounter />, { store: createMockStore(stateWithMoreTasks) });

    expect(screen.getByText("4")).toBeInTheDocument(); // Total
    expect(screen.getByText("2")).toBeInTheDocument(); // To Do (2 tasks)
  });

  it("should handle tasks with unknown status", () => {
    const stateWithUnknownStatus = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          ...mockInitialState.tasks.tasks,
          {
            id: 4,
            title: "Unknown Status Task",
            status: "unknown" as any,
            priority: "low" as const,
            assignee: "Test User",
            dueDate: "2024-02-25",
          },
        ],
      },
    };

    render(<TaskCounter />, { store: createMockStore(stateWithUnknownStatus) });

    // Should still count total correctly
    expect(screen.getByText("4")).toBeInTheDocument(); // Total
    // Known statuses should remain the same
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    
    // Check that we have the right counts
    const badges = screen.getAllByRole("generic");
    const countBadges = badges.filter(badge => 
      badge.textContent === "1" || badge.textContent === "4"
    );
    expect(countBadges).toHaveLength(4); // 4 total, 1 todo, 1 in-progress, 1 done
  });

  it("should display loading state correctly", () => {
    const loadingState = {
      tasks: {
        ...mockInitialState.tasks,
        loading: true,
      },
    };

    render(<TaskCounter />, { store: createMockStore(loadingState) });

    // Component should still render even when loading
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  it("should handle error state", () => {
    const errorState = {
      tasks: {
        ...mockInitialState.tasks,
        error: "Failed to fetch tasks",
      },
    };

    render(<TaskCounter />, { store: createMockStore(errorState) });

    // Component should still render even with error
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<TaskCounter />, { store: createMockStore(mockInitialState) });

    // Check for proper text structure
    expect(screen.getByText("Task Counter")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should display correct counts for different task distributions", () => {
    const stateWithManyTodoTasks = {
      tasks: {
        ...mockInitialState.tasks,
        tasks: [
          {
            id: 1,
            title: "Task 1",
            status: "todo" as const,
            priority: "high" as const,
            assignee: "User 1",
            dueDate: "2024-02-15",
          },
          {
            id: 2,
            title: "Task 2",
            status: "todo" as const,
            priority: "medium" as const,
            assignee: "User 2",
            dueDate: "2024-02-16",
          },
          {
            id: 3,
            title: "Task 3",
            status: "todo" as const,
            priority: "low" as const,
            assignee: "User 3",
            dueDate: "2024-02-17",
          },
          {
            id: 4,
            title: "Task 4",
            status: "in-progress" as const,
            priority: "high" as const,
            assignee: "User 4",
            dueDate: "2024-02-18",
          },
        ],
      },
    };

    render(<TaskCounter />, { store: createMockStore(stateWithManyTodoTasks) });

    expect(screen.getByText("4")).toBeInTheDocument(); // Total
    expect(screen.getByText("3")).toBeInTheDocument(); // To Do
    expect(screen.getByText("1")).toBeInTheDocument(); // In Progress
    expect(screen.getByText("0")).toBeInTheDocument(); // Done
  });

  it("should handle empty task list gracefully", () => {
    const emptyState = {
      tasks: {
        tasks: [],
        loading: false,
        filterLoading: false,
        error: null,
        filters: { status: "", assignee: "" },
        retryCount: 0,
      },
    };

    render(<TaskCounter />, { store: createMockStore(emptyState) });

    // All counts should be 0
    const countElements = screen.getAllByText("0");
    expect(countElements).toHaveLength(4); // Total, todo, in-progress, done
  });
});
