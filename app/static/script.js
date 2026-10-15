const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const message = document.getElementById("message");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("tasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                Number.isInteger(task.id) &&
                typeof task.title === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

let nextId = tasks.reduce(
    (max, task) => Math.max(max, task.id),
    0
) + 1;

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounts() {
    const completed = tasks.filter(
        task => task.completed
    ).length;

    taskCount.textContent =
        `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

    completedCount.textContent =
        `${completed} completed`;
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach((task, index) => {
        const item = document.createElement("li");

        item.className = "task";

        if (task.completed) {
            item.classList.add("done");
        }

        const number = document.createElement("span");
        number.className = "task-number";
        number.textContent = `${index + 1}.`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.title} as completed`
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(
                currentTask => currentTask.id !== task.id
            );

            saveTasks();
            renderTasks();
            message.textContent = "Task deleted successfully.";
        });

        item.append(number, checkbox, title, deleteButton);
        taskList.appendChild(item);
    });

    updateCounts();
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const title = input.value.trim();

    if (!title) {
        message.textContent = "Please enter a task.";
        return;
    }

    tasks.push({
        id: nextId++,
        title: title,
        completed: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
    message.textContent = "Task added successfully.";
    input.focus();
});

renderTasks();