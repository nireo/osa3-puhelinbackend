const mongoose = require('mongoose')

if (process.argv.length<3 ) {
    console.log("give password as argument")
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@cluster0-ww9qd.mongodb.net/test?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true})

const NoteSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})