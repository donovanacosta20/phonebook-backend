const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to...');
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB');
}).catch(error => {
    console.log('error to connect MongoDB', error.message);
})

const personScheme = mongoose.Schema({
    name: String,
    number: String
});

personScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personScheme);

