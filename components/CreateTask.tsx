'use client';

import { useState } from 'react';

export default function CreateTask() {
  const [title, setTitle] = useState<string>(''); // Type for state
  const [description, setDescription] = useState<string>(''); // Type for state
  const [status, setStatus] = useState<string>('pending'); // Adding status state with default 'pending'

  // Define the handleSubmit function with proper typing for event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }), // Include status in the payload
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setStatus('pending'); // Reset status after form submission
    } else {
      console.error('Failed to create task');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          required // Add required validation for better UX
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          rows={4}
        />
        
        {/* Status dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
