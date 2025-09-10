import { Button, Container, HStack } from "@chakra-ui/react";
import { TaskDashboard } from "./components/TaskDashboard";

function App() {
  return (
    <Container py={[4, 8, 12]}>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>

      <TaskDashboard />
    </Container>
  );
}

export default App;
