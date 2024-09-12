const express = require('express');
const fs = require('fs');
const path = require('path');
const {connect, getDB} = require('./db');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');


const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// connect to mongodb and start the server
let db;

connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  db = getDB();
});


// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get tasks (for the initial fetch request)
app.get('/tasks', (req, res) => {
  db.collection('tasks').find().toArray()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      console.error('Error getting tasks', err);
      res.status(500).json({ error: 'Failed to get tasks' });
    });
});

// Endpoint to add new task to db
app.post('/tasks', (req, res) => {
  const newTask = req.body;

  db.collection('tasks').insertOne(newTask)
    .then((result) => {
      db.collection('tasks').findOne({ _id: result.insertedId })
        .then((task) => {
          res.status(201).json({ message: 'Task added successfully' , taskId : task._id});
        })
    })
    .catch((err) => {
      console.error('Error adding task', err);
      res.status(500).json({ error: 'Failed to add task' });
    });
 
});


// PATCH endpoint to update the status of a task
app.patch('/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Extract the task ID from the URL

  if (ObjectId.isValid(taskId)) {
    db.collection('tasks').findOne({ _id: new ObjectId(taskId) })  // Use 'new ObjectId()'
      .then((task) => {
        if (task) {
          return db.collection('tasks').updateOne({ _id: new ObjectId(taskId) }, { $set: { completed: !task.completed } });
        } else {
          res.status(404).json({ error: 'Task not found' });
        }
      })
      .then(() => res.json({ message: 'Task updated successfully' }))
      .catch((err) => {
        console.error('Error updating task', err);
        res.status(500).json({ error: 'Failed to update task' });
      });
  } else {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

// DELETE endpoint to remove a task
// DELETE endpoint to remove a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Extract the task ID from the URL

  if (ObjectId.isValid(taskId)) {
    db.collection('tasks').findOne({ _id: new ObjectId(taskId) })  // Use 'new ObjectId()'
      .then((task) => {
        if (task) {
          return db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
        } else {
          res.status(404).json({ error: 'Task not found' });
        }
      })
      .then(() => res.json({ message: 'Task deleted successfully' }))
      .catch((err) => {
        console.error('Error deleting task', err);
        res.status(500).json({ error: 'Failed to delete task' });
      });
  } else {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});


