// Viestit listaan.
// Näytetään [0], poistetaan viimeinen kun HIDE
const initialState = {
  messages: [null],
  errorMessages: [null],
}

// oma häntä ja alku
const tail = arr => (arr.length > 0 ? arr.filter((elem, ind) => ind > 0) : [null])
const init = arr => (arr.length > 0 ? arr.filter((elem, ind) => ind < arr.length - 1) : [null])

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW':
      return state.messages[0] === null
        ? { ...state, messages: [action.payload.message] }
        : { ...state, messages: [action.payload.message, ...state.messages] }
    case 'HIDE':
      return state.messages.length === 1
        ? { ...state, messages: [null] }
        : { ...state, messages: init(state.messages) }
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
