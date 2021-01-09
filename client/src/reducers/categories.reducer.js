import { LOADING, SET_CATEGORIES } from "./../actions/categories.action";

const initialState = {
  loading: false,
  data: [],
};

const AccountsReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_CATEGORIES) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  return state;
};
export default AccountsReducer;
