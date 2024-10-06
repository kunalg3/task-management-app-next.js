'use client';

import { useState, useEffect } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="border-b py-2">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
