import { useState, useId } from 'react'
import {
  Button,
  Menu,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'

import { Check } from '@mui/icons-material'

const Dropdown = ({ blogs, setBlogs }) => {
  const options = ['title', 'author', 'most likes']
  const [checked, setChecked] = useState({
    'most likes': true
  })

  const changeSort = option => {
    handleClose()
    setChecked({ [option]: true })
    switch (option) {
    case 'most likes':
      setBlogs(blogs.toSorted((a, b) => b.likes - a.likes))
      break
    default:
      setBlogs(blogs.toSorted((a, b) => a[option].toUpperCase() < b[option].toUpperCase() ? -1 : 1))
    }
  }

  const id = useId()
  const menuId = `${id}-menu`
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant="outlined"
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
      >
        sort by
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          {options.map(option => {
            return (
              <MenuItem
                key={option}
                role="menuitemcheckbox"
                selected={Boolean(checked[option])}
                onClick={() => changeSort(option)}
              >
                <ListItemIcon>
                  {checked[option] ? <Check fontSize="small" /> : null}
                </ListItemIcon>
                <ListItemText>{option}</ListItemText>
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
    </>
  )
}

export default Dropdown