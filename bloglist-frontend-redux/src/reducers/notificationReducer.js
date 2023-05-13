const initialState = {
  message: '',
  type: null,
}

const notificationReducer = (state = initialState, action) => {
  console.log('notificationReducer: action: ', action)
  switch (action.type) {
    case 'SHOW':
      return { message: action.payload.message, type: action.payload.type }
    case 'HIDE':
      return { message: '', type: null }
    default:
      return state
  }
}

export default notificationReducer
