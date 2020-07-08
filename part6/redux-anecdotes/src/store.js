import { createStore } from "redux";
import reducer from "./reducers/anecdoteReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(reducer, composeWithDevTools());

export default store;
