import dbConnect from '../../../utils/dbConnect';
import Task from '../../../models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return handlePost(req, res); // Handle creating a task
    case 'GET':
      return handleGet(req, res); // Handle getting all tasks
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Handler for POST request - Create new task
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, status } = req.body;

    // Validation: Ensure status is one of the allowed values
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const newTask = new Task({ title, description, status });
    await newTask.save();

    return res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error('Error creating task:', error); // Log the error for debugging
    return res.status(400).json({ success: false, message: 'Failed to create task' });
  }
}

// Handler for GET request - Get all tasks
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = await Task.find({});
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error); // Log the error for debugging
    return res.status(400).json({ success: false, message: 'Failed to fetch tasks' });
  }
}
