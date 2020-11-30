const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        //check password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

        if (passwordResult) {
            // Generate token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id

            }, keys.jwt, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `Bearer ${token}`
            })

        } else {
            // Wrong password
            res.status(401).json({
                message: 'Invalid password. Try again.'
            })
        }

    } else {
        // user does not exist
        res.status(404).json({
            message: 'User does not exist'
        })
    }
}

module.exports.register = async function(req, res) {
    //User has: email pass
    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        // User exists, show error
        res.status(409).json({
            message: 'Email already registered.'
        })
    } else {
        // Create user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password,salt)
        })

        try {
            await user.save()
            res.status(201).json({
                message: 'User has been registered',
                user
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }

}