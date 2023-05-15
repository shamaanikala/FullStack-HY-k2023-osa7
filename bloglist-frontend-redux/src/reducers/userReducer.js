// käytetään aluksi ihan vain user oliota tilana,
// jonka sisällä on token
// const initialState = {
//   user: null,
//   token: null,
// }

const userReducer = (state = null, action) => {
  console.log(`userReducer: type: ${action.type}`)
  switch (action.type) {
    case 'SET_USER':
      //return { ...state, user: action.payload }
      return action.payload
    // case 'SET_TOKEN':
    //   return { ...state, token: action.payload }
    default:
      return state
  }
}

export const setUser = user => {
  return {
    type: 'SET_USER',
    payload: user,
  }
}

export default userReducer
