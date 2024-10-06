'use client';

import { useState,useEffect } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);  // To track the task being edited

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data.tasks);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchTasks();
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);  // Set task to edit mode
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { title, description } = editTask;

    const res = await fetch(`/api/tasks/${editTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setEditTask(null);  // Exit edit mode after success
      fetchTasks();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="border-b py-2 flex justify-between">
            <div>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </div>
            <div>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white p-2 ml-4"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white p-2 ml-4"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editTask && (
        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
          <h3 className="text-xl font-bold">Edit Task</h3>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            className="border p-2 w-full"
          />
          <textarea
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-green-500 text-white p-2">
            Update Task
          </button>
        </form>
      )}
    </div>
  );
}
