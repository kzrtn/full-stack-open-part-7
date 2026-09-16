import { useState } from 'react'
import { TextField, Button } from "@mui/material";

import commentService from "../services/comments"

const Comments = (props) => {
  const [commentField, setCommentField] = useState('')
  const [comments, setComments] = useState(props.comments)
  const { blogId } = props

  if (!comments && props.comments) {
    setComments(props.comments)
  }

  if (!comments) {
    return null
  }

  const addComment = async () => {
    const comment = {
      blogId,
      content: commentField,
    };
    const result = await commentService.create(comment)
    setComments(comments.concat(result))
    setCommentField('')
  };

  return (
    <>
      <h3>comments</h3>
      <label>
        <TextField
          value={commentField}
          onChange={({target}) => setCommentField(target.value)}
          placeholder="write a comment here..."
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