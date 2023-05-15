const initialState = {
  messages: [null],
  errorMessages: [null],
}

// oma häntä
const tail = arr => (arr.length > 0 ? arr.filter((elem, ind) => ind > 0) : [null])

const notificationReducer = (state = initialState, action) => {
  console.log(`notificationReducer: ${action.type}`)
  switch (action.type) {
    case 'SHOW':
      // ensin ...state, jos on { ...state }, niin tuo ylikirjoittaa kaikki staten arvoilla
      return {
        ...state,
        messages: [action.payload.message, ...tail(state.messages)],
      }
    case 'HIDE':
      return state.messages.length === 1
        ? { ...state, messages: [null] }
        : { ...state, messages: tail(state.messages) }
    case 'FORCE_HIDE':
      return { ...state, messages: [null] }
    case 'SHOW_ERROR':
      return {
        ...state,
        errorMessages: [action.payload.errorMessage, ...tail(state.errorMessages)],
      }
    case 'HIDE_ERROR':
      return state.errorMessages.length === 1
        ? { ...state, errorMessages: [null] }
        : { ...state, errorMessages: tail(state.errorMessages) }
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

export const hideNotification = (force = false) => {
  if (force) {
    return {
      type: 'FORCE_HIDE',
    }
  } else {
    return {
      type: 'HIDE',
    }
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

// prettier-ignore
export const showNotification =
  (message, duration = 5000) =>
    dispatch => {
      dispatch(setNotification(message))
      setTimeout(() => dispatch(hideNotification()), duration)
    }

// prettier-ignore
export const showError = (message, duration = 5000) => dispatch => {
  dispatch(setError(message))
  setTimeout(() => dispatch(hideError()), duration)
}

export default notificationReducer
