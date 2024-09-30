const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000

app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.send('Hello Testing!')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})