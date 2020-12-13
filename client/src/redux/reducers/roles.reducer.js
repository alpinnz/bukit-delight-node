const initialState = {
  data: [],
};

const ServicesReducer = (state = initialState, action) => {
  if (action.type === "Roles/UPDATE") {
    return {
      ...state,
      data: action.payload,
    };
  }

  return state;
};
export default ServicesReducer;
