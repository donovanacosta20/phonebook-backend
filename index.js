const express = require('express');
const morgan = require('morgan')
const app = express();

let persons = [
    {
        id:1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id:2,
        name: 'Ada Lovelance',
        number: '39-44-5323523'
    },
    {
        id:3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id:4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
];

morgan.token('body', function (req, res) {
     return `{"name:" ${req.body.name}, "number:" ${req.body.number}}`
});

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['body'](req, res),
    ].join(' ')
  }));
app.use(express.static('build'));

//GetALL
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {

    const lengthPhoneBook = persons.length;
    const dateTime = new Date().toString()

    response.send(`<p>Phonebook has info for ${lengthPhoneBook} people</p>
    <p>${dateTime}</p>`);

});

//GET only one person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    person ? response.json(person) : response.status(404).end();
})

//Delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

//Post

app.post('/api/persons', (request, response) => {

    const newPerson = request.body;

    if(newPerson.name.length === 0 || newPerson.number.length === 0) {
        return response.status(400).json({
            error: 'The name or number is missing'
        });
    }

    if(persons.some(person => person.name === newPerson.name)) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        });
    }

    newPerson.id = Math.random() + 12394;
    
    persons = persons.concat(newPerson)

    response.json(newPerson);
});


const PORT= process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});