const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI


console.log('connecting to...', url)
mongoose.connect(url).then(() => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('error to connect MongoDB', error.message)
})

const personScheme = mongoose.Schema({
    name: {type: String, minLength: 3, required: true, unique: true},
    number: {type: String, minLength:8 ,required: true}
})


personScheme.plugin(uniqueValidator)

personScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personScheme)

