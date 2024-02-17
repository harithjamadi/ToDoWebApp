const express = require('express');
const router = express.Router();
const Task = require('../model/task');
const path = require('path');

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    res.redirect('/login');
};

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userTasks = await Task.find({ username: req.user.username });
        const filePath = path.join(__dirname, '../view/dashboard.ejs');
        res.render('dashboard', { user: req.user, tasks: userTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/api/tasks', isAuthenticated, async (req, res) => {
    try {
        const { title, reminderDate, reminderTime } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is a required field.' });
        }

        const formattedReminderDate = new Date(reminderDate).toLocaleDateString('en-GB');

        const newTask = {
            title,
            reminderDate: formattedReminderDate,
            reminderTime,
            username: req.user.username,
        };

        const savedTask = await Task.create(newTask);

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/api/tasks/:taskId', isAuthenticated, async (req, res) => {
    try {
        const { title, reminderDate, reminderTime } = req.body;
        const taskId = req.params.taskId;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, reminderDate, reminderTime },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/api/tasks/:taskId', isAuthenticated, async (req, res) => {
    try {
        const taskId = req.params.taskId;

        await Task.findByIdAndDelete(taskId);

        res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
