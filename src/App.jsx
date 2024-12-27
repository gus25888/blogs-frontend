import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggable from './components/Toggable'

const messageTypes = {
  SUCCESS: 'success',
  ERROR: 'error'
}

const App = () => {
  const USER_LOGIN = 'blogListUser'

  /* ********* Refs   ********* */

  const blogFormRef = useRef()

  /* ********* States ********* */

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [messageText, setMessageText] = useState(null)
  const [messageType, setMessageType] = useState('')

  /* *********  Effects  ********* */

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_LOGIN)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  /* ********* Functions ********* */

  const showMessage = (message, type) => {
    setMessageText(message)
    setMessageType(type)
    setTimeout(() => setMessageText(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(USER_LOGIN, JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage('wrong username or password', messageTypes.ERROR)
      console.error(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(USER_LOGIN)
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try {
      const blogCreated = await blogService.create(newBlog)

      if (blogCreated) {
        setBlogs(blogs.concat(blogCreated))

        showMessage(`blog "${blogCreated.title}" by ${blogCreated.author} added`, messageTypes.SUCCESS)

        blogFormRef.current.toggleVisibility()
      }
    } catch (exception) {
      const errorMessage = exception.response?.data.error
      showMessage(`${errorMessage || 'server error'}`, messageTypes.ERROR)
      console.error(exception)
    }
  }

  const updateBlog = async (id, blog) => {
    try {
      const blogUpdated = await blogService.update(id, blog)

      if (blogUpdated) {
        const { id: blogId } = blogUpdated

        setBlogs(blogs.filter(blog => blog.id !== blogId).concat(blogUpdated))
        showMessage(`likes updated for blog "${blogUpdated.title}"`, messageTypes.SUCCESS)
      }
    } catch (exception) {
      const errorMessage = exception.response?.data.error
      showMessage(`${errorMessage || 'server error'}`, messageTypes.ERROR)
      console.error(exception)
    }
  }

  const deleteBlog = async (id, blog) => {
    try {
      await blogService.deleteRegister(id, blog)

      setBlogs(blogs.filter(blog => blog.id !== id))
      showMessage('blog deleted', messageTypes.SUCCESS)

    } catch (exception) {
      const errorMessage = exception.response?.data.error
      showMessage(`${errorMessage || 'server error'}`, messageTypes.ERROR)
      console.error(exception)
    }
  }
  /* ********* Final Display ********* */
  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {LoginForm({ username, password, handleLogin, setUsername, setPassword })}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification notificationText={messageText} notificationType={messageType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h3>Add new Blog</h3>
      <Toggable buttonLabel={'Create New Blog'} ref={blogFormRef}>
        <BlogForm addBlog={createBlog} />
      </Toggable>
      <h3>Blogs added</h3>
      {
        /* blogs are sorted in descending order */
        blogs
          .sort((a, b) => (a.likes > b.likes) ? -1 : (a.likes < b.likes) ? 1 : 0)
          .map(blog => <Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)
      }
    </div>
  )
}

export default App