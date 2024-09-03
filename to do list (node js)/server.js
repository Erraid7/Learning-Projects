const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get tasks (for the initial fetch request)
app.get('/tasks', (req, res) => {
  const filePath = path.join(__dirname, 'todos.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read tasks' });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to update tasks
app.post('/tasks', (req, res) => {
  const newTask = req.body;

  const filePath = path.join(__dirname, 'todos.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read tasks' });
    }

    const tasks = JSON.parse(data);


    tasks.push(newTask);

    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update tasks' });
      }
      res.status(200).json({ message: 'Task added successfully' });
    });
  });
});


// PUT endpoint to update the status of a task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id); // Extract the task ID from the URL
  const filePath = path.join(__dirname, 'todos.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read tasks' });
    }

    const tasks = JSON.parse(data);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      task.completed = !task.completed; // Invert the completed status
      fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update task' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});

// DELETE endpoint to remove a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id); // Extract the task ID from the URL
  const filePath = path.join(__dirname, 'todos.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read tasks' });
    }

    let tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1); // Remove the task from the array
      fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete task' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
      });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
