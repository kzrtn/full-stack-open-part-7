import { useEffect } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import { Container, AppBar, Button, Toolbar, Typography } from "@mui/material";
import styled from "styled-components";
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 5px;
`;

import CssBaseLine from "@mui/material/CssBaseline";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";

import {
  useNotification,
  useBlog,
  useBlogActions,
  useLogin,
  useLoginActions,
  useUsers,
  useUsersActions
} from "./store";
import Users from "./components/Users";
import User from "./components/User";

const App = () => {
  const blogs = useBlog();
  const setBlogs = useBlogActions();
  const toast = useNotification();
  const loginUser = useLogin();
  const setUser = useLoginActions();
  const users = useUsers();
  const setUsers = useUsersActions();

  useEffect(() => {
    setBlogs.init();
  }, [setBlogs.init]);

  useEffect(() => {
    setUser.init();
  }, [setUser.init]);

  useEffect(() => {
    setUsers.getAll();
  }, [setUsers.getAll]);

  const match = useMatch("/blog/:id");
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  const userMatch = useMatch("/users/:id");
  const user = userMatch ? users.find((u) => u.id === userMatch.params.id) : null;

  return (
    <Container>
      <CssBaseLine />
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Blog App</Typography>
          <Button color="inherit">
            <StyledLink to="/">blogs</StyledLink>
          </Button>
          <Button color="inherit">
            <StyledLink to="/users">users</StyledLink>
          </Button>
          {!loginUser && (
            <Button color="inherit">
              <StyledLink to="/login">login</StyledLink>
            </Button>
          )}
          {loginUser && (
            <Button color="inherit">
              <StyledLink to="/create">new blog</StyledLink>
            </Button>
          )}
          {loginUser && (
            <Button color="inherit" onClick={setUser.logout}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {toast.message && <Notification toast={toast} />}
      <ErrorBoundary>
        <Routes>
          <Route path="/blog/:id" element={<Blog blog={blog} />} />

          <Route path="/users/:id" element={<User user={user} />} />

          <Route path="/" element={<BlogList />} />

          <Route path="/login" element={<LoginForm />} />

          <Route path="/create" element={<BlogForm />} />

          <Route path="/users" element={<Users users={users} />} />

          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
