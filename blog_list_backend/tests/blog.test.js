const listHelper = require('../utils/list_helper');
const blogs = require('../utils/testBlogs');

describe('Total likes', () => {
  test('of all blogs', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });
});

describe('The blog with most likes', () => {
  test('of blog list', () => {
    expect(listHelper.favouriteBlog(blogs)).toEqual(blogs[2]);
  });
});

describe('Most blogs', () => {
  test('by one author', () => {
    expect(listHelper.mostBlogs(blogs).author).toEqual('Robert C. Martin');
  });
});

describe('Author with most likes', () => {
  test('in blog list', () => {
    expect(listHelper.mostLikes(blogs).author).toEqual('Edsger W. Dijkstra');
  });
});
