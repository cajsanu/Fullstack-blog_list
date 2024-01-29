const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BLOGS_URL = '/api/blog_list'
const USERS_URL = '/api/users'
const LOGIN_URL = '/api/login'

const defaultBlog = {
    title: "Melvins promise",
    author: "Melvin",
    url: "https://melvin.com/",
}

const defaultUser = {
    username: "Mebba",
    name: "Melvin Nummelin",
    password: "mebbaBebba"
}

const login = (username, password) => {
    const requestBody = {
        username: username,
        password: password,
      }
    return api
        .post(LOGIN_URL)
        .send(requestBody)
}

const getAllBlogs = (token) => {
    return api
        .get(BLOGS_URL)
        .set("Authorization", `bearer ${token}`)
}

const postBlog = async (token, newBlog = defaultBlog) => {
    console.log(token, newBlog)
    return api
        .post(BLOGS_URL)
        .send(newBlog)
        .set("Authorization", `bearer ${token}`)

}

const getBlogById = (token, id) => {
    return api
        .get(`${BLOGS_URL}/${id}`)
        .set("Authorization", `bearer ${token}`)
}

const deleteBlogById = (token, id) => {
    return api
        .delete(`${BLOGS_URL}/${id}`)
        .set("Authorization", `bearer ${token}`)
}

const updateTitleOfBlog = (token, id, blog) => {
    return api
        .put(`${BLOGS_URL}/${id}`)
        .send(blog)
        .set("Authorization", `bearer ${token}`)
}

const getAllUsers = () => {
    return api
        .get(USERS_URL)

}

const postUser = (newUser = defaultUser) => {
    return api
        .post(USERS_URL)
        .send(newUser)
}


module.exports = {
    getAllBlogs,
    postBlog,
    getBlogById,
    deleteBlogById,
    updateTitleOfBlog,
    getAllUsers,
    postUser,
    login
}