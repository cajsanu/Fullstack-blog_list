const mongoose = require('mongoose')
const integTest_helper = require('../utils/integration_test_helper')
const Blog = require('../models/blog')
const initialBlogs = require('../utils/testBlogs')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user1 = new User({ username: 'Success', name: "C", passwordHash })
    await user1.save()
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


describe('tests for collection of blogs', () => {

    test('blogs are returned as json', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = integTest_helper.getAllBlogs(loginInfo.body.token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('initial number of blogs', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = await integTest_helper.getAllBlogs(loginInfo.body.token)
        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('one more blog after post', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = await integTest_helper.postBlog(loginInfo.body.token)
        const allBlogs = await integTest_helper.getAllBlogs(loginInfo.body.token)
        expect(allBlogs.body).toHaveLength(initialBlogs.length + 1)
        expect(response.body.title).toContain("Melvin")
    })
})

describe('tests for specific properties', () => {

    test('id is defined', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = await integTest_helper.getAllBlogs(loginInfo.body.token)
        expect(response.body[0].id).toBeDefined()
    })

    test('if likes property missing default value is 0', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = await integTest_helper.postBlog(loginInfo.body.token)
        expect(response.body.likes).toBe(0)
    })

    test('title or url missing', async () => {
        const testBlog = {
            title: "Melvins promise",
            author: "Melvin",
            likes: 99
        }
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const response = await integTest_helper.postBlog(loginInfo.body.token, testBlog)
        console.log(response.status)
        expect(response.status).toBe(400)
    })
})

describe('tests for handeling individual blogs', () => {

    test('a specific blog can be viewed', async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const allBlogs = await integTest_helper.getAllBlogs(loginInfo.body.token)
        const blogToView = allBlogs.body[0]
        const response = await integTest_helper.getBlogById(loginInfo.body.token, blogToView.id)
        expect(response.status).toBe(200)
        expect(response.body.title).toContain(blogToView.title)
    })

    test("deleting a blog", async () => {
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const postedBlog = await integTest_helper.postBlog(loginInfo.body.token)
        const allBlogs = await integTest_helper.getAllBlogs(loginInfo.body.token)
        const blogToDelete = postedBlog.body
        const response = await integTest_helper.deleteBlogById(loginInfo.body.token, blogToDelete.id)
        expect(response.status).toBe(204)
        const allBlogsExceptOne = await integTest_helper.getAllBlogs(loginInfo.body.token)
        expect(allBlogsExceptOne.body).toHaveLength(allBlogs.body.length - 1)
    })

    test('update one blog', async () => {
        const newUpdate = {
            _id: "5a422aa71b54a676234d17f8",
            title: "New update",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
          }
        const loginInfo = await integTest_helper.login("Success", "sekret")
        const allBlogs = await integTest_helper.getAllBlogs(loginInfo.body.token)
        const blogToUpdate = allBlogs.body[0]
        const updatedBlog = await integTest_helper.updateTitleOfBlog(loginInfo.body.token, blogToUpdate.id, newUpdate)
        expect(updatedBlog.status).toBe(200)
        expect(updatedBlog.body.title).toContain("New update")
    })
})


afterAll(async () => {
    await mongoose.connection.close();
})
