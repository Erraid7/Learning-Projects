
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

  newTask.innerHTML = `
    <button class="custom-checkbox-button" onclick="toggleTaskStatus('${task._id}')"></button>
    <span class="task">${task.text}</span>
    <span class="delete-icon" onclick="deleteTask('${task._id}')"></span>
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


// Reading the task from the user input
async function readTask() {
  const task = document.getElementById("task-input").value;
  
  if (task) {
    const newTask = {
      text: task,
      completed: false // Newly created tasks are incomplete by default
    };
    
    try {
      // Wait for taskId to be returned from updateFile
      const taskId = await updateFile(newTask); 
      
      // Now add the task to the frontend
      addTask({ _id: taskId, ...newTask });

      // Clear the input field
      document.getElementById("task-input").value = "";
    } catch (error) {
      console.error("Error adding task:", error);
    }
  } else {
    alert("Please enter a task");
  }
}

// Updating the server with the new task and returning the task ID
async function updateFile(task) {
  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    console.log(data.message); // Task added successfully
    return data.taskId;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


function toggleTaskStatus(taskId) {
  fetch(`/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Task updated successfully
  })
  .catch(error => console.log('Error:', error));
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
  })
  .catch(error => console.log('Error:', error));
}

