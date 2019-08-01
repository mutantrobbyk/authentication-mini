require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./authController')

const app = express()

// TOP LEVEL MIDDLEWARE:
app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

// ENDPOINTS: 
app.post('/api/register', authCtrl.register) // register
app.post('/api/login', authCtrl.login) // login
app.get('/api/logout', authCtrl.logout) // logout

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))
}).catch(err => {
  console.log(`Can't connect to db.`, err)
})