import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.status) {
      match.status = req.query.status;
    }
    if (req.query.category) {
      match.category = req.query.category;
    }
    if (req.query.search) {
      match.title = { $regex: req.query.search, $options: 'i' };
    }

    const tasks = await Task.find({
      ...match,
      owner: req.user._id
    }).sort(sort);

    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

export default router;