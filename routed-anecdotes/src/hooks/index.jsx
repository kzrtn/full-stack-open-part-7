import { useState, useEffect, createContext, useContext } from 'react'
import anecdoteService from '../services/anecdotes.js'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    data: {
      type,
      value,
      onChange,
    },
    reset
  }
}

const AnecdoteContext = createContext()
export const AnecdoteContextProvider = (props) => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
      anecdoteService.getAll().then(data => setAnecdotes(data))
    }, [])

    const addAnecdote = (object) => {
      anecdoteService.createNew(object).then(data => {
        setAnecdotes(anecdotes.concat(data))
      })
    }

    const deleteAnecdote = (anecdoteId) => {
      anecdoteService.remove(anecdoteId).then(() => {
        setAnecdotes(anecdotes.filter(a => a.id !== anecdoteId))
      })
    }

  return (
    <AnecdoteContext.Provider value={{ anecdotes, addAnecdote, deleteAnecdote }}>
      {props.children}
    </AnecdoteContext.Provider>
  )
}

export const useAnecdotes = () => useContext(AnecdoteContext)