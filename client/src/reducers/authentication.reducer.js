import {
  LOADING,
  REMOVE_ACCOUNT,
  SET_ACCOUNT,
  MOUNT,
} from "./../actions/authentication.action";

const initialState = {
  mount: false,
  loading: false,
  account: {},
  error: "",
};

const AuthenticationReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === SET_ACCOUNT) {
    return {
      ...state,
      mount: false,
      loading: false,
      account: action.payload,
      error: "",
    };
  }

  if (action.type === REMOVE_ACCOUNT) {
    return {
      ...state,
      mount: false,
      loading: false,
      account: {},
      error: "",
    };
  }

  return state;
};
export default AuthenticationReducer;
