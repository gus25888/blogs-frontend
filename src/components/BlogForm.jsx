const BlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, handleCreateBlog }) => {
  const formStyle = {
    'marginLeft': 5,
    'marginBottom': 30,
  }
  const labelStyle = {
    'marginRight': 5,
    'width': 50,
    'display': 'inline-block'
  }
  return (
    <form style={formStyle} onSubmit={handleCreateBlog}>
      <div>
        <label style={labelStyle} htmlFor="title">title</label>
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="author">author</label>
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="url">url</label>
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>)
}

export default BlogForm