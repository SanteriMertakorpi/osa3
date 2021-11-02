require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.json())
app.use(express.static('build'))


app.use(morgan('tiny'))
app.use(cors())







app.get('/api/people', (req,res) => {
  Person.find({}).then(p => {
    res.json(p)
  })
})

app.post('/api/people',(req,res,next) => {
  const body = req.body

  const person = new Person( {
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/info', (req,res) => {
  Person.find().exec(function(err,result){
    const amount = result.length
    res.send(`<p>Phonebook has info for ${amount} people</p>${new Date()} `)
  })
})
app.get('/api/people/:id', (req,res,next) => {
  Person.findById(req.params.id)
    .then(p => {
      if(p){
        res.json(p)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id',(req,res,next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
const errorHandler = (error, req,res,next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name==='ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if(error.name === 'MongoServerError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)



// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})