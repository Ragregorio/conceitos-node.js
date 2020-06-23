const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId);
app.use('/repositories', countRequest);

const repositories = [];

function countRequest(request, response, next) {
    const { method, url } = request;
    const log = `[${method.toUpperCase()}] ${url}`;

    console.log(log);
    next();
}

function validateRepositoryId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "Invalid id" });
    }
    return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {

    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        url,
        title,
        techs,
        likes: 0
    }

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repository = repositories.find(repository => repository.id == id);

    if (!repository) {
        return response.status(400).send();
    }

    repository.title = title;
    repository.url = url;
    repository.techs = techs;

    return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository not found" });
    }

    repositories.slice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repository = repositories.find(repository => repository.id === id);

    if (!repository) {
        return response.status(400).send();
    }

    repository.likes += 1;
    return response.json(repository);
});

module.exports = app;