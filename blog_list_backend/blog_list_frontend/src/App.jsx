import { useState, useEffect } from 'react'
import './App.css'
import blogRequests from "./requests/blogs"
import { Blog, ErrorMessage, Notification, LoginForm, BlogForm } from "./components"
import loginService from './requests/login'

function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  const getBlogs = () => {
    blogRequests
      .getAll()
      .then(data => {
        console.log('promise fulfilled', data)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogRequests.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setUsername('')
    setPassword('')
    console.log("logging in with", username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('You are now logged out')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = { title: blogTitle, author: blogAuthor, url: blogUrl }
    const response = await blogRequests.createBlog(newBlog)
    setNotification('New blog added to the collection')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
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
      .then(() => console.log("update done"))
      .then(getBlogs)
  }




  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />

      {user === null ?
        <LoginForm
          onSubmit={handleLogin}
          typeUN='text'
          valueUN={username}
          nameUN='Username'
          onChangeUN={({ target }) => setUsername(target.value)}
          typePW='text'
          valuePW={password}
          namePW='Password'
          onChangePW={({ target }) => setPassword(target.value)}
        /> :
        <div>
          <p>{user.name} logged in</p>
          <BlogForm
            onSubmit={handleNewBlog}
            typeT='text'
            title={blogTitle}
            nameT='Title'
            onChangeT={({ target }) => setBlogTitle(target.value)}
            typeA='text'
            author={blogAuthor}
            nameA='Author'
            onChangeA={({ target }) => setBlogAuthor(target.value)}
            typeU='url'
            url={blogUrl}
            nameU='URL'
            onChangeU={({ target }) => setBlogUrl(target.value)}
            onClick={handleLogout}
          />
          <ul>
            {blogs.map(blog => <Blog
              key={blog.id}
              author={blog.author}
              title={blog.title}
              likes={blog.likes}
              onClick={() => handleLike(blog)}
              text={"like"} />)
            }
          </ul>
        </div>
      }

    </div>
  )
}

export default App
