import {
  FETCH_USERS_SUCCESS,
  FETCH_USERS_REQUEST,
  FETCH_USERS_FAILURE,
} from "./../actions/users.action";

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const UsersReducer = (state = initialState, action) => {
  if (action.type === FETCH_USERS_REQUEST) {
    return { ...state, loading: true };
  }
  if (action.type === FETCH_USERS_SUCCESS) {
    return { ...state, loading: true, users: action.payload, error: "" };
  }
  if (action.type === FETCH_USERS_FAILURE) {
    return { ...state, loading: false, users: [], error: action.payload };
  }
  return state;
};
export default UsersReducer;
