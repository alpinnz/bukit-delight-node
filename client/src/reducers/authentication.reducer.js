const initialState = {
  account: {},
  isLogin: false,
};

const AuthenticationReducer = (state = initialState, action) => {
  if (action.type === "Authentication/LOGIN") {
    return { ...state, account: action.payload, isLogin: true };
  }
  if (action.type === "Authentication/LOGOUT") {
    return { ...state, account: {}, isLogin: false };
  }
  return state;
};
export default AuthenticationReducer;
