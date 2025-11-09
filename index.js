const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World! this is server')
})

app.listen(port, () => {
  console.log(`HomeHero is listening on port ${port}`)
})
