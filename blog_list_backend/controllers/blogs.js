const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  console.log("back", request.body)
  try {
  const user = request.user
  console.log("user", user)

  if (!request.body.title || !request.body.url) {
    response.status(400).json("A blog must have a title and a URL")
  } 
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes ?? 0,
    id: request.body._id,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
} catch (error) {
  console.error(error)
}
  }
)

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(blog.id)
    return response.status(204).end()
  }
  return response.status(401).json( { error: "you don't have permission to delete this item" })
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.status(200).json(blog)
})

blogRouter.post('/:id/like', async (request, response) => {
  const blogFromDB = await Blog.findById(request.params.id)
  blogFromDB.likes += 1
  await blogFromDB.save()
  response.status(201).end()
})

blogRouter.put('/:id', async (request, response) => {
  const newUpdate = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newUpdate, { new: true })
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter