import CreateTask from '../../components/CreateTask';
import TaskList from '../../components/TaskList';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <CreateTask />
      <TaskList />
    </div>
  );
}
