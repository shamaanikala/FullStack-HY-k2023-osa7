const blogReducer = (state = [], action) => {
  console.log(`blogRducer: state: ${JSON.stringify(state)}`, action)
  switch (action.type) {
    default:
      return state
  }
}

export default blogReducer
