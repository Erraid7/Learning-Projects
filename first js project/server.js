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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
