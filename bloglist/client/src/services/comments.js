import axios from "axios";
const baseUrl = "/api/blogs";

const create = async (newComment) => {
  const url = `${baseUrl}/${newComment.blogId}/comments`
  /*
  const config = {
    headers: { Authorization: token },
  };
  */
  const res = await axios.post(url, newComment);
  return res.data;
};

export default { create };