import { useState } from "react"

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const visibility = { display: detailsVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <div className="blog">
      <div className="blogTitle">
        {`"${blog.title}" by ${blog.author}`}
        <button onClick={toggleVisibility}>{(detailsVisible ? 'hide' : 'show')}</button>
      </div>
      <div className="blogDetails" style={visibility}>
        <span>{blog.url}</span>
        <span>{`likes: ${blog.likes}`} <button onClick={() => console.log('like', blog.title)}>like</button></span>
        <span>{blog.user.name}</span>
      </div>
    </div>
  )
}
export default Blog