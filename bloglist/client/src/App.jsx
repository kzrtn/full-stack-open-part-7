import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import { Container, AppBar, Button, Toolbar, Typography } from "@mui/material";
import styled from "styled-components";
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 5px;
`;

import CssBaseLine from "@mui/material/CssBaseline";

import blogService from "./services/blogs";
import loginService from "./services/login";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";

import { useNotification, useNotificationAction, useBlog, useBlogActions, useUser, useUserActions } from "./store";

/*
const IS_ERROR = true
const NOT_ERROR = false
*/

const App = () => {
  const blogs = useBlog()
  const setBlogs = useBlogActions()
  const toast = useNotification();
  const showNotification = useNotificationAction();
  //const [user, setUser] = useState(null);
  const user = useUser();
  const setUser = useUserActions();

  useEffect(() => {
    setBlogs.init();
  }, [setBlogs.init])

  useEffect(() => {
    setUser.init();
  }, [setUser.init]);

  const handleLogin = async (userObj) => {
    try {
      const user = await loginService.login(userObj);
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("BlogAppUser", JSON.stringify(user));
      showNotification("success", `${user.name} successfully logged in.`);
    } catch (error) {
      showNotification("error", `Invalid credentials. Error: ${error}`);
    }
  };

  const logout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("BlogAppUser");
    showNotification("success", "Successfully logged out.");
  };

  const match = useMatch("/blog/:id");
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  return (
    <Container>
      <CssBaseLine />
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Blog App</Typography>
          <Button color="inherit">
            <StyledLink to="/">blogs</StyledLink>
          </Button>
          {!user && (
            <Button color="inherit">
              <StyledLink to="/login">login</StyledLink>
            </Button>
          )}
          {user && (
            <Button color="inherit">
              <StyledLink to="/create">new blog</StyledLink>
            </Button>
          )}
          {user && (
            <Button color="inherit" onClick={logout}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {toast.message && <Notification toast={toast} />}
      <ErrorBoundary>
        <Routes>
          <Route
            path="/blog/:id"
            element={
              <Blog
                blog={blog}
                user={user}
              />
            }
          />

          <Route
            path="/"
            element={
              <BlogList blogs={blogs} setBlogs={setBlogs} toast={toast} />
            }
          />

          <Route
            path="/login"
            element={<LoginForm loginService={handleLogin} />}
          />

          <Route
            path="/create"
            element={<BlogForm />}
          />

          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
