import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockStore } from "../../test-utils";
import TaskCard from "./TaskCard";
import { Task } from "../../api/tasksApi";
import { updateTaskStatusRequest } from "../../features/tasks/tasksSlice";

// Mock the color mode hook
jest.mock("../ui/color-mode", () => ({
  useColorModeValue: jest.fn((light, dark) => light),
}));

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  status: "todo",
  priority: "high",
  assignee: "John Doe",
  dueDate: "2024-02-15",
  createdAt: "2024-02-01T10:00:00Z",
};

const mockTaskInProgress: Task = {
  ...mockTask,
  id: 2,
  status: "in-progress",
  priority: "medium",
  assignee: "Jane Smith",
  dueDate: "2024-02-20",
};

const mockTaskDone: Task = {
  ...mockTask,
  id: 3,
  status: "done",
  priority: "low",
  assignee: "Alice Johnson",
  dueDate: "2024-02-10",
};

const mockOverdueTask: Task = {
  ...mockTask,
  id: 4,
  title: "Overdue Task",
  dueDate: "2020-01-01", // Past date
};

describe("TaskCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render task information correctly", () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("2/15/2024 (Overdue)")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("to do")).toBeInTheDocument();
  });

  it("should display priority badge with correct color scheme", () => {
    render(<TaskCard task={mockTask} />);

    const priorityBadge = screen.getByText("high");
    expect(priorityBadge).toBeInTheDocument();
  });

  it("should display status badge with correct text", () => {
    render(<TaskCard task={mockTaskInProgress} />);

    expect(screen.getByText("in progress")).toBeInTheDocument();
  });

  it("should show overdue indicator for past due dates", () => {
    render(<TaskCard task={mockOverdueTask} />);

    expect(screen.getByText("1/1/2020 (Overdue)")).toBeInTheDocument();
  });

  it("should not show overdue indicator for future due dates", () => {
    const futureTask = {
      ...mockTask,
      dueDate: "2025-02-15",
    };

    render(<TaskCard task={futureTask} />);

    expect(screen.getByText("2/15/2025")).toBeInTheDocument();
    expect(screen.queryByText("(Overdue)")).not.toBeInTheDocument();
  });

  it("should render status select dropdown with correct options", () => {
    render(<TaskCard task={mockTask} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("todo");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(screen.getByRole("option", { name: "To Do" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "In Progress" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("should dispatch updateTaskStatusRequest when status is changed", async () => {
    const store = createMockStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    render(<TaskCard task={mockTask} />, { store });

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "in-progress");

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateTaskStatusRequest({
        taskId: 1,
        newStatus: "in-progress",
        originalStatus: "todo",
      })
    );
  });

  it("should disable select when task is updating", () => {
    const updatingTask = { ...mockTask, isUpdating: true };
    render(<TaskCard task={updatingTask} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("should show spinner when task is updating", () => {
    const updatingTask = { ...mockTask, isUpdating: true };
    render(<TaskCard task={updatingTask} />);

    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner has role="status"
  });

  it("should not show spinner when task is not updating", () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should handle different priority levels correctly", () => {
    const criticalTask = { ...mockTask, priority: "critical" as const };
    const lowTask = { ...mockTask, priority: "low" as const };

    const { rerender } = render(<TaskCard task={criticalTask} />);
    expect(screen.getByText("critical")).toBeInTheDocument();

    rerender(<TaskCard task={lowTask} />);
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("should handle different statuses correctly", () => {
    const { rerender } = render(<TaskCard task={mockTask} />);
    expect(screen.getByText("to do")).toBeInTheDocument();

    rerender(<TaskCard task={mockTaskInProgress} />);
    expect(screen.getByText("in progress")).toBeInTheDocument();

    rerender(<TaskCard task={mockTaskDone} />);
    expect(screen.getByText("done")).toBeInTheDocument();
  });

  it("should format due date correctly", () => {
    const taskWithSpecificDate = {
      ...mockTask,
      dueDate: "2024-12-25",
    };

    render(<TaskCard task={taskWithSpecificDate} />);
    // The date should be formatted as MM/DD/YYYY (Overdue) for past dates
    expect(screen.getByText("12/25/2024 (Overdue)")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<TaskCard task={mockTask} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("task-select");
  });

  it("should maintain task information when status changes", async () => {
    const store = createMockStore();
    render(<TaskCard task={mockTask} />, { store });

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "done");

    // Task information should still be visible
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("2/15/2024 (Overdue)")).toBeInTheDocument();
  });

  it("should handle edge case with empty assignee", () => {
    const taskWithEmptyAssignee = { ...mockTask, assignee: "" };
    render(<TaskCard task={taskWithEmptyAssignee} />);

    expect(screen.getByText("Assignee:")).toBeInTheDocument();
  });

  it("should handle edge case with very long title", () => {
    const taskWithLongTitle = {
      ...mockTask,
      title:
        "This is a very long task title that might cause layout issues and should be handled properly by the component",
    };

    render(<TaskCard task={taskWithLongTitle} />);
    expect(screen.getByText(taskWithLongTitle.title)).toBeInTheDocument();
  });
});
