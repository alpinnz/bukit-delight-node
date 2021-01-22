import { MOUNT, LOADING, SET_FAVORITES } from "./../actions/favorites.action";

const initialState = {
  mount: false,
  loading: false,
  data: [],
};

const FavoritesReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_FAVORITES) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  return state;
};
export default FavoritesReducer;
