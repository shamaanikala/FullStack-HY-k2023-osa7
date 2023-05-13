const initialState = {
  message: null,
  errorMessage: null,
}

const notificationReducer = (state = initialState, action) => {
  console.log(
    `notificationReducer ${action.type}: action: ${JSON.stringify(action)} `
  )
  switch (action.type) {
    case 'SHOW':
      return { message: action.payload.message, ...state }
    case 'HIDE':
      return { message: null, ...state }
    case 'SHOW_ERROR':
      return { errorMessage: action.payload.errorMessage, ...state }
    case 'HIDE_ERROR':
      return { errorMessage: null, ...state }
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

export const setError = errorMessage => {
  return {
    type: 'SHOW_ERROR',
    payload: {
      errorMessage,
    },
  }
}

export const hideError = () => {
  return {
    type: 'HIDE_ERROR',
  }
}

export default notificationReducer
