const express = require('express')
const morgan = require('morgan')
const cors =  require('cors')
const app = express()

app.use(express.static('build'))

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())

morgan.token('body', function (req) {
    return `{"name:" ${req.body.name}, "number:" ${req.body.number}}`
})
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['body'](req, res),
    ].join(' ')
}))


app.get('/', (request, response) => {
    response.send('<h1>Hello WORLD!</h1>')
})

//GetALL
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//GET only one person
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if(result) {
                response.json(result)
            }else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

//INFO
app.get('/info', (request, response) => {

    const dateTime = new Date().toString()

    response.send(`<p>Phonebook has info for  people</p>
    <p>${dateTime}</p>`)

})

//POST
app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log('debug:', body)

    if(body.name.length === 0 || body.number.length === 0) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const objectPerson = new Person({
        name: body.name,
        number: body.number
    })

    objectPerson.save()
        .then(savePerson => {
            response.json(savePerson)
        })
        .catch(error => {
            response.status(400).json(error.message)
        })
    
})

//PUT
app.put('/api/persons/:id', (request, response, next) => {

    const newPerson = request.body

    const person = {
        name: newPerson.name,
        number: newPerson.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updateNote => {
            response.json(updateNote)
        })
        .catch(error => next(error))
})

// //Delete
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => console.log(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT= process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})