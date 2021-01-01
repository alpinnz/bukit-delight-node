const initialState = {
  data: [],
  useForm: {
    open: false,
    type: null,
    row: {},
  },
  formData: {},
};

const TablesReducer = (state = initialState, action) => {
  if (action.type === "Tables/UPDATE") {
    return { ...state, data: action.payload };
  }
  return state;
};
export default TablesReducer;
