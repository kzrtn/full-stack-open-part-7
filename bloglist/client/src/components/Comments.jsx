import { useState } from 'react'
import { TextField, Button } from "@mui/material";
import { useField } from '../hooks';

import commentService from "../services/comments"

const Comments = (props) => {
  const comment = useField({
    type: 'text',
    placeholder: 'write a comment here...'
  })
  const [comments, setComments] = useState(props.comments)
  const { blogId } = props

  if (!comments && props.comments) {
    setComments(props.comments)
  }

  if (!comments) {
    return null
  }

  const addComment = async () => {
    const newComment = {
      blogId,
      content: comment.data.value,
    };
    const result = await commentService.create(newComment)
    setComments(comments.concat(result))
    comment.reset()
  };

  return (
    <>
      <h3>comments</h3>
      <label>
        <TextField
          { ...comment.data }
          size="small"
        />
      </label>
      <Button variant="contained" sx={{ marginLeft: "15px" }} onClick={addComment}>Add comment</Button>
      {comments && comments.length > 0
        ? (
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        )
        : (
          <div>no comments</div>
        )}
    </>
  )
}

export default Comments