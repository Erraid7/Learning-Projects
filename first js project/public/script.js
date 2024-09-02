
const tasksList = document.getElementById("tasks-list");
const notDoneTasks = document.getElementById("not-done-tasks");
const doneTasks = document.getElementById("done-tasks");
let tasks;

fetch('/tasks')
  .then(response => response.json())
  .then(tasks => {
    tasks.forEach(task => {
      addTask(task.text, task.completed);
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
function addTask(task,status) {
  const newTask = document.createElement("li");
  newTask.innerHTML = `<button class="custom-checkbox-button"></button>
  <span class="task">${task}</span>
  <span class="delete-icon"></span>`;
  if(status){
    doneTasks.appendChild(newTask);
    const checkboxButton = newTask.querySelector(".custom-checkbox-button");
    checkboxButton.classList.add("checked");
  }
  else {
    notDoneTasks.appendChild(newTask);
  }
}

// reading the task from the user input
function readTask() {
  const task = document.getElementById("task-input").value;
  if (task) {
    console.log(task);
    addTask(task);
    document.getElementById("task-input").value = "";
    updateFile(task);
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
    body: JSON.stringify({ text: task, completed: false }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Task added successfully
  })
  .catch(error => console.error('Error:', error));
}

