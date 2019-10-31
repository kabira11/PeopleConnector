const express = require('express')
// const User = require('../models/userModel')
const router = new express.Router()

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/' , async (req, res) => {

    try{
        // const users = await User.find()
        res.status(200).send('Post Route')
    }catch(e){
        res.status(400).send(e)
    }

})

// router.post('/add' , async (req, res) => {
//     const newUser = new User(req.body)

//     try{
//         await newUser.save()
//         res.status(201).send({newUser})
//     }
//     catch(e){

//         res.status(400).send(e)
//     }
// })


module.exports = router