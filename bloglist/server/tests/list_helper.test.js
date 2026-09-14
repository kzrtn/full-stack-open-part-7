const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper.js')

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

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('when a list has only one blog equals the likes of that', () => {
    const blogs = [sampleBlogs[0]]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 7)
  })

  test('of bigger list is calculated correctly', () => {
    const blogs = sampleBlogs

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is an empty object', () => {
    const blogs = []
    const correctResult = {}

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list with a single blog returns that single blog', () => {
    const blogs = [sampleBlogs[0]]

    const correctResult = blogs[0]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list of blogs returns the blog with most likes', () => {
    const blogs = sampleBlogs

    const correctResult =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, correctResult)
  })
})

describe('most blogs', () => {
  test('of empty list returns an empty object', () => {
    const blogs = []

    const correctResult = {}
    const result = listHelper.FindMostOf(blogs, 'blogs', true)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list with a single blog returns correct author and blog count of 1', () => {
    const blogs = [sampleBlogs[0]]

    const correctResult = {
      author: sampleBlogs[0].author,
      blogs: 1
    }
    const result = listHelper.FindMostOf(blogs, 'blogs', true)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list of blogs returns correct author and correct total blog count', () => {
    const blogs = sampleBlogs

    const correctResult = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    const result = listHelper.FindMostOf(blogs, 'blogs', true)
    assert.deepStrictEqual(result, correctResult)
  })
})

describe('most likes', () => {
  test('of empty list returns an empty object', () => {
    const blogs = []

    const correctResult = {}
    const result = listHelper.FindMostOf(blogs, 'likes', false)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list with a single blog returns correct author and likes count of 7', () => {
    const blogs = [sampleBlogs[0]]

    const correctResult = {
      author: sampleBlogs[0].author,
      likes: 7
    }
    const result = listHelper.FindMostOf(blogs, 'likes', false)
    assert.deepStrictEqual(result, correctResult)
  })

  test('of a list of blogs returns correct author and correct total blog count', () => {
    const blogs = sampleBlogs

    const correctResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const result = listHelper.FindMostOf(blogs, 'likes', false)
    assert.deepStrictEqual(result, correctResult)
  })
})