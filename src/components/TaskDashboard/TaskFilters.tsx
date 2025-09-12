import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilters,
  selectUniqueAssignees,
} from "../../features/tasks/tasksSelectors";
import { setFilter, clearFilters } from "../../features/tasks/tasksSlice";
import { useTheme } from "next-themes";

  const TaskFilters: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const assignees = useSelector(selectUniqueAssignees);
    const { theme } = useTheme();

    // Color mode values
    const isDark = theme === 'dark';
    const bgColor = isDark ? "gray.800" : "white";
    const borderColor = isDark ? "gray.600" : "gray.200";
    const textColor = isDark ? "gray.200" : "gray.700";
    const labelColor = isDark ? "gray.300" : "gray.600";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter({ status: e.target.value }));
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter({ assignee: e.target.value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.status || filters.assignee;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Filter Tasks
        </Text>

        <Box display="flex" gap={4} flexWrap="wrap">
          <Box minW="200px">
            <label htmlFor="status-filter" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: labelColor, display: 'block' }}>
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={handleStatusChange}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                border: "0.5px solid",
                borderColor,
                borderRadius: "6px",
                width: "100%",
              }}
              className="task-select"
            >
              <option value="">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </Box>

          <Box minW="200px">
            <label htmlFor="assignee-filter" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: labelColor, display: 'block' }}>
              Assignee
            </label>
            <select
              id="assignee-filter"
              value={filters.assignee}
              onChange={handleAssigneeChange}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "0.5px solid",
                borderColor,
                width: "100%",
              }}
              className="task-select"
            >
              <option value="">All assignees</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </Box>

          {hasActiveFilters && (
            <Box alignSelf="flex-end">
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskFilters;
