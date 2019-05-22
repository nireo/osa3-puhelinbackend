const mongoose = require('mongoose')

console.log(process.argv)

if ( process.argv.length < 3 ) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-ww9qd.mongodb.net/test?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: 7
})

person.save().then(response => {
    console.log(`lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`)
    mongoose.connection.close()
})
