import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { selectAllTasks } from '../../features/tasks/tasksSelectors';
import { updateTaskStatusRequest } from '../../features/tasks/tasksSlice';
import { Task } from '../../api/tasksApi';
import DraggableTaskCard from './DraggableTaskCard';

interface KanbanBoardProps {
  onTaskClick?: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const { theme } = useTheme();

  // Color mode values
  const isDark = theme === 'dark';
  const columnBg = isDark ? 'gray.800' : 'white';
  const borderColor = isDark ? 'gray.600' : 'gray.200';
  const textColor = isDark ? 'gray.200' : 'gray.700';
  const labelColor = isDark ? 'gray.300' : 'gray.600';

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped = {
      todo: [] as Task[],
      'in-progress': [] as Task[],
      done: [] as Task[],
    };

    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    console.log('Drag end:', { active: active.id, over: over?.id, overData: over?.data?.current });

    if (!over) {
      console.log('No drop target');
      return;
    }

    const taskId = active.id as number;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log('Task not found');
      return;
    }

    // Try to determine the new status from the drop target
    let newStatus: Task['status'];
    
    // Check if over.id is a valid status (column ID)
    if (over.id === 'todo' || over.id === 'in-progress' || over.id === 'done') {
      newStatus = over.id as Task['status'];
    } else {
      // If dropped on a task, find which column it belongs to
      const droppedTask = tasks.find(t => t.id === over.id);
      if (droppedTask) {
        newStatus = droppedTask.status;
        console.log('Dropped on task, using its status:', newStatus);
      } else {
        // Try to find the column by checking the parent element
        const columnElement = document.querySelector(`[data-column-id]`);
        if (columnElement) {
          const columnId = columnElement.getAttribute('data-column-id');
          if (columnId === 'todo' || columnId === 'in-progress' || columnId === 'done') {
            newStatus = columnId as Task['status'];
          } else {
            console.log('Invalid column ID:', columnId);
            return;
          }
        } else {
          console.log('No valid column found');
          return;
        }
      }
    }

    console.log('Task ID:', taskId, 'Current Status:', task.status, 'New Status:', newStatus);

    if (task.status === newStatus) {
      console.log('Status unchanged');
      return;
    }

    console.log('Updating task status:', { taskId, from: task.status, to: newStatus });

    dispatch(
      updateTaskStatusRequest({
        taskId,
        newStatus,
        originalStatus: task.status,
      })
    );
  };

  const getStatusColor = (status: Task['status']): string => {
    const colors: Record<Task['status'], string> = {
      todo: 'gray',
      'in-progress': 'blue',
      done: 'green',
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status: Task['status']): string => {
    const labels: Record<Task['status'], string> = {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
    };
    return labels[status] || status;
  };

  const columns = [
    { id: 'todo' as const, title: 'To Do', tasks: tasksByStatus.todo },
    { id: 'in-progress' as const, title: 'In Progress', tasks: tasksByStatus['in-progress'] },
    { id: 'done' as const, title: 'Done', tasks: tasksByStatus.done },
  ];

  // Droppable column component
  const DroppableColumn: React.FC<{ column: typeof columns[0] }> = ({ column }) => {
    const { setNodeRef } = useDroppable({
      id: column.id,
    });

    return (
      <Box
        ref={setNodeRef}
        bg={columnBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={4}
        minH="500px"
        data-column-id={column.id}
      >
        <VStack align="stretch" spacing={4} h="full">
          <HStack justify="space-between" align="center">
            <Heading size="md" color={textColor}>
              {column.title}
            </Heading>
            <Badge
              colorScheme={getStatusColor(column.id)}
              variant="solid"
              borderRadius="full"
              px={3}
              py={1}
            >
              {column.tasks.length}
            </Badge>
          </HStack>

          <Box flex="1" minH="400px">
            <SortableContext
              items={column.tasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing={3} align="stretch">
                {column.tasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))}
                {column.tasks.length === 0 && (
                  <Box
                    p={8}
                    textAlign="center"
                    color={labelColor}
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="md"
                  >
                    <Text fontSize="sm">
                      No tasks in {getStatusLabel(column.id).toLowerCase()}
                    </Text>
                  </Box>
                )}
              </VStack>
            </SortableContext>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={6}
        minH="600px"
      >
        {columns.map((column) => (
          <DroppableColumn key={column.id} column={column} />
        ))}
      </Box>

      <DragOverlay>
        {activeTask ? (
          <Box
            transform="rotate(5deg)"
            boxShadow="xl"
            borderRadius="lg"
            opacity={0.9}
          >
            <DraggableTaskCard task={activeTask} isDragging />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
