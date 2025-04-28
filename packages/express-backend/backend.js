import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config({ path: "./.env" });

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to DB "users"
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// GET all users or filter by name and/or job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService
  .getUsers(name, job)
  .then(result => {
    res.send({ users_list: result });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send("An error occurred while fetching users.");
  });
});

// GET a user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error.");
    });
});

// POST a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  console.log("Received user from frontend:", userToAdd); // Debugging

  if (!userToAdd || !userToAdd.name || !userToAdd.job) {
    res.status(400).send("Invalid user data.");
    return;
  }

  userService
    .addUser(userToAdd)
    .then((newUser) => {
      console.log("User added to database:", newUser); // Debugging
      res.status(201).send(newUser); // Return the newly created user
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error.");
    });
});

// DELETE a user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUser(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send(); // No Content
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error: deletion failed.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});