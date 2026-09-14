import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ blogService }) => {
  const [blogFields, setBlogFields] = useState({
    title: '',
    author: '',
    url: ''
  })
  const navigate = useNavigate()

  const submitNewBlog = e => {
    e.preventDefault()
    blogService(blogFields)
    setBlogFields({
      title: '',
      author: '',
      url: ''
    })
    navigate('/')
  }

  const style = {
    marginBottom: '1rem',
    width: '30rem'
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitNewBlog}>
        <div>
          <label>
            <TextField
              value={blogFields.title}
              onChange={({ target }) => setBlogFields({ ...blogFields, title: target.value })}
              placeholder="title"
              sx={style}
              size="small"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              value={blogFields.author}
              onChange={({ target }) => setBlogFields({ ...blogFields, author: target.value })}
              placeholder="author"
              sx={style}
              size="small"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              value={blogFields.url}
              onChange={({ target }) => setBlogFields({ ...blogFields, url: target.value })}
              placeholder="url"
              sx={style}
              size="small"
            />
          </label>
        </div>
        <Button type="submit" variant="contained">create</Button>
      </form>
    </div>
  )
}

export default BlogForm