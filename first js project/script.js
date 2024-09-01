
const tasksList = document.getElementById("tasks-list");
const notDoneTasks = document.getElementById("not-done-tasks");
const doneTasks = document.getElementById("done-tasks");
let tasks;

fetch('./todos.json')
  .then(response => response.text())
  .then(data => {
    tasks = JSON.parse(data);
    console.log(tasks);
    tasks.forEach(task => { addTask(task.text, task.completed); });
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

//writing the new task to the file
function updateFile(task) {
  tasks.push({ text: task, completed: false });
  const data = JSON.stringify(tasks);
  fetch('./todos.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
