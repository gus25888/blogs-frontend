import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

const blog = {
  'id': '5a422a851b54a676234d17f7',
  'title': 'React patterns',
  'author': 'Michael Chan',
  'url': 'https://reactpatterns.com/',
  'likes': 7,
  'user': '675c99e55cab73162fd45b8a'
}
const user = {
  'id': '675c99e55cab73162fd45b8a',
  'username': 'pperez',
  'name': 'Pedro Perez',
}

const updateBlog = vi.fn()
const deleteBlog = vi.fn()

test('renders only title and author at the beginning ', () => {
  const { container } = render(<Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)

  const titleDiv = container.querySelector('.blogTitle')
  const detailsDiv = container.querySelector('.blogDetails')
  expect(titleDiv).toHaveTextContent(
    `"${blog.title}" by ${blog.author}`
  )
  expect(detailsDiv).toHaveStyle('display: none')

})

test('url and likes are shown when user clicks "show" button', async () => {

  const { container } = render(<Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)

  const showButton = screen.getByText('show')
  const detailsDiv = container.querySelector('.blogDetails')

  const userSession = userEvent.setup()
  await userSession.click(showButton)

  expect(detailsDiv).toHaveTextContent(`${blog.url}`)
  expect(detailsDiv).toHaveTextContent(`likes: ${blog.likes}`)

})



test('if user clicks "like" button twice, there are two controller calls', async () => {
  render(<Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)
  const showButton = screen.getByText('show')

  const userSession = userEvent.setup()
  await userSession.click(showButton)

  const likesButton = screen.getByText('like', { selector: 'button' })

  await userSession.click(likesButton)
  await userSession.click(likesButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})