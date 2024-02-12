const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const BLOGS_URL = '/api/blog_list';
const USERS_URL = '/api/users';
const LOGIN_URL = '/api/login';

const defaultBlog = {
  title: 'Melvins promise',
  author: 'Melvin',
  url: 'https://melvin.com/',
};

const defaultUser = {
  username: 'Mebba',
  name: 'Melvin Nummelin',
  password: 'mebbaBebba',
};

const login = (username, password) => {
  const requestBody = {
    username,
    password,
  };
  return api
    .post(LOGIN_URL)
    .send(requestBody);
};

const getAllBlogs = (token) => api
  .get(BLOGS_URL)
  .set('Authorization', `Bearer ${token}`);

const postBlog = async (token, newBlog = defaultBlog) => {
  return api
    .post(BLOGS_URL)
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`);
};

const getBlogById = (token, id) => api
  .get(`${BLOGS_URL}/${id}`)
  .set('Authorization', `Bearer ${token}`);

const deleteBlogById = (token, id) => api
  .delete(`${BLOGS_URL}/${id}`)
  .set('Authorization', `Bearer ${token}`);

const updateTitleOfBlog = (token, id, blog) => api
  .put(`${BLOGS_URL}/${id}`)
  .send(blog)
  .set('Authorization', `Bearer ${token}`);

const getAllUsers = () => api
  .get(USERS_URL);

const postUser = (newUser = defaultUser) => api
  .post(USERS_URL)
  .send(newUser);

module.exports = {
  getAllBlogs,
  postBlog,
  getBlogById,
  deleteBlogById,
  updateTitleOfBlog,
  getAllUsers,
  postUser,
  login,
};
