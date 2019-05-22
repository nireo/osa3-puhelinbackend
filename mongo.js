const mongoose = require('mongoose')

if (process.argv.length<3 ) {
    console.log("give password as argument")
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@cluster0-ww9qd.mongodb.net/test?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: "Eemil Lehti",
    number: "040-1291293",
    id: 7
})

person.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
})