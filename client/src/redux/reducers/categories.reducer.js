const initialState = {
  data: [],
  form: {
    open: false,
    type: "",
    validate: false,
    data: [
      {
        name: {
          value: "",
          error: "",
        },
        desc: {
          value: "",
          error: "",
        },
        image: {
          value: "",
          error: "",
        },
      },
    ],
  },
};

const CategoriesReducer = (state = initialState, action) => {
  if (action.type === "Categories/UPDATE") {
    return { ...state, data: action.payload };
  }
  return state;
};
export default CategoriesReducer;
