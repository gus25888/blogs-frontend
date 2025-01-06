const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, giveLikes, loginWith, logOut } = require('./helper')

const DEFAULT_TIMEOUT = 20_000
const user = {
  name: 'Test User',
  username: 'testuser',
  password: 'JwkEyB6cC8FmM3Nq',
}

const anotherUser = {
  name: 'Anonymous User',
  username: 'anonymous',
  password: 'JwkEyB6cC8FmM3Nq'
}

const firstBlog = {
  'title': 'Type wars',
  'author': 'Robert C. Martin',
  'url': 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
}

const secondBlog = {
  'title': 'Go To Statement Considered Harmful',
  'author': 'Edsger W. Dijkstra',
  'url': 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
}

const thirdBlog = {
  'title': 'React patterns',
  'author': 'Michael Chan',
  'url': 'https://reactpatterns.com/',
}


describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('/api/reset')
    // crea un usuario para el backend aquí
    await request.post('/api/users', { data: { ...user } })
    await request.post('/api/users', { data: { ...anotherUser } })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    const loginButton = page.getByRole('button', { name: 'Login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)
      await expect(page.getByText(user.name + ' logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password.split('').reverse().join(''))
      await expect(page.getByText(user.name + ' logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, firstBlog)
      const blogContainer = await page.locator('.blog')
      await expect(blogContainer.getByText(`"${firstBlog.title}" by ${firstBlog.author}`)).toBeVisible()
    })


    describe('with one blog created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, secondBlog)
        await page.locator('.notification').waitFor({ state: 'detached', timeout: DEFAULT_TIMEOUT })
      })

      test('a blog can get more likes', async ({ page }) => {
        const likesQuantity = 0
        const blogContainer = await page.locator('.blog')
        const blogCreated = await blogContainer.getByText(`"${secondBlog.title}" by ${secondBlog.author}`)
        await blogCreated.getByRole('button', { name: 'show' }).click()

        const blogDetails = await blogContainer.locator('.blogDetails')
        await expect(blogDetails.locator('.likes')).toHaveText(`likes: ${likesQuantity}`)
        await blogDetails.getByRole('button', { name: 'like' }).click()
        await page.locator('.notification').waitFor({ state: 'detached', timeout: DEFAULT_TIMEOUT })
        await expect(blogDetails.locator('.likes')).toHaveText(`likes: ${likesQuantity + 1}`)
      })

      test('a blog can be deleted', async ({ page }) => {
        const blogContainer = await page.locator('.blog')
        const blogCreated = await blogContainer.getByText(`"${secondBlog.title}" by ${secondBlog.author}`)
        await blogCreated.getByRole('button', { name: 'show' }).click()

        const blogDetails = await blogContainer.locator('.blogDetails')
        await blogDetails.getByRole('button', { name: 'remove' }).click()
        page.on('dialog', async (dialog) => {
          await dialog.accept()
          await expect(blogCreated).not.toBeVisible()
        })

      })

      test('only be deleted by its creator', async ({ page }) => {
        await logOut(page)
        await loginWith(page, anotherUser.username, anotherUser.password)

        const blogContainer = await page.locator('.blog')
        const blogCreated = await blogContainer.getByText(`"${secondBlog.title}" by ${secondBlog.author}`)
        await blogCreated.getByRole('button', { name: 'show' }).click()

        const blogDetails = await blogContainer.locator('.blogDetails')
        await expect(blogDetails.getByRole('button', { name: 'remove' })).not.toBeVisible()

      })


    })


    describe('with a list of blogs created', () => {

      const blogsList = [
        { blog: firstBlog, likes: 0 },
        { blog: secondBlog, likes: 2 },
        { blog: thirdBlog, likes: 1 }
      ]

      beforeEach(async ({ page }) => {

        for (let i = 0; i < blogsList.length; ++i) {

          const blogItem = blogsList[i]

          await createBlog(page, blogItem.blog)
          await page.locator('.notification').waitFor({ state: 'detached', timeout: DEFAULT_TIMEOUT })

          for (let i = 0; i < blogItem.likes; ++i) {
            await giveLikes(page, blogItem.blog)
            await page.locator('.notification').waitFor({ state: 'detached', timeout: DEFAULT_TIMEOUT })
          }
        }

      })

      test('blogs are in ascending order by likes', async ({ page }) => {
        const blogTitles = page.locator('.blogTitle')

        await expect(blogTitles.nth(0)).toHaveText(`"${blogsList[1].blog.title}" by ${blogsList[1].blog.author}show`)
        await expect(blogTitles.nth(1)).toHaveText(`"${blogsList[2].blog.title}" by ${blogsList[2].blog.author}show`)
        await expect(blogTitles.nth(2)).toHaveText(`"${blogsList[0].blog.title}" by ${blogsList[0].blog.author}show`)

      })


    })


  })



})