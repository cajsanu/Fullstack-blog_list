import { useState, useEffect } from 'react'
import './App.css'
import blogRequests from "./requests/blogs"
import { Blog } from "./components"

function App() {
  const [blogs, setBlogs] = useState([])

  const getBlogs = () => {
    blogRequests
      .getAll()
      .then(data => {
        console.log('promise fulfilled', data)
        setBlogs(data)
      })
  }
  useEffect(getBlogs, [])

  const handleLike = (blog) => {
    console.log(blog.likes)
    
    blogRequests
      .updateLikes(blog.id, blog)
      .then(() => console.log("update done"))
      .then(getBlogs)
    console.log("done")
  }

  return (
    <>
      hello bloggers
      <ul>
        {blogs.map(blog => <Blog
          key={blog.id}
          author={blog.author}
          title={blog.title}
          likes={blog.likes}
          onClick={() => handleLike(blog)}
          text={"like"}/>)
        }
      </ul>
    </>
  )
}

export default App
