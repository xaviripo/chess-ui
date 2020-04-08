import { combineReducers } from "redux";
import game from './game';
import messageQueue from './messageQueue';

// Completely replace client state with received server state
const reducer = combineReducers({
  game,
  messageQueue,
});

export default reducer;