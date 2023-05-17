const BlogView = ({ blog }) => {
  if (!blog) {
    return <div>loading blog information...</div>
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <em>by {blog.author}</em>
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes} likes <button>like</button>
        </p>
        <p>added by {blog.user.name}</p>
      </div>
    </div>
  )
}

export default BlogView
