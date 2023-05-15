const userReducer = (state = null, action) => {
  console.log(`userReducer: type: ${action.type}`)
  switch (action.type) {
    default:
      return state
  }
}

export default userReducer
