import { Alert } from '@mui/material'
import styled from 'styled-components'

const StyledAlert = styled(Alert)`
  margin-top: 1rem;
`

const Notification = ({ toast }) => {
  /*
  let mystyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (toast.error) {
    mystyle = {
      ...mystyle,
      color: 'red'
    }
  }

  return (
    <div style={mystyle}>
      <p>{toast.message}</p>
    </div>
  )
  */

  return(
    <StyledAlert severity={toast.type}>
      {toast.message}
    </StyledAlert>
  )
}

export default Notification