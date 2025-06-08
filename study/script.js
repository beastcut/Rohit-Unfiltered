// ----------------- THEME TOGGLE -----------------
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "dark") {
  html.setAttribute("data-theme", "dark");
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  if (html.getAttribute("data-theme") === "dark") {
    html.setAttribute("data-theme", "light");
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});

// ----------------- TASK MANAGEMENT -----------------
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

function loadTasks() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = Date.now();
  const fresh = stored.filter(task => now - task.timestamp < 86400000); // 24 hours
  localStorage.setItem("tasks", JSON.stringify(fresh));
  return fresh;
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `p-2 rounded shadow flex justify-between items-center ${
      task.completed ? "bg-green-200" : "bg-white"
    }`;

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.completed ? "line-through text-gray-600" : "";

    const btns = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✓";
    doneBtn.className = "mr-2 px-2 py-1 bg-green-500 text-white rounded";
    doneBtn.onclick = () => {
      tasks[index].completed = true;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "px-2 py-1 bg-red-500 text-white rounded";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    };

    btns.appendChild(doneBtn);
    btns.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(btns);
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = loadTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

addTaskBtn.addEventListener("click", () => {
  const value = taskInput.value.trim();
  if (value) {
    const tasks = loadTasks();
    tasks.push({ text: value, completed: false, timestamp: Date.now() });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks();
  }
});

renderTasks();

// ----------------- CUSTOM POMODORO TIMER -----------------
let timer = 1500;
let running = false;
let interval = null;

const display = document.getElementById("timer-display");
const toggleBtn = document.getElementById("toggle-timer");
const customInput = document.getElementById("custom-minutes");
const stopSoundBtn = document.getElementById("stop-sound-btn");

const alarmSound = new Audio("https://pixabay.com/sound-effects/alarm-327234/");
alarmSound.loop = true;

function updateTimerDisplay() {
  const min = Math.floor(timer / 60).toString().padStart(2, "0");
  const sec = (timer % 60).toString().padStart(2, "0");
  display.textContent = `${min}:${sec}`;
}

function notifyUser() {
  if (Notification.permission === "granted") {
    new Notification("⏰ Time's up! Take a break.");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("⏰ Time's up! Take a break.");
      }
    });
  }
}

toggleBtn.addEventListener("click", () => {
  if (!running && customInput.value) {
    timer = parseInt(customInput.value) * 60;
    updateTimerDisplay();
  }

  running = !running;
  toggleBtn.textContent = running ? "Pause" : "Start";
  toggleBtn.className = `mt-4 px-6 py-2 rounded-full text-white transition ${
    running ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
  }`;

  if (running) {
    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateTimerDisplay();
      } else {
        clearInterval(interval);
        running = false;
        updateTimerDisplay();
        notifyUser();
        alarmSound.play();
        stopSoundBtn.classList.remove("hidden");
      }
    }, 1000);
  } else {
    clearInterval(interval);
  }
});

stopSoundBtn.addEventListener("click", () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopSoundBtn.classList.add("hidden");
});

updateTimerDisplay();
