// backend.js
// This is a simple Express.js server that serves a list of users.
// It allows you to get a list of users, add a new user, delete a user, and find users by name or job.

import express from "express";

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

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

function getUsersByNameAndJob(name, job) {
  return users.users_list.filter((user) => user.name === name && user.job === job);
}

const deleteUser = (id) => {
  users["users_list"] = users["users_list"].filter(
    (user) => user["id"] !== id
  );
  return users["users_list"];
}

app.use(express.json());

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
  addUser(userToAdd);
  res.send();
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = deleteUser(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name != undefined && job != undefined) {
    let result = getUsersByNameAndJob(name, job);
    res.send(result);
  }
  else if (name != undefined && job === undefined) {
    let result = findUserByName(name);
    res.send(result);
  }
  else {
    res.send(users);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});