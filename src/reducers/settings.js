import { CHANGE_LANGUAGE, CHANGE_THEME, UPDATE_NOTIFICATIONS, UPDATE_PERS_INFO } from '../constants/actionTypes';

const defaultState = { 
    darkMode: false, 
    notifications: { 
        enable: true,
        fromUs: true, 
        directMessages: true, 
        following_followers: true, 
        posts_comments: true 
    }, 
    language: 'en', 
    persInfo: { email: '', phoneNumb: '', gender: '', birth: '' } 
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return { ...state, darkMode: action.payload }
        case CHANGE_LANGUAGE:
            return { ...state, language: action.payload }
        case UPDATE_PERS_INFO:
            return { ...state, persInfo: action.payload }
        case UPDATE_NOTIFICATIONS:
            return { ...state, notifications: action.payload }
        default:
            return state;
    }
}

export default reducer;