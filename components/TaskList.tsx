'use client';

import { useState, useEffect } from 'react';

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editTask && (
        <form onSubmit={handleUpdate} className="space-y-4 mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800">Edit Task</h3>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <textarea
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            rows={4}
          />
          <button type="submit" className="bg-green-500 text-white p-3 w-full rounded-lg hover:bg-green-600 transition">
            Update Task
          </button>
        </form>
      )}
    </div>
  );
}
