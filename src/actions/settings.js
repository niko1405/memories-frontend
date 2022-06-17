import * as api from '../api';
import { AUTH_LOADING, AUTH_UNLOADING, CHANGE_LANGUAGE, CHANGE_THEME, UPDATE_NOTIFICATIONS, UPDATE_PERS_INFO } from '../constants/actionTypes';

export const changeLanguage = (id, language) => async (dispatch) => {
    await api.changeLanguage(id, language).then(() => {
        dispatch({ type: CHANGE_LANGUAGE, payload: language });
    }).catch(err => console.log(err.response.data.message));
}

export const changeTheme = (id, darkMode) => async (dispatch) => {
    await api.changeTheme(id, darkMode).then(() => {
        dispatch({ type: CHANGE_THEME, payload: darkMode });
    }).catch(err => console.log(err.response.data.message));
}

export const changeThemeSetting = (theme) => (dispatch) => {
    dispatch({ type: CHANGE_THEME, payload: theme === 'dark' ? true : false });
}

export const getTheme = (id) => async (dispatch) => {
    await api.getTheme(id).then(({ data }) => {
        dispatch({ type: CHANGE_THEME, payload: data.darkMode });
    }).catch(err => console.log(err.response.data.message));
}

export const getLanguage = (id) => async (dispatch) => {
    await api.getLanguage(id).then(({ data }) => {
        dispatch({ type: CHANGE_LANGUAGE, payload: data.language });
    }).catch(err => console.log(err.response.data.message));
}

export const updatePersInfo = (id, persInfo, setRemark, emptyRemark) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING  });

    await api.updatePersInfo(id, persInfo).then(({ data }) => {
        dispatch({ type: UPDATE_PERS_INFO, payload: persInfo });
        setRemark({ status: 'successfull', message: data.message });
    }).catch(err => setRemark({ status: 'error', message: err.response.data.message}));

    setTimeout(() => setRemark(emptyRemark), 1000 * 4);
    dispatch({ type: AUTH_UNLOADING  });
}

export const getPersInfo = (id, setPersInfo) => async (dispatch) => {
    await api.getPersInfo(id).then(({ data }) => {
        dispatch({ type: UPDATE_PERS_INFO, payload: data.persInfo });
        setPersInfo({ ...data.persInfo });
    }).catch(err => console.log(err.response.data.message));
}

export const updateNotifications = (id, notifications) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING  });

    await api.updateNotifications(id, notifications).then(() => {
        dispatch({ type: UPDATE_NOTIFICATIONS, payload: notifications });
    }).catch(err => console.log(err.response.data.message));

    dispatch({ type: AUTH_UNLOADING  });
}

export const getNotifications = (id, setNotifications = null) => async (dispatch) => {
    await api.getNotifications(id).then(({ data }) => {
        dispatch({ type: UPDATE_NOTIFICATIONS, payload: data.notifications });

        if(setNotifications) setNotifications({ ...data.notifications });
    }).catch(err => console.log(err.response.data.message));
}