import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useBlogActions } from "../store";
import { useLogin } from "../store";

const Blog = (props) => {
  const user = useLogin();
  const { like, remove } = useBlogActions();

  const [blog, setBlog] = useState(props.blog);
  const navigate = useNavigate();

  if (!blog && props.blog) {
    setBlog(props.blog);
  }

  if (!blog) return null;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  const Comments = () => {
    return (
      <ul>
        {blog.comments.map(comment => (
          <li key={crypto.randomUUID()}>{comment}</li>
        ))}
      </ul>
    )
  }

  const deleteBlog = () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );
    if (confirmDelete) {
      remove(blog);
      navigate("/");
    }
  };

  const link = blog.url.includes("http") ? blog.url : `https://${blog.url}`;

  const removeButton = () => {
    return (
      <>
        {blog.user.id === user.id ? (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={deleteBlog}
            sx={{ margin: "5px" }}
          >
            remove
          </Button>
        ) : (
          <></>
        )}
      </>
    );
  };

  const addLikeButton = () => {
    const addLike = () => {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      setBlog(updatedBlog);
      like(updatedBlog);
    };
    return (
      <Button
        size="small"
        variant="outlined"
        sx={{ margin: "5px" }}
        onClick={addLike}
      >
        like
      </Button>
    );
  };

  return (
    <div data-testid="blog" style={blogStyle}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            <b>{blog.title}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: "text.secondary" }}>
            By {blog.author}
          </Typography>
          <Typography>
            <Link to={link}>{blog.url}</Link>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            Added by {blog.user.name}
          </Typography>
          <Typography variant="body1" component="span">
            {blog.likes} likes
          </Typography>
          {user && addLikeButton()}
          {user && removeButton()}
          <h3>comments</h3>
          {blog.comments.length > 0 ? Comments() : (<>no comments</>)}
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;
