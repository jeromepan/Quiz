const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Enable CORS
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "Origin, X-Requested-With, PATCH, Content-Type, Accept")
    next()
})

//Getting all
router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

//Getting one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

//Creating one
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        quiz: req.body.quiz,
        attempted: req.body.attempted
    })

    try{
        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

//Updating one
router.patch('/:id', getUser, async (req, res) => {
    if(req.body.name != null){
        res.user.name = req.body.name
    }

    if(req.body.quiz != null){
        res.user.quiz = req.body.quiz
    }

    if(req.body.attempted != null){
        res.user.attempted = req.body.attempted
    }

    try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

//Deleting one
router.delete('/:id', getUser, async (req, res) => {
    try{
        await res.user.remove()
        res.json({ message: 'Deleted User' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

// Middle-ware
async function getUser(req, res, next){
    let user
    try{
        user = await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    }catch(err){
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}

//Export router
module.exports = router