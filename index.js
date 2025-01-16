const express = require('express')
const app = express()
var morgan = require('morgan')


app.use(express.json())

morgan.token('body', (req) => {
    if (req.method==='POST') {
        return JSON.stringify(req.body)
    }
    else {
        return ''
    }
})

app.use((req, res, next) => {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
    } else {
        morgan(':method :url :status :res[content-length] - :response-time ms')(req, res, next)
    }
})



let persons = [
    {
     id: 1, name: "Arto Hellas",
     number: "040-123456" 
    },
    {
     id: 2, name: "Ada Lovelace",
     number: "39-44-5323523" 
    },
    {
     id: 3, name: "Dan Abramov", 
     number: "12-43-234345" 
    },
    {
     id: 4, name: "Mary Poppendieck", 
     number: "39-23-6423122" 
    },
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  const generateId = () => {
    let id = Math.floor(Math.random() * 1000000)
    while (persons.some(person => person.id === id)) {
        id = Math.floor(Math.random() * 1000000)
    }
    return id
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {  
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.get('/info', (request, response) => {
    const currentDate = new Date()
    const personsCount = persons.length
    response.send(`
        <p>Phonebook has info for ${personsCount} people.</p>
        <p>${currentDate}</p>
    `)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  
})
