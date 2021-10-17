const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())


app.use(morgan('tiny'))
app.use(cors())



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelance",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number : "12-43-234245"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (req,res) =>{
    res.json(persons)
})
app.get('/info', (req,res) =>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p>${new Date()} `)
    
})
app.get('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p=>p.id===id)

    if(person){
        res.json(person)
    } else{
        res.status(404).end()
    }
})
app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    persons=persons.filter(person=>person.id!==id)

    res.status(204).end()
})
const generateId = () =>{
    const maxId = persons.length >0
     ? Math.max(...persons.map(p=>p.id))
     :0
    return maxId +1
}

app.post('/api/persons',(req,res)=>{
    const body = req.body

    if(!body.name) {
        return res.status(400).json({
            error:'name missing'
        })
    } else if(!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } else if(persons.map(p=>p.name).includes(body.name)){
        return res.status(400).json({
            error:'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})