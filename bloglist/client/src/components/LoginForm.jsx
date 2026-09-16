import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useLoginActions } from "../store";
import { useField } from "../hooks"

const LoginForm = () => {
  const { login } = useLoginActions();
  const username = useField({
    type: 'text',
    placeholder: 'username'
  })
  const password = useField({
    type: 'password',
    placeholder: 'password'
  })
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      username: username.data.value,
      password: password.data.value
    });
    navigate("/");
    username.reset()
    password.reset()
  };

  const style = {
    margin: "0.5rem 0rem 1rem 0rem",
  };

  return (
    <div>
      <h2>Log in to appplication</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <TextField
              variant="standard"
              { ...username.data }
              sx={style}
            />
          </label>
        </div>
        <div>
          <TextField
            variant="standard"
            { ...password.data }
            sx={style}
          />
        </div>
        <Button type="submit" variant="contained">
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
