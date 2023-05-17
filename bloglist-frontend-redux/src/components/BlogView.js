const BlogView = ({ blog }) => {
  const like = id => console.log('Blog-sivu tykkäys', id)

  if (!blog) {
    return null
  }
  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <em>by {blog.author}</em>
      </div>
      <br />
      <div>
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          likes <span id="likes">{blog.likes}</span>{' '}
          <button className="likeBUtton" onClick={() => like(blog.id)}>
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
      </div>
    </div>
  )
}

export default BlogView
