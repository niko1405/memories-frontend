import { combineReducers } from "redux";

import posts from './posts';
import auth from './auth'
import profile from './profile';
import settings from './settings';

export default combineReducers({
    posts,
    auth,
    profile,
    settings,
});