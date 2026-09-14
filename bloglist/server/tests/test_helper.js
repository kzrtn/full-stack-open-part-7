const bcrypt = require('bcrypt')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const sampleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const userList = [{
  username: 'root',
  password: 'admin@12333',
  name: 'admin'
},{
  username: 'john',
  password: 'Secret?1123',
  name: 'John'
}, {
  username: 'jane',
  password: 'JaneDoe#123',
  name: 'Jane Doe'
}]

const createSampleUsers = async () => {
  await User.deleteMany({})

  return Promise.all(
    userList.map(el => {
      const saltRounds = 10
      const passwordHash = bcrypt.hashSync(el.password, saltRounds)
      const user = new User({
        username: el.username,
        passwordHash,
        name: el.name
      })
      return user.save()
    })
  )
}

const createSampleBlogs = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await createSampleUsers()
  const user = (await User.find({ username: 'root' }))[0]

  return Promise.all(
    sampleBlogs.map(el => {
      const blog = new Blog({
        ...el,
        user: user.id
      })
      return blog.save()
    })
  )
}

const blogsInDb = async () => {
  const blogs = await Blog
    .find()
    .populate('user')
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User
    .find()
    .populate('blogs')
  return users.map(user => user.toJSON())
}

const sendUser = user => {
  return api
    .post(`/api/users/`)
    .set('Content-Type', 'application/json')
    .send(user)
}

const loginUser = user => {
  return api
    .post('/api/login')
    .send(user)
}

const createTestUser = async () => {
  const testUser = {
    username: 'testuser',
    password: 'Secret?1',
    name: 'Test'
  }

  const createdUser = await sendUser(testUser).expect(200)
  const userLoginData = await loginUser(testUser).expect(200)
  return {
    username: createdUser.body.username,
    id: createdUser.body.id,
    token: userLoginData.body.token,
    name: createdUser.body.name
  }
}

module.exports = {
  createSampleBlogs,
  createSampleUsers,
  blogsInDb,
  usersInDb,
  sendUser,
  loginUser,
  createTestUser,
}