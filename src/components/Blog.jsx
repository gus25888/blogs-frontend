import { useState } from "react"

const Blog = ({ user, blog, updateBlog, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const visibility = { display: detailsVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const updateLikes = (blog) => {
    const { id, title, author, url, user } = blog
    const blogToUpdate = { title, author, url, user: user.id, likes: blog.likes + 1 }
    updateBlog(id, blogToUpdate)
  }

  const removeBlog = (blog) => {
    if (confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div className="blogTitle">
        {`"${blog.title}" by ${blog.author}`}
        <button onClick={toggleVisibility}>{(detailsVisible ? 'hide' : 'show')}</button>
      </div>
      <div className="blogDetails" style={visibility}>
        <a href={blog.url}>{blog.url}</a>
        <span>{`likes: ${blog.likes}`} <button onClick={() => updateLikes(blog)}>like</button></span>
        <span>{blog.user.name}</span>
        {(blog.user.username === user.username) ? <button onClick={() => removeBlog(blog)}>remove</button> : null}
      </div>
    </div>
  )
}
export default Blog