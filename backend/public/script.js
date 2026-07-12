console.log("script.js loaded");

async function fetchTasks() {
  const res = await fetch("http://localhost:3000/tasks");
  const tasks = await res.json();
  renderTasks(tasks);
}

async function addTask() {
  const text = document.getElementById("taskInput").value;
  const category = document.getElementById("categorySelect").value;
  if (!text) return;

  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, category })
  });

  document.getElementById("taskInput").value = "";
  fetchTasks();
}

async function toggleTask(id, done) {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !done })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
  fetchTasks();
}

function renderTasks(tasks) {
  const dailyList = document.getElementById("dailyList");
  const longtermList = document.getElementById("longtermList");
  dailyList.innerHTML = "";
  longtermList.innerHTML = "";

  let completed = 0;

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) {
      li.style.textDecoration = "line-through";
      completed++;
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.done ? "↩ Undo" : "✔ Done";
    toggleBtn.onclick = () => toggleTask(task._id, task.done);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌ Delete";
    delBtn.onclick = () => deleteTask(task._id);

    li.appendChild(toggleBtn);
    li.appendChild(delBtn);

    if (task.category === "daily") {
      dailyList.appendChild(li);
    } else {
      longtermList.appendChild(li);
    }
  });

  // Progress bar update
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;
  document.getElementById("progressBar").style.width = progress + "%";
}

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

fetchTasks();
