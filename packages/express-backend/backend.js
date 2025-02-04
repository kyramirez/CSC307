import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService
    .newGetUsers(name, job)
    .then((users) => {
      if (users.length > 0) {
        res.send({ users_list: users });
      } else {
        res.status(404).send("No users found");
      }
    })
    .catch((error) => res.status(500).send(error.message));
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .findUserById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("Resource not found");
      }
    })
    .catch((error) => res.status(500).send(error.message));
});

app.post("/users", (req, res) => {
  const { name, job } = req.body;
  if (!name || typeof name !== "string" || !job || typeof job !== "string") {
    res.status(409).send("Invalid input");
    return;
  }
  userService
    .addUser(req.body)
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => res.status(500).send(error.message));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .deleteUserById(id)
    .then((user) => {
      if (user) {
        res.status(201).send("User deleted");
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch((err) => res.status(500).send(err.message));
});
