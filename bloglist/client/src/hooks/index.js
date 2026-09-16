import { useState } from "react"

export const useField = ({type, placeholder}) => {
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
      placeholder
    },
    reset
  }
}