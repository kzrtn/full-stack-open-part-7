import Dropdown from './Dropdown'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, setBlogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <div>
        <Dropdown blogs={blogs} setBlogs={setBlogs} />
        <ul>
          {blogs.map(blog =>
            <li key={blog.id}><Link to={`blog/${blog.id}`}>{blog.title}</Link></li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogList