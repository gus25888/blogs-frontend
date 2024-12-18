const BlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, handleCreateBlog }) => (
  <form className="blogForm" onSubmit={handleCreateBlog}>
    <div>
      <label htmlFor="title">title</label>
      <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      <label htmlFor="author">author</label>
      <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      <label htmlFor="url">url</label>
      <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">Create</button>
  </form>
)

export default BlogForm