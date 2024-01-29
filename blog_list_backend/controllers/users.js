const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1, likes: 1 })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (password.length < 10) {
        return response.status(400).json({ error: 'password must be more than 10 characters' })
    }
    const usersInDB = await User.find({})
    const usernames = usersInDB.map(un => un.username)

    if (usernames.includes(username)) {
        response.status(400).json({ error: 'Username already taken' })
    } else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    }

})


module.exports = userRouter