import { Link } from "react-router-dom";

const Users = () => {
  const blogs = useBlog()

  return (
    <div>
      <h2>Users</h2>
      <div>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Link to={`users/${user.id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
