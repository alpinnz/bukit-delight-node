import {
  MOUNT,
  LOADING,
  REMOVE_ACCOUNT,
  SET_ACCOUNT,
} from "./../actions/authentication.action";

const initialState = {
  mount: false,
  loading: false,
  account: null,
};

const AuthenticationReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ACCOUNT) {
    return {
      ...state,

      loading: false,
      account: action.payload,
    };
  }

  if (action.type === REMOVE_ACCOUNT) {
    return {
      ...state,
      loading: false,
      account: null,
    };
  }

  return state;
};
export default AuthenticationReducer;
