const get = () => (window.localStorage.getItem("BlogAppUser"));
const save = (user) => window.localStorage.setItem("BlogAppUser", JSON.stringify(user));
const clear = () => window.localStorage.removeItem("BlogAppUser");

export default { get, save, clear }