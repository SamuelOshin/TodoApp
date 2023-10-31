//Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
const error = document.getElementById("error")
const countValue = document.querySelector("count-value")

let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;
let taskCount = 0;

const displayCount = (taskCount) => {
  countValue.innerText = taskCount;
}

//Addtask
const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";
  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  // Create a new task element 
  const task = document.createElement("div");
  task.classList.add("task");

  const taskSpan = document.createElement("span");
  taskSpan.classList.add("taskname");
  taskSpan.textContent = taskName;

  // task.appendChild(checkbox);
  task.appendChild(taskSpan);

  // Append the task to the tasksDiv
  tasksDiv.appendChild(task);

  // Reset the input field
  newTaskInput.value = "";

  // Update the task count
  updateTaskCount();
};


//Function on window load
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

//Function to Display The Tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  // Clear the tasks
  tasksDiv.innerHTML = "";

  // Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-check");

    const taskSpan = document.createElement("span");
    taskSpan.classList.add("taskname");
    taskSpan.textContent = key.split("_")[1];

    // Local storage would store boolean as a string, so we parse it to a boolean
    if (!JSON.parse(value)) {
      taskInnerDiv.classList.remove("completed");
    } else {
      checkbox.checked = true;
      taskInnerDiv.classList.add("completed");
    }

    taskInnerDiv.appendChild(checkbox);
    taskInnerDiv.appendChild(taskSpan);

    
    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    taskInnerDiv.appendChild(editButton);

    
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    taskInnerDiv.appendChild(deleteButton);

    tasksDiv.appendChild(taskInnerDiv);
  }

  // Update the task count
  updateTaskCount();

  // Enable the edit and delete button functionality
  enableEditAndDeleteButtons();
};

// Function to enable the edit and delete button functionality
const enableEditAndDeleteButtons = () => {
  // Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Disable other edit buttons when one task is being edited
      disableButtons(true);
      // Update input value and remove div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector(".taskname").textContent;
      // Set updateNote to the task that is being edited
      updateNote = parent.id;
      // Remove task
      parent.remove();
    });
  });

  // Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Delete from local storage and remove div
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};


//Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

//Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  //Enable the edit button
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    //Store locally and display from local storage
    if (updateNote == "") {
      //new task
      updateStorage(count, newTaskInput.value, false);
    } else {
      //update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";

     // Call the function to update the task count and text
     updateTaskCount();
  }
});

// Function to update the task count and the pending tasks text
const updateTaskCount = () => {
  const countValue = document.querySelector(".count-value");
  const tasks = document.querySelectorAll(".task");
  const completedTasks = document.querySelectorAll(".completed");
  const taskCount = tasks.length - completedTasks.length;

  countValue.textContent = taskCount;
  const taskWord = taskCount === 1 ? "task" : "tasks";
  const pendingTaskText = `You have <span class="count-value">${taskCount}</span> ${taskWord} to complete`;
  document.querySelector("#pending-task").innerHTML = pendingTaskText;
};

// Attach a click event listener to the #tasks container to handle checkbox clicks
tasksDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("task-check")) {
    const task = event.target.parentElement; // Get the task div
    if (event.target.checked) {
      task.classList.add("completed");
      const taskName = task.querySelector(".taskname");
      taskName.style.textDecoration = "line-through";
    } else {
      task.classList.remove("completed");
      const taskName = task.querySelector(".taskname");
      taskName.style.textDecoration = "none";
    }
    // Update the task count when a checkbox is clicked
    updateTaskCount();
  }
});




