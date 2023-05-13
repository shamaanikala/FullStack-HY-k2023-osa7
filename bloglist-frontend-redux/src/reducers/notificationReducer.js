const initialState = {
  message: null,
  errorMessage: null,
}

const notificationReducer = (state = initialState, action) => {
  console.log(
    `notificationReducer ${action.type}: action: ${JSON.stringify(
      action
    )}, state: `,
    state
  )
  switch (action.type) {
    case 'SHOW':
      // ensin ...state, jos on { ...state }, niin tuo ylikirjoittaa kaikki staten arvoilla
      return { ...state, message: action.payload.message }
    case 'HIDE':
      return { ...state, message: null }
    case 'SHOW_ERROR':
      return { ...state, errorMessage: action.payload.errorMessage }
    case 'HIDE_ERROR':
      return { ...state, errorMessage: null }
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
