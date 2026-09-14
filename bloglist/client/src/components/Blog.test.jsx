import { test, expect, vi, describe, beforeEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import Blog from './Blog'

const mockUpdateBlog = vi.fn()
const mockDeleteBlog = vi.fn()

const blog = {
  title: 'title here',
  author: 'John Smith',
  likes: 2,
  url: 'www.google.com',
  id: '6a902a621461ea2a06fe34e0',
  user: {
    id: '6a9029571461ea2a06fe34de',
    name: 'Jane Doe',
    username: 'root2'
  }
}

const BlogDisplay = user => {
  return (
    (
      <Router>
        <Routes>
          <Route path = "/" element={
            <Blog
              blog={blog}
              user={user}
              updateService={mockUpdateBlog}
              deleteService={mockDeleteBlog}
            />
          } />
        </Routes>
      </Router>
    )
  )
}

describe('<Blog />', () => {
  describe('non-logged in user is viewing a blog post', () => {
    beforeEach(() => {
      const user = null
      render(BlogDisplay(user))
      //render(<Blog key={blog.id} blog={blog} blogService={mockUpdateBlog} deleteService={mockDeleteBlog} />)
    })

    test('blog title and author is visible', async () => {
      screen.getByText(`${blog.title}`)
      screen.getByText(`By ${blog.author}`)
    })

    test('like and remove button are not visible', async () => {
      const likeButton = screen.queryByRole('button', { name: 'like' })
      const removeButton = screen.queryByRole('button', { name: 'remove' })
      await expect(likeButton).toBeNull()
      await expect(removeButton).toBeNull()
    })
  })

  describe('user is logged in and viewing their own blog post', () => {
    beforeEach(() => {
      const user = {
        id: '6a9029571461ea2a06fe34de',
        name: 'Jane Doe',
        username: 'root2'
      }
      window.confirm = vi.fn(() => true)
      mockDeleteBlog.mockClear()
      mockUpdateBlog.mockClear()
      render(BlogDisplay(user))
      //render(<Blog key={blog.id} blog={blog} blogService={mockUpdateBlog} deleteService={mockDeleteBlog} />)
    })

    test('like and remove button are both visible', () => {
      screen.getByRole('button', { name: 'like' })
      screen.getByRole('button', { name: 'remove' })
    })

    test('clicking like triggers event handler', async () => {
      const user = userEvent.setup()
      //const viewButton = screen.getByText('view')
      //await user.click(viewButton)
      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      expect(mockUpdateBlog.mock.calls).toHaveLength(1)
    })

    test('clicking remove triggers event handler', async () => {
      const user = userEvent.setup()
      //const viewButton = screen.getByText('view')
      //await user.click(viewButton)
      const removeButton = screen.getByRole('button', { name: 'remove' })
      await user.click(removeButton)
      window.alert
      expect(mockDeleteBlog.mock.calls).toHaveLength(1)
    })
  })

  describe('user is logged in and viewing someone elses blog post', () => {
    beforeEach(() => {
      const user = {
        id: '6a82b6b7d6231efb8efcce34',
        name: 'John Smith',
        username: 'root'
      }
      mockUpdateBlog.mockClear()
      render(BlogDisplay(user))
      //render(<Blog key={blog.id} blog={blog} blogService={mockUpdateBlog} deleteService={mockDeleteBlog} />)
    })

    test('like button is visible', () => {
      screen.getByRole('button', { name: 'like' })
    })

    test('remove button is not visible', async () => {
      const removeButton = screen.queryByRole('button', { name: 'remove' })
      await expect(removeButton).toBeNull()
    })

    test('clicking like triggers event handler', async () => {
      const user = userEvent.setup()
      //const viewButton = screen.getByText('view')
      //await user.click(viewButton)
      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      expect(mockUpdateBlog.mock.calls).toHaveLength(1)
    })
  })

  /*
  test('URL and likes are shown when show button is clicked', async () => {
    const button = screen.getByText('view')
    const user = userEvent.setup()
    await user.click(button)
    screen.getByText(`likes ${blog.likes}`)
    screen.getByText(`${blog.url}`)
  })
    */
})



