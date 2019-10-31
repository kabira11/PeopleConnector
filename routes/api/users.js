const express = require('express')
const User = require('../../models/User')
const router = new express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const config = require('../../config/default')

const { check , validationResult } = require('express-validator')

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/' , async (req, res) => {

    try{
        // const users = await User.find()
        res.status(200).send('User Route')
    }catch(e){
        res.status(400).send(e)
    }

})

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/' ,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
    ]
, async (req, res) => {
    // const newUser = new User(req.body)
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { name , email , password } = req.body

    try {
    // See if user exists
        let user = await User.findOne({ email })

        if(user){
            res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }

    // Get Users gravatar

    const avatar = gravatar.url(email,{
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    })


    // Encrypt password
    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // Return jsonwebtoken

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