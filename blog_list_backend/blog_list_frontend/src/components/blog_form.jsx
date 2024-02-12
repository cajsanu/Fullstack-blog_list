import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({ title: blogTitle, author: blogAuthor, url: blogUrl })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <div>
              title
            <input
              type="text"
              placeholder='Blog title'
              id='title'
              value={blogTitle}
              onChange={(event) => setBlogTitle(event.target.value)}
            />
          </div>
          <div>
              author
            <input
              type="text"
              placeholder='Blog author'
              id='author'
              value={blogAuthor}
              onChange={(event) => setBlogAuthor(event.target.value)}
            />
          </div>
          <div>
              URL
            <input
              type="text"
              placeholder='Blog url'
              id='URL'
              value={blogUrl}
              onChange={(event) => setBlogUrl(event.target.value)}
            />
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default BlogForm