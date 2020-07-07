const express = require("express");
const cors = require("cors");
const { isUuid, uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)){
      return response.status(400).send('Este ID não é válido')
  }

  return next();
}

//Definindo que o Middleware deverá ser chamado para todas as rotas que possuem a estrutura /repositories/:id
app.use('/repositories/:id', validateProjectId);

//Rota para retornar todos os projetos armazenados em repositories
app.get("/repositories", (request, response) => {
  const { projectTitle } = request.query

  const searchProject = projectTitle
    ? repositories.filter(repositories => project.title.icludes(projectTitle))
    : repositories

  return response.status(200).send(searchProject)
});

//Rota para criar um novo project dentro de repositories.
app.post("/repositories", (request, response) => {
  const { ...data } = request.body;

  let identifier = uuid();

  project = { id: identifier, likes: 0, ...data }

  repositories.push(project)
  return response.status(200).send(project);
});

//Rota para atualizar informações de um determinado projeto, as infromações a serem atualizadas são recebidas pelo body. 
//Essa rota garante ainda, que o id e a quantidade de likes mantenham sempre o mesmo valor.
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const projectIdex = repositories.findIndex(repository => repository.id === id);

  if (projectIdex < 0) return response.status(400).send('Project not found')

  repositories[projectIdex] = {
    id: repositories[projectIdex].id,
    likes: repositories[projectIdex].likes,
    title,
    url,
    techs
  }

  return response.status(200).send(repositories[projectIdex]);
});

//Rota para deletar um determinado projeto de dentro de repositories
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' })
  }

  repositories.splice(projectIndex, 1)

  return response.status(204).send()
});

//Rota para incrementar em uma quantidade os likes do projeto que corresponde ao id passado pelo route params toda vez que ela for chamada.
app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;
  
  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' })
  }

  repositories[projectIndex] = {
    id: repositories[projectIndex].id,
    likes: repositories[projectIndex].likes +1,
    title: repositories[projectIndex].title,
    url: repositories[projectIndex].url,
    techs: repositories[projectIndex].techs,
  }

  return response.status(200).send(repositories[projectIndex])

});

module.exports = app;
