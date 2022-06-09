import { AUTH, GET_USER, LOGOUT, HANDLE_SCROLLING, AUTH_LOADING, AUTH_UNLOADING, UPDATE_LOCALSTORAGE, DELETE_USER, HANDLE_DOWNBAR_SHOW } from "../constants/actionTypes";

const noErrors = {
    email: '',
    name: '',
    userName: '',
    password: '',
    confirmPassword: '',
    broadcast: '',
}

const defaultState = {
    user: null, 
    storageUser: null, 
    scroll: false, 
    error: noErrors, 
    isLoading: false, 
    showDownBar: true,
}

const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case AUTH:
            const payload = action?.data;
            const data = {
                result: {
                    _id: payload?.result._id,
                    name: payload?.result.name,
                    userName: payload?.result.userName,
                    email: payload?.result.email,
                },
                token: payload?.token
            }

            localStorage.setItem('profile', JSON.stringify({ ...data }));

            return { ...state, user: payload?.result, error: noErrors, storageUser: { ...data } };
        case LOGOUT:
            localStorage.removeItem('profile');

            return { ...state, user: null, error: noErrors, storageUser: null };
        case DELETE_USER:
            localStorage.removeItem('profile');
            
            return { ...state, user: null, storageUser: null, error: noErrors };
        case GET_USER:
            return { ...state, user: action?.data, error: noErrors };
        case HANDLE_SCROLLING:
            return { ...state, scroll: action?.data };
        case AUTH_LOADING:
            return { ...state, isLoading: true };
        case AUTH_UNLOADING:
            return { ...state, isLoading: false };
        case UPDATE_LOCALSTORAGE:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));

            return { ...state, storageUser: { ...action?.payload } };
        case HANDLE_DOWNBAR_SHOW:
            return { ...state, showDownBar: action?.data };
        default:
            return state;
    }
}

export default authReducer;