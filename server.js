const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';
app.locals.pets = [
  { id: 'a1', name: 'Jessica', type: 'dog' },
  { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
  { id: 'c3', name: 'Craisins', type: 'cat' }
];

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box');
})

app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets;

  response.json({ pets });
})

app.get('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);
  if (!pet) {
    return response.sendStatus(404);
  }

  response.status(200).json(pet);
})

app.post('/api/v1/pets', (request, response) => {
  const id = Date.now();
  const pet = request.body;

  for (let requiredParameter of ['name', 'type']) {
    if (!pet[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  const { name, type } = request.body;

  app.locals.pets.push({ id, name, type });

  response.status(201).json({ id, name, type });
})

app.delete('/api/v1/pets/delete/:id', (request, response) => {
  const { id } = request.params;
  // const parsedId = parseInt(id);
  const match = app.locals.pets.find(pet => pet.id === id);

  if (!match) {
    return response.status(404).json({ error: `No pet found with an id of ${id}.`})
  }

  const updatedPets = app.locals.pets.filter(pet => pet.id !== id);

  app.locals.pets = updatedPets;

  return response.status(202).json(app.locals.pets);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})