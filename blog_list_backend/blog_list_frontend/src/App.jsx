import { useState, useEffect, useRef } from 'react'
import './App.css'
import blogRequests from './requests/blogs'
import {
  Togglable,
  Blog,
  Button,
  ErrorMessage,
  Notification,
  LoginForm,
  BlogForm,
} from './components'
import loginService from './requests/login'

function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  const getBlogs = () => {
    blogRequests.getAll().then((data) => {
      data.sort((a, b) => {
        return b.likes - a.likes
      })
      console.log('sorted', data)
      setBlogs(data)
    })
  }
  useEffect(getBlogs, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogRequests.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogRequests.setToken(user.token)
      setUser(user)
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage('Wrong username or password')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      } else {
        console.error('Login error:', error.message)
      }
    }
    console.log('logging in with', userObject.username, userObject.password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('You are now logged out')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogRequests.createBlog(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      getBlogs()
      setNotification('New blog added to the collection')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('All fields must be filled in')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = (blog) => {
    console.log(blog.likes)

    blogRequests
      .updateLikes(blog.id, blog)
      .then(() => console.log('update done'))
      .then(getBlogs)
  }

  const handleDelete = (blog) => {
    if (
      window.confirm(`Do you want to delete ${blog.title} by ${blog.author}`)
    ) {
      blogRequests
        .deleteBlog(blog.id)
        .then(() => console.log('removed'))
        .then(getBlogs)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <div>
        {user === null ? (
          <Togglable showContent="Log In" hideContent="Cancel">
            <LoginForm createUser={handleLogin} />
          </Togglable>
        ) : (
          <div>
            <p>{user.name} logged in</p>
            <Togglable
              showContent="New Blog"
              hideContent="Cancel"
              ref={blogFormRef}
            >
              <BlogForm createBlog={handleNewBlog} />
            </Togglable>
            <ul>
              {blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  author={blog.author}
                  title={blog.title}
                  url={blog.url}
                  likes={blog.likes}
                  user={blog.user.name}
                  onLikeClick={() => handleLike(blog)}
                >
                  {user.username === blog.user.username ? (
                    <Button
                      onClick={() => handleDelete(blog)}
                      text={'Delete'}
                    />
                  ) : null}
                </Blog>
              ))}
            </ul>
            <Button onClick={handleLogout} text={'Log out'} />
          </div>
        )}
      </div>
      made by Cajsa
    </div>
  )
}

export default App
