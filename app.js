const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')

const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')

const app = express()

console.log(keys.mongoURI)

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }) //db
  .then(() => console.log('Connected to mongoDB'))
  .catch(err => console.log(err))

app.use(passport.initialize()) // auth middleware for tokens
require('./middleware/passport')(passport)

app.use(require('morgan')('dev')) //HTTP request logger
app.use('/uploads', express.static('uploads')) //static folder to access from browser
app.use(bodyParser.urlencoded({ extended: true })) //handles HTTP POST request
app.use(bodyParser.json())
app.use(require('cors')()) // express cors requests/routing

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'))

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'client', 'dist', 'client', 'index.html')
    )
  })
}

module.exports = app
