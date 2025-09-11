import React from "react";
import { Box, Heading, Text, Badge, Spinner } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updateTaskStatusRequest } from "../../features/tasks/tasksSlice";
import { Task } from "../../api/tasksApi";
import { useColorModeValue } from "../ui/color-mode";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useDispatch();

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  const getPriorityColor = (priority: Task["priority"]): string => {
    const colors: Record<Task["priority"], string> = {
      critical: "red",
      high: "orange",
      medium: "yellow",
      low: "green",
    };
    return colors[priority] || "gray";
  };

  const getStatusColor = (status: Task["status"]): string => {
    const colors: Record<Task["status"], string> = {
      todo: "gray",
      "in-progress": "blue",
      done: "green",
    };
    return colors[status] || "gray";
  };

  const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task["status"];
    dispatch(
      updateTaskStatusRequest({
        taskId: task.id,
        newStatus,
        originalStatus: task.status,
      })
    );
  };

  return (
    <Box
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      w="100%"
      h="100%"
      boxShadow="sm"
    >
      <Box pb={2}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Heading size="md" color={textColor}>
            {task.title}
          </Heading>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Badge
              colorScheme={getPriorityColor(task.priority)}
              variant="solid"
              borderRadius="full"
              px={3}
              py={1}
            >
              {task.priority}
            </Badge>
            <Badge
              colorScheme={getStatusColor(task.status)}
              variant="outline"
              borderRadius="full"
              px={3}
              py={1}
            >
              {task.status.replace("-", " ")}
            </Badge>
          </Box>
        </Box>
      </Box>

      <Box pt={0}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Text fontSize="sm" color={labelColor}>
            <strong>Assignee:</strong> {task.assignee}
          </Text>

          <Text fontSize="sm" color={labelColor}>
            <strong>Due Date:</strong>{" "}
            <Text
              as="span"
              color={isOverdue(task.dueDate) ? "red.500" : labelColor}
              fontWeight={isOverdue(task.dueDate) ? "bold" : "normal"}
            >
              {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue(task.dueDate) && " (Overdue)"}
            </Text>
          </Text>

          <Box height="1px" bg={dividerColor} />

          <Box w="100%">
            <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
              Update Status:
            </Text>
            <Box display="flex" gap={2}>
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={task.isUpdating}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  border: "0.5px solid",
                  borderRadius: "6px",
                  minWidth: "120px",
                  borderColor,
                }}
                className="task-select"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {task.isUpdating && <Spinner size="sm" color="blue.500" />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCard;
