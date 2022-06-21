const mongoose = require('mongoose');

if(process.argv.length < 5 && process.argv.length > 3) {
    console.log('Please provide the password, name and number as un argument: node mongo.js <password> <name> <number>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.0yv3zbm.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const personScheme = new mongoose.Schema({
    name: String,
    number: String,
});

const Persons = mongoose.model("Persons", personScheme);

if(process.argv.length === 3) {
    console.log('phonebook')
      Persons.find({}).then(result => {
        result.forEach(phone => {
            console.log(`${phone}`);
        });
        mongoose.connection.close();
    });

    return;
}

const person = new Persons({
    name: process.argv[3],
    number: process.argv[4]
});

person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
});
