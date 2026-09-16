import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useBlogActions } from "../store";
import { useField } from "../hooks";

const BlogForm = () => {
  const { add } = useBlogActions();
  const title = useField({
    type: 'text',
    placeholder: 'title'
  })
  const author = useField({
    type: 'text',
    placeholder: 'author'
  })
  const url = useField({
    type: 'text',
    placeholder: 'url'
  })

  const navigate = useNavigate();

  const submitNewBlog = (e) => {
    e.preventDefault();
    add({
      title: title.data.value,
      author: author.data.value,
      url: url.data.value
    });
    title.reset()
    author.reset()
    url.reset()
    navigate("/");
  };

  const style = {
    marginBottom: "1rem",
    width: "30rem",
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitNewBlog}>
        <div>
          <label>
            <TextField
              { ...title.data }
              sx={style}
              size="small"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              { ...author.data }
              sx={style}
              size="small"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              { ...url.data }
              sx={style}
              size="small"
            />
          </label>
        </div>
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
