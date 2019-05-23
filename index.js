require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./Models/person')
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
    // display the whole people list
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({error: 'malformatted id'})
        })
})


// show general info
app.get('/info', (req, res) => {
    const day = new Date()
    res.send(`<div>Puhelinluettelossa on ${Person.length} henkilöä</div><div>${day}</div>`)
})

// delete request
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


// add
app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if the POST request has any data in it
    if (body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    // add new person to people object
    person.save().then(response => {
        console.log(`lisättiin nimi:${body.name} numero:${body.number} `)
        console.log(response)
    })

    // show user the data they sent
    res.json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

// for error message
app.use(unknownEndpoint)

// port definitions
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
