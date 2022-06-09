import * as api from '../api';
import { AUTH, AUTH_ERROR, AUTH_LOADING, AUTH_UNLOADING, GET_USER, LOAD_CURRENT_USER, LOGOUT, UPDATE_LOCALSTORAGE } from '../constants/actionTypes';
import { getLanguage, getNotifications, getTheme } from './settings';

const noErrors = {
    email: '',
    name: '',
    userName: '',
    password: '',
    confirmPassword: '',
    broadcast: '',
}

export const signin = (formData, navigate, setError) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.signIn(formData).then(({ data }) => {
        dispatch({ type: AUTH_UNLOADING });

        dispatch({ type: AUTH, data });
        dispatch(getTheme(data.result._id));
        dispatch(getLanguage(data.result._id));
        dispatch(getNotifications(data.result._id));

        navigate('/');
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setError({ ...noErrors, [err?.response?.data?.target || 'broadcast']: err?.response?.data?.message || 'An error occured when try to sign in. Try Again Later.' });
    });
}

export const signup = (formData, setError, setEmailVer) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.signUp(formData).then(({ data }) => {
        dispatch({ type: AUTH_UNLOADING });

        setEmailVer(true);
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setError({ ...noErrors, [err?.response?.data?.target || 'broadcast']: err?.response?.data?.message || 'An error occured when try to sign up. Try Again Later.' });
    });
}

export const activateUser = (id, setError) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.activateUser(id).then(() => {
        dispatch({ type: AUTH_UNLOADING });

        setError('');
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setError(err.response.data.message);
    });
}

export const googleSignIn = (googleData, navigate, setError) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.googleSignIn(googleData).then(({ data }) => {
        dispatch({ type: AUTH_UNLOADING });

        dispatch({ type: AUTH, data });
        dispatch(getTheme(data.result._id));
        dispatch(getLanguage(data.result._id));
        dispatch(getNotifications(data.result._id));

        navigate('/');
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setError({ ...noErrors, [err?.response?.data?.target || 'broadcast']: err?.response?.data?.message || 'An error occured when try to sign in with Google. Try Again Later.' });
    });
}

export const getUser = query => async (dispatch) => {
        await api.getUser(query).then(({ data }) => {
            dispatch({ type: GET_USER, data });
    
            dispatch({ type: LOAD_CURRENT_USER, data });
        }).catch(err => console.log(err));
}

export const forgotPassword = (email, setRemark) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.forgotPassword(email).then(({ data }) => {
        dispatch({ type: AUTH_UNLOADING });

        setRemark({ message: data.message, error: false });
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setRemark({ message: err.response.data.message, error: true });
    });
}

export const changePassword = (id, password, setRemark, setLogin) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    api.changePassword(id, password).then(({ data }) => {
        dispatch({ type: AUTH_UNLOADING });

        setRemark({ message: data.message, error: false, type: 'broadcast' });
        setLogin(true);
    }).catch(err => {
        dispatch({ type: AUTH_UNLOADING });

        setRemark({ message: err.response.data.message, error: true, type: 'broadcast' });
    });
}

export const deleteAccount = (id, setRemark) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    await api.deleteAccount(id).then(({ data }) => {
        setRemark({ status: 'successfull', message: data.message });
    }).catch(err => {
        setRemark({ status: 'error', message: err.response.data.message });
    });

    dispatch({ type: AUTH_UNLOADING });
}

export const changeUsername = (id, userName, setRemark, storageUser) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    await api.changeUsername(id, userName).then(({ data }) => {
        setRemark({ status: 'successfull', message: data.message });

        api.refreshPosts(storageUser.result.userName, userName);

        storageUser.result.userName = userName;
        
        dispatch({ type: UPDATE_LOCALSTORAGE, payload: { ...storageUser } });
    }).catch(err => {
        setRemark({ status: 'error', message: err.response.data.message });
    });

    dispatch({ type: AUTH_UNLOADING });
}