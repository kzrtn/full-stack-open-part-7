import { test, expect, beforeEach, describe, vi } from 'vitest'
import { screen, render } from '@testing-library/react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const mockBlogService = vi.fn()
const mockBlog = {
  title: 'title here',
  author: 'John Smith',
  url: 'www.google.com',
}

describe('<BlogForm />', () => {
  beforeEach(() => {
    render(
      <Router>
        <Routes>
          <Route path = "/" element={
            <BlogForm
              blogService={mockBlogService}
            />
          } />
        </Routes>
      </Router>
    )
    //render(<BlogForm blogService={mockBlogService} />)
  })

  test('BlogForm calls event handler on submit and sends correct data', async () => {
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const button = screen.getByText('create')

    const user = userEvent.setup()

    await user.type(titleInput, mockBlog.title)
    await user.type(authorInput, mockBlog.author)
    await user.type(urlInput, mockBlog.url)
    await user.click(button)

    expect(mockBlogService.mock.calls).toHaveLength(1)
    expect(mockBlogService.mock.calls[0][0].title).toBe(mockBlog.title)
    expect(mockBlogService.mock.calls[0][0].author).toBe(mockBlog.author)
    expect(mockBlogService.mock.calls[0][0].url).toBe(mockBlog.url)
  })
})