const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // klikattavan tekstin idea tämän perusteella:
  // https://stackoverflow.com/questions/43630991/by-clicking-text-how-to-change-clicked-text-to-another-text-in-react-js
  // eli luultavasti melkein mihin tahansa tagiin voi lisätä onClick()

  return (
    <div style={blogStyle}>
      <div>
        <span onClick={() => console.log('blogin nimeä klikattu')}>{blog.title}</span>
          <button onClick={() => console.log('blogin view klikattu')}>view</button> 
      </div>
    </div>
  )
}

export default Blog