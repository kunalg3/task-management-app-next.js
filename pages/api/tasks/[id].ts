import dbConnect from '../../../utils/dbConnect';
import Task from '../../../models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
      console.error(error); // Optional: log the error for debugging
      res.status(400).json({ success: false });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Task.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error); // Optional: log the error for debugging
      res.status(400).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
