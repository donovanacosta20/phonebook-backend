require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

morgan.token('body', function (req, res) {
     return `{"name:" ${req.body.name}, "number:" ${req.body.number}}`
});

app.use(express.json());
app.use(express.static('build'));

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

//GetALL
app.get('/api/persons', (request, response) => {
   Person.find({}).then(persons => {
    response.json(persons);
   });
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

    if(newPerson.name.length > 0 &&  newPerson.number.length > 0) {
        const objectPerson = new Person({
            name: newPerson.name,
            number: newPerson.number
         });
        
            objectPerson.save().then(savePerson => {
            response.json(savePerson);
        });
    } 
      
    return response.status(400).json({
        error: 'The name or number is missing'
    });


});  



const PORT= process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});