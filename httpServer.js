import http from "http";
import fs from "fs";
import path from "path";

const tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress",
  },
];

const server = http.createServer((req, res) => {
  // Home route
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Employee Task Management</h1>");
  }

  // Get all tasks
  else if (req.url === "/tasks" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));
  }

  // About route
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>About</h1><p>Employee Task Management Application</p>");
  }

  // Add new task
  else if (req.url === "/add-task" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        const { id, taskName, assignedTo, status } = newTask;

        if (id === undefined || !taskName || !assignedTo || !status) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "All required fields are necessary" }),
          );
          return;
        }

        if (tasks.some((task) => task.id === id)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Task ID already exists" }));
          return;
        }

        tasks.push(newTask);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Task added successfully",
            task: newTask,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    });
  }

  // Serve HTML using FS module
  else if (req.url === "/home" && req.method === "GET") {
    const filePath = path.join(process.cwd(), "public", "index.html");

    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading HTML file");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // Invalid routes
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
