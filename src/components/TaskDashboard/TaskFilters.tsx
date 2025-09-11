import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilters,
  selectUniqueAssignees,
} from "../../features/tasks/tasksSelectors";
import { setFilter, clearFilters } from "../../features/tasks/tasksSlice";
import { useColorModeValue } from "../ui/color-mode";

const TaskFilters: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const assignees = useSelector(selectUniqueAssignees);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.300");

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
            <Text fontSize="sm" fontWeight="medium" mb={2} color={labelColor}>
              Status
            </Text>
            <select
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
            <Text fontSize="sm" fontWeight="medium" mb={2} color={labelColor}>
              Assignee
            </Text>
            <select
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
            <Box alignSelf="end">
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
