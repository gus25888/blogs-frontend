const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logOut = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, blog) => {
  const { title, author, url } = blog
  await page.getByRole('button', { name: 'Create New Blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill(author)
  await page.getByRole('textbox', { name: 'url' }).fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}


const getBlogDetails = async (page, blog) => {
  const blogTitle = `"${blog.title}" by ${blog.author}`

  const blogContainer = await page.locator('.blog').filter({ hasText: blogTitle })
  await blogContainer.getByRole('button', { name: 'show' }).click()

  const blogDetails = await blogContainer.locator('.blogDetails')
  return blogDetails
}

const giveLikes = async (page, blog) => {
  const blogTitle = `"${blog.title}" by ${blog.author}`
  const blogContainer = await page.locator('.blog', { hasText: blogTitle })
  await blogContainer.getByRole('button', { name: 'show' }).click()
  await blogContainer.getByRole('button', { name: 'like' }).click()
  await blogContainer.getByRole('button', { name: 'hide' }).click()
}

export { createBlog, getBlogDetails, giveLikes, loginWith, logOut }