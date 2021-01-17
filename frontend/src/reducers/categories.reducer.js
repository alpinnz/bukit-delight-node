import { MOUNT, LOADING, SET_CATEGORIES } from "./../actions/categories.action";

const initialState = {
  mount: false,
  loading: false,
  data: [],
};

const CategoriesReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
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
export default CategoriesReducer;
