import Blog from './Blog'

const Blogs = ({ blogs, handleLike, handleRemove, user }) => {
  return (
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#creating_displaying_and_sorting_an_array
    // listan järjestämisen vertailufunktio tuon avulla
    blogs.map(blog => (
      <Blog key={blog.id} user={user} blog={blog} like={handleLike} remove={handleRemove} />
    ))
  )
}

export default Blogs
