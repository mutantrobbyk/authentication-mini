const bcrypt = require('bcryptjs')
module.exports = {
  register: async (req, res) => {
    /*
    1. Check to see if the email already has an account
      a. if so, send appropriate response
    2. hash and salt the password, and create new user in db
    3. put new user on session
    4. respond with user info
    */
    const db = req.app.get('db')
    const {email, password} = req.body

    // check if the email is already in use
    const user = await db.find_user({email})
    if (user.length > 0) {
      return res.status(200).send({message: 'Email already in use!'})
    }

    // hash & salt the password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const newUser = await db.create_cust({email, hash_value: hash})

    // put new user on session
    req.session.user = {id: newUser[0].cust_id, email: newUser[0].email}

    // respond with user info
    res.status(200).send({message: 'Logged in', userData: req.session.user})
    
  },
  login: async (req, res) => {
    /*
    1. check if the email has an account
      a. if not, send appropriate response
    2. found email - rehash password, compare hashes
    3. if comparison fails, send failure message
      a1. add user to session if it succeeds
      a2. else send success message with user data
    */
    const db = req.app.get('db')
    const {email, password} = req.body

    // check if email has account
    const user = await db.find_user({email})
    // not found - send message
    if (user.length === 0) {
      return res.status(200).send({message: 'Email not found'})
    }
    // email found - compare hashes
    const result = bcrypt.compareSync(password, user[0].hash_value)
    if (result === true) {
      // add user to session
      req.session.user = {id: user[0].cust_id, email: user[0].email}
      return res.status(200).send({message: 'Logged in!', userData: req.session.user})
    }
  },
  logout: (req, res) => {
    req.session.destroy()
    res.status(200).send({message: 'Logged out', userData: {}})
  }
}