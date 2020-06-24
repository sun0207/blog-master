import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { user } from './user';
import { home } from './home';
import { articles } from './articles';
import { message } from './message';
const rootReducer = history =>
  combineReducers({
    user,
    home,
    articles,
    message,
    router: connectRouter(history),
  });

export default rootReducer;