//checking a task from the list
const tasksList = document.getElementById("tasks-list");
const notDoneTasks = document.getElementById("not-done-tasks");
const doneTasks = document.getElementById("done-tasks");


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
function addTask() {
  const task = document.getElementById("task-input").value;
  if (task === "") {
    alert("Please enter a task");
  } else {
    const newTask = document.createElement("li");
    newTask.innerHTML = `<button class="custom-checkbox-button"></button>
    <span class="task">${task}</span>
    <span class="delete-icon"></span>`;
    notDoneTasks.appendChild(newTask);
    document.getElementById("task-input").value = "";
  }
}
