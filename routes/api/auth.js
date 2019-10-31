const express = require('express')
const User = require('../../models/User')
const router = new express.Router()
const auth = require ('../../middleware/auth')
const jwt = require ('jsonwebtoken')
const config = require('../../config/default')
const bcrypt = require('bcryptjs')
const { check , validationResult } = require('express-validator')

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/' , auth , async (req, res) => {

    try{
        // .select('-password') remove password from user object which is coming from DB
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch(e){
        console.error(e.message)
        res.status(500).send('Server Error')
    }

})

// @route   POST api/auth
// @desc    Authentication user & get token.
// @access  Public
router.post('/' ,
    [
        check('email', 'Please enter valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ]
, async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email , password } = req.body

    try {
    // See if user exists
        let user = await User.findOne({ email })

        if(!user){
            res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }


    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
    }

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload , 
        config.jwtSecret , 
        { expiresIn: 360000} ,
        (err,token) => {
            if(err) throw err
            res.json({ token })
        })
    // res.send('user created')
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server error.')

    }


 //   console.log(req.body)
})


module.exports = router