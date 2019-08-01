const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {email, password} = req.body
        const user = await db.find_user({email})
        if (user.length > 0) {
            return res.status(200).send({message: "email already in use"})
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = await db.create_cust({email, hash_value: hash})

        req.session.user = {id: newUser[0].cust_id, email: newUser[0].email}

        res.status(200).send({message: 'Logged in', userData: req.session.user})
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const {email, password} = req.body
        const user = await db.find_user({email})
        if (user.length === 0) {
            return res.status(200).send({message: 'Email not found'})
        }
        const result = bcrypt.compareSync(password, user[0].hash_value)
        if (result === true) {
            req.session.user = {id: user[0].cust_id, email: user[0].email}
            return res.status(200).send({message: 'Logged in', userData: req.session.user})
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.status(200).send({message: 'Logged out', userData: {}})
    }
}