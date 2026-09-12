import { useState, useEffect } from 'react'
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

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = (object) => {
    anecdoteService.createNew(object).then(data => {
      setAnecdotes(anecdotes.concat(data))
    })
  }
  
  return {
    anecdotes,
    addAnecdote
  }
}