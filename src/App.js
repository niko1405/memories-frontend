import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Profile from './components/Profile/Profile';
import { Container } from '@material-ui/core';
import DownBar from './components/Navbar/DownBar';
import Create from './components/Create/Create';
import ErrMessage from './components/ErrMessage/ErrMessage';
import Search from './components/Search/Search';
import Posts from './components/Posts/Posts';
import EmailSent from './components/Auth/EmailSent/EmailSent';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ForgotPassword/ChangePassword';
import Settings from './components/Settings/Settings';
import { useDispatch, useSelector } from 'react-redux';
import NetworkDetector from './components/NetworkDetector/NetworkDetector';
import ScrollIntoView from './components/ScrollIntoView/ScrollIntoView';

import { getTheme, getLanguage } from './actions/settings';
import SavedPosts from './components/SavedPosts/SavedPosts';
import Messages from './components/Messages/Messages';
import { useTranslation } from 'react-i18next';

const App = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    
    const { storageUser } = useSelector(state => state.auth);
    const { darkMode: darkModeStorage, language } = useSelector(state => state.settings);

    const [darkMode, setDarkMode] = useState(darkModeStorage || false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile'))?.result);

    useEffect(() => {
        if(user) {
            dispatch(getTheme(user._id));
            dispatch(getLanguage(user._id));
        }
    }, []);

    useEffect(() => {
        if ((storageUser !== null && JSON.parse(localStorage.getItem('profile'))?.result)
            || (storageUser == null && !JSON.parse(localStorage.getItem('profile'))?.result)){
                setUser(storageUser);
            }
    }, [storageUser]);

    useEffect(() => {
        setDarkMode(darkModeStorage)
    }, [darkModeStorage]);

    useEffect(() => i18n.changeLanguage(language), [language]);

    return (
        <BrowserRouter>
            <Container maxWidth="xl" style={{ position: 'absolute', minHeight: '100vh', margin: 0, padding: 0, backgroundColor: darkMode && 'black' }}>
                <NetworkDetector />
                <Navbar />
                <Container style={{ padding: 0, marginBottom: document.getElementById('downbar')?.clientHeight + 8 || '80px' }} >
                    <ScrollIntoView>
                        <Routes>
                            <Route path="/" exact element={<Navigate to='/home' />} />
                            <Route path="/home" exact element={<Posts />} />
                            <Route path="/profile/:id" exact element={<Profile />} />
                            <Route path="/profile404" element={<ErrMessage maxWidth='lg' title={t('sign_in_profile')} />} />
                            <Route path="/posts/search" exact element={<Posts />} />
                            <Route path="/posts/:id" element={<PostDetails />} />
                            <Route path="/auth" exact element={!user ? <Auth /> : <Navigate to='/home' />} />
                            <Route path="/settings" exact element={user ? <Settings /> : <Navigate to='/auth' />} />
                            <Route path="/search" exact element={<Search />} />
                            <Route path="/create" exact element={<Create />} />
                            <Route path="/create/:id" exact element={<Create />} />
                            <Route path="/emailVer/:id" exact element={<EmailSent />} />
                            <Route path="/forgotPassword" exact element={<ForgotPassword />} />
                            <Route path="/changePw/:id" exact element={<ChangePassword />} />
                            <Route path="/savedPosts" exact element={user ? <SavedPosts /> : <Navigate to='/auth' />} />
                            <Route path="/messages" exact element={user ? <Messages /> : <Navigate to='/auth' />} />
                            <Route path="/messages/:id" exact element={user ? <Messages /> : <Navigate to='/auth' />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </ScrollIntoView>
                </Container>
                <DownBar />
            </Container>
        </BrowserRouter>
    );
}

export default App;