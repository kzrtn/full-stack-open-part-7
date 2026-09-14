const dummy = blogs => {
  return 1
}

const totalLikes = blogPosts => {
  return blogPosts.reduce((sum, post) => sum + post.likes, 0)
}

const favoriteBlog = blogPosts => {
  let winnerBlog = {}

  blogPosts.forEach(blogPost => {
    if (blogPost?.likes > (winnerBlog?.likes || 0)) {
      winnerBlog = blogPost
    }
  })

  return winnerBlog
}

const mostBlogs = blogPosts => {
  let blogAuthors = []

  blogPosts.forEach(blogPost => {
    const findIndex = blogAuthors.findIndex(blogAuthor => blogAuthor.author === blogPost.author)

    if (findIndex === -1) {
      blogAuthors.push({
        author: blogPost.author,
        blogs: 1
      })
    } else {
      blogAuthors[findIndex].blogs++
    }
  })

  let winnerBlog = {}
  blogAuthors.forEach(blogAuthor => {
    if (blogAuthor.blogs > (winnerBlog?.blogs || 0)) {
      winnerBlog = blogAuthor
    }
  })

  return winnerBlog || {}
}

const mostLikes = blogPosts => {
  let blogAuthors = []

  blogPosts.forEach(blogPost => {
    const findIndex = blogAuthors.findIndex(blogAuthor => blogAuthor.author === blogPost.author)
    //console.log(findIndex)

    if (findIndex === -1) {
      blogAuthors.push({
        author: blogPost.author,
        likes: blogPost.likes
      })
    } else {
      blogAuthors[findIndex].likes += blogPost.likes
    }
  })

  let winnerBlog = {}
  blogAuthors.forEach(blogAuthor => {
    if (blogAuthor.likes > (winnerBlog?.likes || 0)) {
      winnerBlog = blogAuthor
    }
  })

  return winnerBlog || {}
}

// Finds the author with the highest total (or count) of a given attribute
// across all their blog posts.
//
// blogPosts  - array of blog post objects, each with an 'author' field
// attribute  - the numeric attribute to aggregate per author (e.g. 'likes')
// countMode  - true: count how many posts each author has
//              false: sum the attribute's value across each author's posts
//
// Returns the winning author's aggregated object: { author, [attribute]: total }
// Returns {} if blogPosts is empty.
const FindMostOf = (blogPosts, attribute, countMode) => { 
  let blogAuthors = []

  blogPosts.forEach(blogPost => {
    const findIndex = blogAuthors.findIndex(blogAuthor => blogAuthor.author === blogPost.author)

    if (findIndex === -1) {
      blogAuthors.push({
        author: blogPost.author,
        [attribute]: countMode ? 1 : blogPost[attribute]
      })
    } else {
      blogAuthors[findIndex][attribute] += countMode ? 1 : blogPost[attribute]
    }
  })

  let winnerBlog = {}
  blogAuthors.forEach(blogAuthor => {
    if (blogAuthor[attribute] > (winnerBlog[attribute] || 0)) {
      winnerBlog = blogAuthor
    }
  })

  return winnerBlog
}

module.exports = { dummy, totalLikes, favoriteBlog, FindMostOf }