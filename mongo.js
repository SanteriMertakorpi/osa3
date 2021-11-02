const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length<3) {
  console.log('give password as argument')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

// eslint-disable-next-line no-undef
const name = process.argv[3]
// eslint-disable-next-line no-undef
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

// eslint-disable-next-line no-undef
if(process.argv.length===5){
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
// eslint-disable-next-line no-undef
} else if(process.argv.length===3){
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}