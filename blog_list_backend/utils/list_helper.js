const _ = require('lodash');

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favouriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  return blogs.find((blog) => blog.likes === Math.max(...likes));
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const authorWithMostBlogs = _.chain(authors)
    .countBy()
    .toPairs()
    .maxBy(1)
    .value();
  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  };
};

const mostLikes = (blogs) => {
  const sumOfLikes = (blogsOfAuthor) => _.sum(blogsOfAuthor.map((blog) => blog.likes));
  const authors = _.groupBy(blogs, 'author');
  const most = _.chain(authors)
    .mapValues(sumOfLikes)
    .toPairs()
    .maxBy(1)
    .value();
  return {
    author: most[0],
    likes: most[1],
  };
};

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
