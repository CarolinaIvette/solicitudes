const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const cors = require('cors')
const pool = require('./config/db')
  
const authRoutes = require('./routes/auth.routes')
const usersRoutes = require('./routes/users.routes')
const areasRoutes = require('./routes/areas.routes')
const categoriesRoutes = require('./routes/categories.routes')
const requestsRoutes = require('./routes/requests.routes')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
  
app.use(cors({  
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))


app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/areas', areasRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/requests', requestsRoutes)


app.use(errorHandler)

module.exports = app
