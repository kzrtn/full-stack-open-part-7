import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <>
      {!visible ?(
        <button onClick={toggleVisible}>{props.buttonLabel}</button>)
        :(<>
          {props.children}
          <button onClick={toggleVisible}>cancel</button>
        </>)}
    </>
  )
}

export default Togglable