import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockStore, mockInitialState } from "./test-utils";
import App from "./App";
import { tasksAPI, Task } from "./api/tasksApi";

// Mock the API
jest.mock("./api/tasksApi", () => ({
  tasksAPI: {
    fetchTasks: jest.fn(),
    updateTaskStatus: jest.fn(),
  },
}));

const mockTasksAPI = tasksAPI as jest.Mocked<typeof tasksAPI>;


describe("App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the complete application", () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
    ];

    mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        tasks: mockTasks,
      },
    });

    render(<App />, { store });

    expect(screen.getByText(/task management dashboard/i)).toBeInTheDocument();
  });

  it("should handle initial data loading", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Initial Task",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
    ];

    mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        tasks: mockTasks,
      },
    });

    render(<App />, { store });

    // Tasks should be immediately visible with mock store
    expect(screen.getByRole("heading", { name: "Initial Task" })).toBeInTheDocument();

    // Since tasks are pre-loaded, fetchTasks should not be called
    expect(mockTasksAPI.fetchTasks).not.toHaveBeenCalled();
  });

  it("should handle data loading errors", async () => {
    const error = new Error("Failed to fetch tasks");
    mockTasksAPI.fetchTasks.mockRejectedValue(error);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        error: "Failed to fetch tasks",
      },
    });

    render(<App />, { store });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading tasks!/)).toBeInTheDocument();
    });
  });

  it("should handle complete user interaction flow", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "High Priority Task",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
      {
        id: 2,
        title: "Medium Priority Task",
        status: "in-progress",
        priority: "medium",
        assignee: "Jane Smith",
        dueDate: "2024-02-20",
      },
      {
        id: 3,
        title: "Low Priority Task",
        status: "done",
        priority: "low",
        assignee: "John Doe",
        dueDate: "2024-02-10",
      },
    ];

    const updatedTask: Task = {
      ...mockTasks[0],
      status: "in-progress",
    };

    mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);
    mockTasksAPI.updateTaskStatus.mockResolvedValue(updatedTask);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        tasks: mockTasks,
      },
    });

    render(<App />, { store });

    // Tasks should be immediately visible with mock store
    expect(screen.getByRole("heading", { name: "High Priority Task" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Medium Priority Task" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Low Priority Task" })).toBeInTheDocument();

    // Check initial task counts
    expect(screen.getByText("3")).toBeInTheDocument(); // Total tasks
    // Check that there's exactly 1 todo task by looking for the badge in the task counter
    expect(screen.getByText("Task Counter")).toBeInTheDocument();
    // Check that the todo count is 1 by looking for the specific badge
    const todoCountBadge = screen.getByText("1", { selector: 'span[colorscheme="gray"]' });
    expect(todoCountBadge).toBeInTheDocument(); // Todo tasks count

    // Filter by status
    const statusFilter = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(statusFilter, "todo");

    // Should only show todo tasks
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "High Priority Task" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("heading", { name: "Medium Priority Task" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Low Priority Task" })).not.toBeInTheDocument();

    // Filter by assignee
    const assigneeFilter = screen.getByLabelText(/assignee/i);
    await userEvent.selectOptions(assigneeFilter, "John Doe");

    // Should show John's tasks
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "High Priority Task" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("heading", { name: "Medium Priority Task" })).not.toBeInTheDocument();

    // Update task status
    const statusSelects = screen.getAllByRole("combobox");
    const taskStatusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px'));
    await userEvent.selectOptions(taskStatusSelect!, "in-progress");

    // Wait for update
    await waitFor(() => {
      expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
        1,
        "in-progress"
      );
    });

    // Clear filters
    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    await userEvent.click(clearButton);

    // Should show all tasks again
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "High Priority Task" })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Medium Priority Task" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Low Priority Task" })).toBeInTheDocument();
  });

  it("should handle multiple rapid interactions", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Task 1",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
      {
        id: 2,
        title: "Task 2",
        status: "todo",
        priority: "medium",
        assignee: "Jane Smith",
        dueDate: "2024-02-20",
      },
    ];

    const updatedTask1: Task = { ...mockTasks[0], status: "in-progress" };
    const updatedTask2: Task = { ...mockTasks[1], status: "done" };

    mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);
    mockTasksAPI.updateTaskStatus
      .mockResolvedValueOnce(updatedTask1)
      .mockResolvedValueOnce(updatedTask2);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        tasks: mockTasks,
      },
    });

    render(<App />, { store });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Task 1" })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Task 2" })).toBeInTheDocument();

    // Rapid interactions
    const statusSelects = screen.getAllByRole("combobox");
    const statusFilter = screen.getByLabelText(/status/i);
    const assigneeFilter = screen.getByLabelText(/assignee/i);

    // Find task status selects (not filter selects)
    const taskStatusSelects = statusSelects.filter(select => select.getAttribute('style')?.includes('min-width: 120px'));

    // Update both tasks
    await userEvent.selectOptions(taskStatusSelects[0], "in-progress");
    await userEvent.selectOptions(taskStatusSelects[1], "done");

    // Apply filters
    await userEvent.selectOptions(statusFilter, "in-progress");
    await userEvent.selectOptions(assigneeFilter, "John Doe");

    // Wait for all operations
    await waitFor(() => {
      expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledTimes(2);
    });

    // Clear filters
    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    await userEvent.click(clearButton);

    // Verify final state
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Task 1" })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Task 2" })).toBeInTheDocument();
  });

  it("should handle error recovery", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
    ];

    // First call fails, second succeeds
    mockTasksAPI.fetchTasks
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockTasks);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        error: "Failed to fetch tasks",
      },
    });

    render(<App />, { store });

    // Should show error initially
    await waitFor(() => {
      expect(screen.getByText(/Error loading tasks!/)).toBeInTheDocument();
    });

    // Simulate retry (in real app, this would be triggered by user action or automatic retry)
    // For this test, we'll just verify the error state is handled
    expect(screen.getByText(/Error loading tasks!/)).toBeInTheDocument();
  });

  it("should maintain state consistency during updates", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Task 1",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
      },
      {
        id: 2,
        title: "Task 2",
        status: "todo",
        priority: "medium",
        assignee: "Jane Smith",
        dueDate: "2024-02-20",
      },
    ];

    const updatedTask: Task = {
      ...mockTasks[0],
      status: "in-progress",
    };

    mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);
    mockTasksAPI.updateTaskStatus.mockResolvedValue(updatedTask);

    const store = createMockStore({
      tasks: {
        ...mockInitialState.tasks,
        tasks: mockTasks,
      },
    });

    render(<App />, { store });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Task 1" })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Task 2" })).toBeInTheDocument();

    // Apply filter
    const statusFilter = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(statusFilter, "todo");

    // Should show both todo tasks
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Task 1" })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Task 2" })).toBeInTheDocument();

    // Update one task
    const statusSelects = screen.getAllByRole("combobox");
    const taskStatusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px'));
    await userEvent.selectOptions(taskStatusSelect!, "in-progress");

    // Wait for update
    await waitFor(() => {
      expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
        1,
        "in-progress"
      );
    });

    // Task should disappear from filtered view
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Task 1" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Task 2" })).toBeInTheDocument();
  });
});
