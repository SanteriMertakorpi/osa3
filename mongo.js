const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]


const url = 
    `mongodb+srv://root:${password}@cluster0.v4gtp.mongodb.net/puhelinluettelodb?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number
})

if(process.argv.length===5){
    person.save().then(response =>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else if(process.argv.length===3){
    console.log('phonebook:')
    Person.find({}).then(result=> {
        result.forEach(p=>{
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}