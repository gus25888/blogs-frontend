/*
5.16: Pruebas de Listas de Blogs, paso 4
Haz una prueba para el nuevo formulario de blog. La prueba debe verificar que el formulario llama al controlador de eventos que recibió como props con los detalles correctos cuando se crea un nuevo blog.
*/
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'
import blogs from '../services/blogs'

test('<BlogForm /> calls onSubmit with the correct data', async () => {
  const addBlog = vi.fn()
  const userSession = userEvent.setup()

  const blog = {
    'id': '5a422a851b54a676234d17f7',
    'title': 'React patterns',
    'author': 'Michael Chan',
    'url': 'https://reactpatterns.com/',
    'likes': 7,
    'user': '675c99e55cab73162fd45b8a'
  }

  render(<BlogForm addBlog={addBlog} />)

  const inputTitle = screen.getByLabelText('title:')
  const inputAuthor = screen.getByLabelText('author:')
  const inputUrl = screen.getByLabelText('url:')
  const sendButton = screen.getByRole('button', { name: 'Create' })

  await userSession.type(inputTitle, blog.title)
  await userSession.type(inputAuthor, blog.author)
  await userSession.type(inputUrl, blog.url)
  await userSession.click(sendButton)

  const dataSent = addBlog.mock.calls[0][0]

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(dataSent.title).toBe(blog.title)
  expect(dataSent.author).toBe(blog.author)
  expect(dataSent.url).toBe(blog.url)
})