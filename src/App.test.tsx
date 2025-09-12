import { screen } from "@testing-library/react";
import { render, createMockStore } from "./test-utils";
import App from "./App";


test("renders task management dashboard", () => {
  render(<App />, { store: createMockStore() });
  const dashboardElement = screen.getByText(/task management/i);
  expect(dashboardElement).toBeInTheDocument();
});
