import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { isMobile } from "react-device-detect";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import * as api from './api';

import reducers from './reducers';

import App from './App';
import './index.css';
import './components/ErrorPage/styles.css';
import { registerServiceWorker } from './worker';
import { HANDLE_DOWNBAR_SHOW } from './constants/actionTypes';

export const store = createStore(reducers, compose(applyMiddleware(thunk)));

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'de'],
    fallbackLng: "en",
    lng: store.getState().settings.language,
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json'
    },
    react: { useSuspense: false }
  });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

window.scrollTo(0, 0);

let subscription = undefined;

//Check for service worker
if('serviceWorker' in navigator){
    registerServiceWorker().then((sub) => subscription = sub);
}

export const sendPushNotification = async(id, title, message, icon = 'default') => {
    await api.sendPushNotification(id, subscription, { title, message, icon });
}

window.onclick = () => {
  if(!isMobile) return;

  const activeEl = document.activeElement;
  if(activeEl.tagName !== 'INPUT') return !store.getState().auth.showDownBar ? store.dispatch({ type: HANDLE_DOWNBAR_SHOW, data: true }) : null;

  store.dispatch({ type: HANDLE_DOWNBAR_SHOW, data: false });
}