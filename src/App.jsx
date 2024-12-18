import { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const messageTypes = {
  SUCCESS: 'success',
  ERROR: 'error'
}

const App = () => {
  const USER_LOGIN = 'blogListUser'

  /* ********* States ********* */

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      showMessage(`wrong username or password`, messageTypes.ERROR)
      console.error(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(USER_LOGIN)
    setUser(null)
  }


  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = { title, author, url, }

      const blogCreated = await blogService.create(newBlog)

      if (blogCreated) {
        setBlogs(blogs.concat(blogCreated))

        setTitle('')
        setAuthor('')
        setUrl('')
        showMessage(`blog "${blogCreated.title}" by ${blogCreated.author} added`, messageTypes.SUCCESS)
      }
    } catch (exception) {
      showMessage(`${exception.response.data.error || 'server error'}`, messageTypes.ERROR)
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
      {BlogForm({ title, author, url, setTitle, setAuthor, setUrl, handleCreateBlog })}
      <h3>Blogs added</h3>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App