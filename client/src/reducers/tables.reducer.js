import { LOADING, SET_TABLES } from "./../actions/tables.action";

const initialState = {
  loading: false,
  data: [],
};

const TablesReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_TABLES) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  return state;
};
export default TablesReducer;
