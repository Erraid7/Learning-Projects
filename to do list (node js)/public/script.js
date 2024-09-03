
const tasksList = document.getElementById("tasks-list");
const notDoneTasks = document.getElementById("not-done-tasks");
const doneTasks = document.getElementById("done-tasks");
let tasks;

fetch('/tasks')
  .then(response => response.json())
  .then(tasks => {
    tasks.forEach(task => {
      addTask(task);
    });
  })
  .catch(error => console.error(error));


tasksList.addEventListener("click", function (e) {
  if (e.target.classList.contains('custom-checkbox-button')) {
    e.target.classList.toggle("checked");
    if (e.target.classList.contains("checked")) {
      e.target.parentElement.style.textDecoration = "line-through";
      notDoneTasks.removeChild(e.target.parentElement); 
      document.getElementById("done-tasks").appendChild(e.target.parentElement);
    } else {
      e.target.parentElement.style.textDecoration = "none";
      doneTasks.removeChild(e.target.parentElement);
      document.getElementById("not-done-tasks").appendChild(e.target.parentElement);
    }
  } else if (e.target.classList.contains('delete-icon')) {
    e.target.parentElement.remove();
  }

});


//adding a new task to the list
function addTask(task) {
  const newTask = document.createElement("li");
  newTask.setAttribute("data-id", task.id); // Store the ID

  newTask.innerHTML = `
    <button class="custom-checkbox-button" onclick="toggleTaskStatus(${task.id})"></button>
    <span class="task">${task.text}</span>
    <span class="delete-icon" onclick="deleteTask(${task.id})"></span>
  `;
  if(task.completed) {
    doneTasks.appendChild(newTask);
    const checkboxButton = newTask.querySelector(".custom-checkbox-button");
    checkboxButton.classList.add("checked");
  }
  else {
    notDoneTasks.appendChild(newTask);
  }
}

//generating a unique id for the task
function generateUniqueId() {
  return Date.now();
}

// reading the task from the user input
function readTask() {
  const task = document.getElementById("task-input").value;
  if (task) {
    const newTask = {
      id: generateUniqueId(), // Generate a unique ID for the new task
      text: task,
      completed: false // Newly created tasks are incomplete by default
    };
    addTask(newTask);
    document.getElementById("task-input").value = "";
    updateFile(newTask);
  } else {
    alert("Please enter a task");
  }
}

//updating the file with the new task

function updateFile(task) {
  fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Task added successfully
  })
  .catch(error => console.error('Error:', error));
}

function toggleTaskStatus(taskId) {
  fetch(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Task updated successfully
  })
  .catch(error => console.error('Error:', error));
}

function deleteTask(taskId) {
  fetch(`/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Task deleted successfully
    document.querySelector(`li[data-id="${taskId}"]`).remove(); // Remove task from DOM
  })
  .catch(error => console.error('Error:', error));
}

