const initialState = {
  data: [],
};

const AcctionsReducer = (state = initialState, action) => {
  if (action.type === "SET_ACCOUNT") {
    return { ...state, account: action.payload, loggedIn: true };
  }
  if (action.type === "LOG_OUT") {
    return { ...state, account: {}, loggedIn: false };
  }
  return state;
};
export default AcctionsReducer;
