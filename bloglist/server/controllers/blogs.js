const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware.js')
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  if (req.body?.likes === undefined)
    req.body.likes = 0
  
  if (req.body?.title === undefined || req.body?.url === undefined) {
    res.status(400).end()
  }

  const user = req.user
  const blog = new Blog({
    ...req.body,
    user: user._id
  })
  const result = await blog.save()
  const populatedResult = await Blog
    .findById(result._id)
    .populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  res.status(201).json(populatedResult)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  try {
    const blogToDelete = await Blog.findById(req.params.id)
    if (!blogToDelete) {
      res.status(404).end() // blog doesn't exist
    }

    if (user.id !== blogToDelete.user.toString()) {
      res.status(401).json({ error: 'user id that sent delete request is not owner of blog' })
    }
    const result = await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end() // successful delete

  } catch (err) {
    res.status(400).end() // blog id is malformatted
  }
})

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const user = req.user
  //const blogId = req.body.id
  const blogId = req.params.id
  const updatedObj = {
    likes: req.body.likes
  }

  try {
    const blogToUpdate = await Blog.findById(blogId)
    if (!blogToUpdate) {
      res.status(404).json({ error: 'blog id does not exist' })
    }

    if (user.id !== blogToUpdate.user.toString()) {
      res.status(401).json({ error: 'user id that sent update request is not owner of blog' })
    }
    const result = await Blog.findByIdAndUpdate(blogId, updatedObj)
    res.status(200).json(result) // successful put

  } catch (err) {
    res.status(400).end() // blog id is malformatted
  }
})

module.exports = blogsRouter