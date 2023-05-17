const BlogView = ({ blog }) => {
  if (!blog) {
    return <div>loading blog information...</div>
  }
  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <em>by {blog.author}</em>
      </div>
      <br />
      <div>
        <div>{blog.url}</div>
        <div>
          {blog.likes} likes <button>like</button>
        </div>
        <div>added by {blog.user.name}</div>
      </div>
    </div>
  )
}

export default BlogView
