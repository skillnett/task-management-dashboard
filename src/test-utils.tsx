import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { RootState } from "./store";
import tasksReducer from "./features/tasks/tasksSlice";
import { watchTasksSaga } from "./features/tasks/tasksSaga";
import { Task } from "./api/tasksApi";

// Mock store for testing
const createMockStore = (preloadedState?: Partial<RootState>) => {
  const sagaMiddleware = createSagaMiddleware();
  
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(sagaMiddleware),
    preloadedState: preloadedState as RootState,
  });

  // Run the saga middleware
  sagaMiddleware.run(watchTasksSaga);
  
  return store;
};

// Custom render function that includes Redux Provider
const AllTheProviders = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store?: any;
}) => {
  const mockStore = store || createMockStore();
  return <Provider store={mockStore}>{children}</Provider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { store?: any }
) =>
  render(ui, {
    wrapper: (props) => <AllTheProviders {...props} store={options?.store} />,
    ...options,
  });

// Mock task data for testing
export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Test Task 1",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2024-02-15",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Test Task 2",
    status: "in-progress",
    priority: "medium",
    assignee: "Jane Smith",
    dueDate: "2024-02-20",
    createdAt: "2024-02-02T10:00:00Z",
  },
  {
    id: 3,
    title: "Test Task 3",
    status: "done",
    priority: "low",
    assignee: "John Doe",
    dueDate: "2024-02-10",
    createdAt: "2024-02-03T10:00:00Z",
  },
];

// Mock initial state
export const mockInitialState: RootState = {
  tasks: {
    tasks: mockTasks,
    loading: false,
    filterLoading: false,
    error: null,
    filters: {
      status: "",
      assignee: "",
    },
    retryCount: 0,
  },
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
export { createMockStore };
