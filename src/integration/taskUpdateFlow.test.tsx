import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";
import { render, createMockStore, mockInitialState } from "../test-utils";
import TaskDashboard from "../components/TaskDashboard/TaskDashboard";
import { tasksAPI, Task } from "../api/tasksApi";
import {
  updateTaskStatusSuccess,
  incrementRetryCount,
} from "../features/tasks/tasksSlice";
import { updateTaskStatusSaga, fetchTasksSaga } from "../features/tasks/tasksSaga";

// Mock the API
jest.mock("../api/tasksApi", () => ({
  tasksAPI: {
    fetchTasks: jest.fn(),
    updateTaskStatus: jest.fn(),
  },
}));

const mockTasksAPI = tasksAPI as jest.Mocked<typeof tasksAPI>;

describe("Task Update Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks before each test
    mockTasksAPI.fetchTasks.mockClear();
    mockTasksAPI.updateTaskStatus.mockClear();
  });

  describe("Complete Task Update Flow", () => {
    it("should handle successful task status update from todo to in-progress", async () => {
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

      const updatedTask: Task = {
        ...mockTasks[0],
        status: "in-progress",
      };

      // Mock API responses
      mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);
      mockTasksAPI.updateTaskStatus.mockResolvedValue(updatedTask);

      const store = createMockStore({
        tasks: {
          ...mockInitialState.tasks,
          tasks: mockTasks,
        },
      });

      render(<TaskDashboard />, { store });

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });

      // Find the status select dropdown in the task card (not the filter)
      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];
      expect(statusSelect).toHaveValue("todo");

      // Change status to in-progress
      await userEvent.selectOptions(statusSelect, "in-progress");

      // Verify the optimistic update (task should show as updating)
      await waitFor(() => {
        expect(statusSelect).toBeDisabled();
      });

      // Wait for the API call to complete
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
          1,
          "in-progress"
        );
      });

      // Verify the final state
      await waitFor(() => {
        expect(statusSelect).toHaveValue("in-progress");
      });
      expect(statusSelect).not.toBeDisabled();
    });

    it("should handle task status update failure and rollback", async () => {
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

      // Mock API responses
      mockTasksAPI.fetchTasks.mockResolvedValue(mockTasks);
      mockTasksAPI.updateTaskStatus.mockRejectedValue(
        new Error("Update failed")
      );

      const store = createMockStore({
        tasks: {
          ...mockInitialState.tasks,
          tasks: mockTasks,
        },
      });

      render(<TaskDashboard />, { store });

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });

      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];

      // Change status to in-progress
      await userEvent.selectOptions(statusSelect, "in-progress");

      // Wait for the API call to fail
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
          1,
          "in-progress"
        );
      });

      // Wait a bit more for the saga to process the error and rollback
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify rollback - status should be back to original
      await waitFor(() => {
        expect(statusSelect).toHaveValue("todo");
      }, { timeout: 3000 });
      expect(statusSelect).not.toBeDisabled();
    });

    it("should handle multiple rapid status updates", async () => {
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

      const updatedTask1: Task = { ...mockTasks[0], status: "in-progress" };
      const updatedTask2: Task = { ...mockTasks[0], status: "done" };

      // Mock API responses
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

      render(<TaskDashboard />, { store });

      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });

      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];

      // Rapid status changes
      await userEvent.selectOptions(statusSelect, "in-progress");
      
      // Wait for first update to complete
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledTimes(1);
      });
      
      await userEvent.selectOptions(statusSelect, "done");

      // Wait for second API call
      await waitFor(() => {
        console.log('API call count:', mockTasksAPI.updateTaskStatus.mock.calls.length);
        console.log('API calls:', mockTasksAPI.updateTaskStatus.mock.calls);
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledTimes(2);
      }, { timeout: 3000 });

      // Verify final state
      await waitFor(() => {
        expect(statusSelect).toHaveValue("done");
      });
    });

    it("should handle task update with filters applied", async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: "Todo Task",
          status: "todo",
          priority: "high",
          assignee: "John Doe",
          dueDate: "2024-02-15",
        },
        {
          id: 2,
          title: "In Progress Task",
          status: "in-progress",
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
          filters: { status: "todo", assignee: "" },
        },
      });

      render(<TaskDashboard />, { store });

      // Should only show todo tasks initially
      await waitFor(() => {
        expect(screen.getByText("Todo Task")).toBeInTheDocument();
      });
      expect(screen.queryByText("In Progress Task")).not.toBeInTheDocument();

      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];
      await userEvent.selectOptions(statusSelect, "in-progress");

      // Wait for update to complete
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
          1,
          "in-progress"
        );
      });

      // Task should disappear from filtered view since it's no longer todo
      await waitFor(() => {
        expect(screen.queryByText("Todo Task")).not.toBeInTheDocument();
      });
    });

    it("should handle task update with error boundary", async () => {
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
      mockTasksAPI.updateTaskStatus.mockRejectedValue(
        new Error("Network error")
      );

      const store = createMockStore({
        tasks: {
          ...mockInitialState.tasks,
          tasks: mockTasks,
        },
      });

      render(<TaskDashboard />, { store });

      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });

      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];
      await userEvent.selectOptions(statusSelect, "in-progress");

      // Should handle error gracefully and rollback
      await waitFor(() => {
        expect(statusSelect).toHaveValue("todo");
      });
    });
  });

  describe("Saga Integration Tests", () => {
    it("should test complete saga flow for task update", () => {
      const mockTask: Task = {
        id: 1,
        title: "Test Task",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-02-15",
        createdAt: "2024-02-01T10:00:00Z",
      };

      const updatedTask: Task = {
        ...mockTask,
        status: "in-progress",
      };

      return expectSaga(updateTaskStatusSaga, {
        type: 'tasks/updateTaskStatusRequest',
        payload: {
          taskId: 1,
          newStatus: "in-progress",
          originalStatus: "todo",
        }
      })
        .provide([
          [call(tasksAPI.updateTaskStatus, 1, "in-progress"), updatedTask]
        ])
        .call(tasksAPI.updateTaskStatus, 1, "in-progress")
        .put(updateTaskStatusSuccess(updatedTask))
        .run(500); // Increase timeout to 500ms
    });

    it("should test saga flow with retry logic", () => {
      const error = new Error("Network error");

      return expectSaga(fetchTasksSaga, {
        type: 'tasks/fetchTasksRequest',
        payload: {}
      })
        .withState({
          tasks: {
            retryCount: 0,
            tasks: [],
            loading: false,
            filterLoading: false,
            error: null,
            filters: { status: '', assignee: '' }
          }
        })
        .provide([
          [call(tasksAPI.fetchTasks, {}), Promise.reject(error)]
        ])
        .call(tasksAPI.fetchTasks, {})
        .put(incrementRetryCount())
        .run(500); // Increase timeout to 500ms
    });
  });

  describe("End-to-End User Scenarios", () => {
    it("should handle complete user workflow: load tasks, filter, update status", async () => {
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
          status: "todo",
          priority: "medium",
          assignee: "Jane Smith",
          dueDate: "2024-02-20",
        },
        {
          id: 3,
          title: "Low Priority Task",
          status: "in-progress",
          priority: "low",
          assignee: "John Doe",
          dueDate: "2024-02-25",
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

      render(<TaskDashboard />, { store });

      // 1. Load tasks
      await waitFor(() => {
        expect(screen.getByText("High Priority Task")).toBeInTheDocument();
      });
      expect(screen.getByText("Medium Priority Task")).toBeInTheDocument();
      expect(screen.getByText("Low Priority Task")).toBeInTheDocument();

      // 2. Filter by assignee
      const assigneeFilter = screen.getByLabelText(/assignee/i);
      await userEvent.selectOptions(assigneeFilter, "John Doe");

      // Should only show John's tasks
      await waitFor(() => {
        expect(screen.getByText("High Priority Task")).toBeInTheDocument();
      });
      expect(screen.getByText("Low Priority Task")).toBeInTheDocument();
      expect(
        screen.queryByText("Medium Priority Task")
      ).not.toBeInTheDocument();

      // 3. Update task status
      const statusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelect = statusSelects.find(select => select.getAttribute('style')?.includes('min-width: 120px')) || statusSelects[0];
      await userEvent.selectOptions(statusSelect, "in-progress");

      // Wait for update
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledWith(
          1,
          "in-progress"
        );
      });

      // 4. Clear filters
      const clearButton = screen.getByRole("button", {
        name: /clear filters/i,
      });
      await userEvent.click(clearButton);

      // Should show all tasks again
      await waitFor(() => {
        expect(screen.getByText("High Priority Task")).toBeInTheDocument();
      });
      expect(screen.getByText("Medium Priority Task")).toBeInTheDocument();
      expect(screen.getByText("Low Priority Task")).toBeInTheDocument();
    });

    it("should handle concurrent task updates", async () => {
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

      render(<TaskDashboard />, { store });

      await waitFor(() => {
        expect(screen.getByText("Task 1")).toBeInTheDocument();
      });
      expect(screen.getByText("Task 2")).toBeInTheDocument();

      // Update both tasks simultaneously
      const allStatusSelects = screen.getAllByDisplayValue("To Do");
      const statusSelects = allStatusSelects.filter(select => select.getAttribute('style')?.includes('min-width: 120px'));
      await userEvent.selectOptions(statusSelects[0], "in-progress");
      await userEvent.selectOptions(statusSelects[1], "done");

      // Wait for both updates
      await waitFor(() => {
        expect(mockTasksAPI.updateTaskStatus).toHaveBeenCalledTimes(2);
      });

      // Verify both tasks are updated
      await waitFor(() => {
        expect(statusSelects[0]).toHaveValue("in-progress");
      });
      expect(statusSelects[1]).toHaveValue("done");
    });
  });
});
