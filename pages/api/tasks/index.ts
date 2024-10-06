import dbConnect from '../../../utils/dbConnect';
import Task from '../../../models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { title, description } = req.body;
      const newTask = new Task({ title, description });
      await newTask.save();
      res.status(201).json({ success: true, task: newTask });
    } catch (error) {
      console.error(error); // Optional: log the error for debugging
      res.status(400).json({ success: false });
    }
  } else if (req.method === 'GET') {
    try {
      const tasks = await Task.find({});
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error(error); // Optional: log the error for debugging
      res.status(400).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
