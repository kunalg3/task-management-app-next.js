import dbConnect from '../../../utils/dbConnect';
import Task from '../../../models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      return handlePut(req, res, id); // Handle updating a task
    case 'DELETE':
      return handleDelete(req, res, id); // Handle deleting a task
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Handler for PUT request - Update task
async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) {
  try {
    const { status, title, description } = req.body;

    // Validate status field if it exists
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error); // Log the error for debugging
    return res.status(400).json({ success: false, message: 'Failed to update task' });
  }
}

// Handler for DELETE request - Delete task
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) {
  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error); // Log the error for debugging
    return res.status(400).json({ success: false, message: 'Failed to delete task' });
  }
}
