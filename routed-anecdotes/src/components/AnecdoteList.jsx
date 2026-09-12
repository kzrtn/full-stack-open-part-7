const AnecdoteList = ({ anecdotes, deleteAnecdote }) => {
  const handleDelete = anecdoteId => deleteAnecdote(anecdoteId)
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote =>
          <li key={anecdote.id}>
            {anecdote.content}
            <button onClick={() => handleDelete(anecdote.id)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default AnecdoteList
