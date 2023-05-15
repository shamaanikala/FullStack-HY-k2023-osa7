const initialState = {
  messages: [null],
  errorMessages: [null],
  messageId: 0,
  errorId: 0,
}

// oma häntä
const tail = arr =>
  arr.length > 0 ? arr.filter((elem, ind) => ind > 0) : [null]

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
        errorMessages: [
          action.payload.errorMessage,
          ...tail(state.errorMessages),
        ],
      }
    case 'HIDE_ERROR':
      return state.errorMessages === 1
        ? { ...state, errorMessages: [null] }
        : { ...state, errorMessages: tail(state.errorMessages) }
    case 'TIMEOUT_ERROR':
      return {
        ...state,
        errorId: action.payload.timeout,
      }
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

export const hideNotification = (timeoutId, force = false) => {
  if (force) {
    return {
      type: 'FORCE_HIDE',
    }
  } else {
    return {
      type: 'HIDE',
      payload: {
        timeoutId,
      },
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

export const hideError = timeoutId => {
  return {
    type: 'HIDE_ERROR',
    payload: {
      timeoutId,
    },
  }
}

export const setNotificationTimeout = timeout => {
  //console.log('setNotificationTimeout', timeout)
  return {
    type: 'TIMEOUT',
    payload: {
      timeout,
    },
  }
}

export const setErrorTimeout = timeout => {
  //console.log('setErrorTimeOut', timeout)
  return {
    type: 'TIMEOUT_ERROR',
    payload: {
      timeout,
    },
  }
}

export default notificationReducer
