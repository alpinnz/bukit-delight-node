import { LOADING, SET_ROLES } from "./../actions/roles.action";

const initialState = {
  loading: false,
  data: [],
};

const RolesReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ROLES) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  return state;
};
export default RolesReducer;
