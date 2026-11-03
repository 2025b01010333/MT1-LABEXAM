import express from "express";

// Create Express application
const app = express();

// Middleware to read JSON request body
app.use(express.json());

// Sample employee tasks
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 3,
    taskName: "Testing Website",
    assignedTo: "Amit Kumar",
    status: "Completed",
    priority: "Low",
  },
];

// 1. GET API - Retrieve all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// 2. GET API - Retrieve task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(200).json(task);
});

// 3. POST API - Add a new task
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (id === undefined || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (tasks.some((t) => t.id === id)) {
    return res.status(409).json({
      message: "Task ID already exists",
    });
  }

  const newTask = {
    id,
    taskName,
    assignedTo,
    status,
    priority,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task added successfully",
    task: newTask,
  });
});

// 4. PUT API - Update an existing task
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  task.taskName = taskName;
  task.assignedTo = assignedTo;
  task.status = status;
  task.priority = priority;

  res.status(200).json({
    message: "Task updated successfully",
    task: task,
  });
});

// 5. DELETE API - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Start Express server on port 4000
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
