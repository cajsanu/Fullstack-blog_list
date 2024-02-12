const bcrypt = require('bcrypt');
const integTestHelper = require('../utils/integration_test_helper');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user1 = new User({ username: 'Success', name: 'C', passwordHash });
  await user1.save();
});

afterEach(async () => {
  await User.deleteMany({});
})

describe('initial test', () => {
  test('one user', async () => {
    const oneUser = await integTestHelper.getAllUsers();
    expect(oneUser.type).toBe('application/json');
    expect(oneUser.status).toBe(200);
    expect(oneUser.body[0].id).toBeDefined();
  });
});

describe('tests for post', () => {
  test('adding one more user', async () => {
    const usersBeforePost = await integTestHelper.getAllUsers();
    const addedUser = await integTestHelper.postUser();
    const usersAfterPost = await integTestHelper.getAllUsers();
    expect(usersAfterPost.body).toHaveLength(usersBeforePost.body.length + 1);
    expect(addedUser.body.username).toContain('Mebba');
  });

  test('adding user fails if username taken', async () => {
    const usersAtStart = await integTestHelper.getAllUsers();
    const newUser = {
      username: 'Success',
      name: 'A',
      password: 'abrakadabra',
    };
    const response = await integTestHelper.postUser(newUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Username already taken');
    const usersAtEnd = await integTestHelper.getAllUsers();
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length);
  });

  test('adding user fails if password is shorter than 10 characters', async () => {
    const newUser = {
      username: 'Shorty',
      name: 'AA',
      password: '1',
    };
    const response = await integTestHelper.postUser(newUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('password must be more than 10 characters');
  });
});
