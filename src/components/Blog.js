const Blog = ({blog}) => (
  <div>
    {blog.title}
    <button onClick={() => console.log('blogin view klikattu')}>view</button> 
  </div>  
)

export default Blog