const initialState = {
  message: null,
}

const notificationReducer = (state = initialState, action) => {
  console.log('notificationReducer: action: ', action)
  switch (action.type) {
    case 'SHOW':
      return { message: action.payload.message }
    case 'HIDE':
      return { message: null }
    default:
      return state
  }
}

export const setNotification = message => {
  return {
    type: 'SHOW',
    payload: {
      message,
    },
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE',
  }
}

export default notificationReducer
