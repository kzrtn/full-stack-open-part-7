import { useState, useEffect } from 'react'
import {
  Routes, Route, Link,
  useMatch
} from 'react-router-dom'
import { Container, AppBar, Button, Toolbar, Typography } from '@mui/material'
import styled from 'styled-components'
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 5px;
`

import CssBaseLine from '@mui/material/CssBaseline'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

/*
const IS_ERROR = true
const NOT_ERROR = false
*/

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [toast, setToast] = useState({
    type: null,
    message: null
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.toSorted((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('BlogAppUser')
    if (loggedUserJSON) {
      const userObj = JSON.parse(loggedUserJSON)
      blogService.setToken(userObj.token)
      setUser(userObj)
    }
  }, [])

  const showNotification = (type, message) => {
    setToast({ type, message })

    setTimeout(() => {
      setToast({
        type: null,
        message: null
      })
    }, 5000)
  }

  const handleLogin = async (userObj) => {
    try {
      const user = await loginService.login(userObj)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('BlogAppUser', JSON.stringify(user))
      showNotification('success', `${user.name} successfully logged in.`)
    } catch (error) {
      showNotification('error', `Invalid credentials. Error: ${error}`)
    }
  }

  const submitNewBlog = async (blogFields) => {
    try {
      const res = await blogService.create(blogFields)
      setBlogs(blogs.concat(res))
      showNotification('success', `Added new blog titled "${blogFields.title}" By "${blogFields.author}"`)
    } catch (error) {
      showNotification('error', `Failed to submit blog post. Error: ${error}`)
    }
  }

  const logout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('BlogAppUser')
    showNotification('success', 'Successfully logged out.')
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const res = await blogService.addLike(updatedBlog)
      setBlogs(blogs.map(blog =>
        blog.id === res.id ? res : blog
      ))
      showNotification('success', `Liked "${updatedBlog.title}" By "${updatedBlog.author}"`)
    } catch (error) {
      showNotification('error', `Failed to like blog post. Error: ${error}`)
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.deleteBlog(blogToDelete)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      showNotification('success', `Deleted "${blogToDelete.title}" By "${blogToDelete.author}"`)
    } catch (error) {
      showNotification('error', `Failed to delete blog post. Error: ${error}`)
    }
  }

  const match = useMatch('/blog/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  return (
    <Container>
      <CssBaseLine />
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit">
            <StyledLink to="/">
              blogs
            </StyledLink>
          </Button>
          {!user && (
            <Button color="inherit">
              <StyledLink to="/login">
                login
              </StyledLink>
            </Button>
          )}
          {user && (
            <Button color="inherit">
              <StyledLink to="/create">
                new blog
              </StyledLink>
            </Button>

          )}
          {user && (
            <Button color="inherit" onClick={logout}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {toast.message && (<Notification toast={toast} />)}
      <Routes>
        <Route path = "/blog/:id" element={
          <Blog
            blog={blog}
            user={user}
            updateService={updateBlog}
            deleteService={deleteBlog}
          />
        } />

        <Route path="/" element={
          <BlogList
            blogs={blogs}
            setBlogs={setBlogs}
            toast={toast}
          />
        } />

        <Route path="/login" element={
          <LoginForm
            loginService={handleLogin}
          />
        } />

        <Route path="/create" element={
          <BlogForm
            blogService={submitNewBlog}
          />
        } />
      </Routes>
    </Container>
  )
}

export default App