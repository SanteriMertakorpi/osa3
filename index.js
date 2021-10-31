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

const errorHandler = (error, req,res,next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    }
    next(error)
}
app.use(errorHandler)





app.get('/api/people', (req,res) =>{
    Person.find({}).then(p=>{
        res.json(p)
        
    })
})

app.post('/api/people',(req,res)=>{
    const body = req.body

    if(!body.name) {
        return res.status(400).json({
            error:'name missing'
        })
    } else if(!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    const person = new Person( {
        name: body.name,
        number: body.number,
        
    })
    person.save().then(savedPerson =>{
        res.json(savedPerson)
    })
    
})

app.get('/info', (req,res) =>{
    Person.find().exec(function(err,result){
        const amount = result.length
        res.send(`<p>Phonebook has info for ${amount} people</p>${new Date()} `)
    })
})
app.get('/api/people/:id', (req,res)=>{
    
    Person.findById(req.params.id)
     .then(p=>{
        if(p){
            res.json(p)
        } else {
            res.status(404).end()
        }
    })
     .catch(error => next(error))

    
})

app.delete('/api/people/:id',(req,res)=>{
    Person.findByIdAndDelete(req.params.id)
     .then(result => {
         res.status(204).end()
     })
     .catch(error=>next(error))
}) 




const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})