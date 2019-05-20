const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(cors())

let people = [
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Frederik Mannen",
        "number": "1123-12512",
        "id": 3
    },
    {
        "name": "Sauli Niinistö",
        "number": "040-1291259",
        "id": 4
    }
]

const generateId = () => {
    // generate a valid random number to hopefully prevent duplication
    const maxId = people.length > 0
        ? Math.max(...people.map(p => p.id))
        : 0

    return maxId + 1
}

app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
    // display the whole people list
    res.send(people)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(p => p.id === id)

    if (person) {
        // display the object with the requested id
        res.json(person)
    } else {
        // code executes if a person is not found meaning a 404-not found error
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const day = new Date()
    res.send(`
        <div>Puhelinluettelossa on ${people.length} henkilöä</div>
        <div>${day}</div>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if the POST request has any data in it
    if (body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }

    // logic to remove duplication with people
    if (people.find(p => p.name === body.name)) {
        return res.status(400).json(
            {error: 'name already in list'}
        )
    } else if (people.find(p => p.number === body.number)) {
        return res.status(400).json(
            {error: 'number already in list'}
        )
    }

    // person entry template
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    // add new person to people object
    people.concat(person)

    // show user the data they sent
    res.json(person)
})

const error = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})