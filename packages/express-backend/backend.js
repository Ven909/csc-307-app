// backend.js
// This is a simple Express.js server that serves a list of users.
// It allows you to get a list of users, add a new user, delete a user, and find users by name or job.

import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(cors());
app.use(express.json());

// ID generator function
const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (name) => {
  return users["users_list"].filter(
    (user) => user["job"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  user.id = generateRandomId(); // Assign a random ID to the user
  const new_user = { "id": user.id, "name": user.name, "job": user.job };
  users["users_list"].push(new_user);
  return new_user;
};

const deleteUser = (id) => {
  users["users_list"] = users["users_list"].filter(
    (user) => user["id"] !== id
  );
  return users["users_list"];
}

function getUsersByNameAndJob(name, job) {
  return users.users_list.filter((user) => user.name === name && user.job === job);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  if (!userToAdd || !userToAdd.name || !userToAdd.job) {
    // Return 400 Bad Request if the user data is incomplete
    res.status(400).send("Invalid user data.");
    return;
  }
  const addedUser = addUser(userToAdd); // Add user with a generated ID
  res.status(201).send(addedUser); // 201 Created for successful addition
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const userExists = findUserById(id);
  if (!userExists) {
    // Return 404 Not Found if the user doesn't exist
    res.status(404).send("Resource not found.");
    return;
  }
  deleteUser(id);
  res.status(204).send(); // 204 No Content for successful deletion
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name != undefined && job != undefined) {
    let result = getUsersByNameAndJob(name, job);
    if (result.length === 0) {
      // Return 404 Not Found if no users match the query
      res.status(404).send("No users found with the specified name and job.");
    } else {
      res.status(200).send(result); // 200 OK for successful retrieval
    }
  }
  else if (name != undefined && job === undefined) {
    let result = findUserByName(name);
    if (result.length === 0) {
      res.status(404).send("No users found with the specified name.");
    } else {
      res.status(200).send(result);
    }
  }
  else if (name === undefined && job != undefined) {
    let result = findUserByJob(job);
    if (result.length === 0) {
      res.status(404).send("No users found with the specified job.");
    }
    else {
      res.status(200).send(result);
    }
  }
  else {
    res.send(users);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});