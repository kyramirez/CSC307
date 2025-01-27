import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
    {
      id: "qwe123",
      job: "Zookeeper",
      name: "Cindy",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  let result = users.users_list;
  if (name) {
    result = result.filter((user) => user.name === name);
  }
  if (job) {
    result = result.filter((user) => user.job === job);
  }
  if (result.length > 0) {
    res.send({ users_list: result });
  } else {
    res.status(404).send("No users found.");
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  user.id = generateId();
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const { name, job } = req.body;
  if (!name || typeof name !== "string" || !job || typeof job !== "string") {
    res.status(409).send();
    return;
  }
  const newUser = addUser(req.body);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const original = users.users_list.length;
  const filteredLst = users.users_list.filter((user) => user.id !== id);

  if (filteredLst.length === original) {
    res.status(404).send("User not found.");
  } else {
    users.users_list = filteredLst;
    res.send();
  }
});

const generateId = () => {
  return Math.random().toString(32).substring(2, 10); // generating random
};
