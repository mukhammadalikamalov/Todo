const initalState = {
	loading: false,
	todos: [],
	error: null,
  };
  
  const todosReducer = (state = initalState, action) => {
	switch (action.type) {
	  case "Request":
		return {
		  ...state,
		  loading: true,
		};
	  case "Todo Success":
		return {
		  ...state,
		  todos: action.payload,
		  loading: false,
		};
	  case "Fetch Todo Fail":
		return {
		  ...state,
		  loading: false,
		  error: action.payload,
		};
	  case "ADD_TODO":
		return {
		  ...state,
		  todos: [...state.todos, action.payload],
		};
	  case "REMOVE_TODO":
		return {
		  ...state,
		  todos: state.todos.filter((_todo, index) => index !== action.payload),
		};
	  default:
		return state;
	}
  };
  
  export default todosReducer;
  