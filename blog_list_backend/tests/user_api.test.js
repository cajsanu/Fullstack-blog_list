const mongoose = require('mongoose')
const integTest_helper = require('../utils/integration_test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user1 = new User({ username: 'Success', name: "C", passwordHash })
    await user1.save()
})

describe('initial test', () => {
    test('one user', async () => {
        const oneUser = await integTest_helper.getAllUsers()
        expect(oneUser.type).toBe("application/json")
        expect(oneUser.status).toBe(200)
        expect(oneUser.body[0].id).toBeDefined()
    })
})

describe('tests for post', () => {
    test('adding one more user', async () => {
        const usersBeforePost = await integTest_helper.getAllUsers()
        const addedUser = await integTest_helper.postUser()
        const usersAfterPost = await integTest_helper.getAllUsers()
        expect(usersAfterPost.body).toHaveLength(usersBeforePost.body.length + 1)
        expect(addedUser.body.username).toContain("Mebba")
    })

    test('adding user fails if username taken', async () => {
        const usersAtStart = await integTest_helper.getAllUsers()
        const newUser = {
            username: 'Success',
            name: 'A',
            password: 'abrakadabra'
        }
        const response = await integTest_helper.postUser(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toContain('Username already taken')
        const usersAtEnd = await integTest_helper.getAllUsers()
        expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
    })

    test('adding user fails if password is shorter than 10 characters', async () => {
        const newUser = {
            username: 'Shorty',
            name: 'AA',
            password: '1'
        }
        const response = await integTest_helper.postUser(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toContain('password must be more than 10 characters')
    })
})




