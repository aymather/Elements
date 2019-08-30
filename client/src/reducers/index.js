import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import retreatReducer from './retreatReducer';

export default combineReducers({
    user: authReducer,
    error: errorReducer,
    retreats: retreatReducer
})