const express = require("express");
const cors = require("cors");

const { isUuid } = require("uuidv4");
const Repositories = require("./models/repositories");

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateProjectId);

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title)
    return response.status(400).json({ message: "title is required" });
  if (!url) return response.status(400).json({ message: "url is required" });
  if (!techs)
    return response.status(400).json({ message: "techs is required" });
  if (!Array.isArray(techs))
    return response.status(400).json({ message: "techs needs an array" });

  const repository = new Repositories(title, techs, url);

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const repository = repositories[repositoryIndex];

  if (title) repository.title = title;
  if (url) repository.url = url;
  if (techs && Array.isArray(techs)) repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const repository = repositories[repositoryIndex];

  repository.incrementLikes();

  return response.json(repository);
});

module.exports = app;
