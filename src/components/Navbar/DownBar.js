import { AppBar, Avatar, createTheme, ThemeProvider } from '@material-ui/core';
import { Container, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import HomeIconOutlined from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import SearchIconOutlined from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/AddBox";
import AddIconOutlined from "@mui/icons-material/AddBoxOutlined";
import ProfileIcon from "@mui/icons-material/Person";

import { getUser } from '../../actions/auth';

import useStyles from './styles';

const locations = ['home', 'search', 'create', 'profile'];

const DownBar = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const theme = createTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [selected, setSelected] = useState('home');
    const [show, setShow] = useState(true);

    const currentUser = useSelector(state => state.auth.user);
    const showDownBar = useSelector(state => state.auth.showDownBar);
    const { darkMode } = useSelector(state => state.settings);

    const handleClick = (navigation) => {
        setSelected(navigation);
        navigate(`/${navigation}`);
    }

    useEffect(() => {
        dispatch(getUser({ id: user?.result?._id }));
    }, []);

    useEffect(() => {
        const pathName = location.pathname;
        setShow(true);

        if (locations.includes(pathName.split('/')[1])) {
            if (pathName.includes('profile') && (!user || !pathName.includes(currentUser?._id))) return;

            setSelected(pathName.split('/')[1]);
        }

        if(pathName.includes('messages') || pathName.includes('savedPosts') || pathName.includes('posts/')) {
            setSelected('');
            setShow(false);
        }
    }, [location]);

    if(!show || !showDownBar) return <></>;

    return (
        <ThemeProvider theme={theme} >
            <Container id='downbar' maxWidth='xxl' style={{ padding: 0, borderTop: darkMode ? '1px solid gray' : '1px solid lightgray' }} className={classes.downBarContainer} >
                <AppBar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: darkMode && 'black' }} position="static" color="inherit" elevation={0}>
                    <Container maxWidth='lg' className={classes.downBar} style={{ display: 'flex', width: '100%' }}>
                        <IconButton onClick={() => handleClick('home')}>
                            <Tooltip title='Home'>
                                {selected === 'home' ? <HomeIcon htmlColor={darkMode ? 'white' : 'none'} fontSize='large' /> : <HomeIconOutlined htmlColor={darkMode ? 'white' : 'none'} fontSize='large' />}
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => handleClick('search')} >
                            <Tooltip title={t('search')}>
                                {selected === 'search' ? <SearchIcon htmlColor={darkMode ? 'white' : 'none'} sx={{ stroke: darkMode ? "white" : "gray", strokeWidth: 1.5 }} fontSize='large' /> : <SearchIconOutlined htmlColor={darkMode ? 'white' : 'none'} fontSize='large' />}
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => handleClick('create')} >
                            <Tooltip title={t('add_post')}>
                                {selected === 'create' ? <AddIcon htmlColor={darkMode ? 'white' : 'none'} fontSize='large' /> : <AddIconOutlined htmlColor={darkMode ? 'white' : 'none'} fontSize='large' />}
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => { navigate(currentUser ? `/profile/${currentUser?._id}` : '/profile404'); setSelected('profile'); }}>
                            <Tooltip title={t('profile')}>
                                {currentUser ? (
                                    <Avatar style={{ border: selected === 'profile' && `3px solid ${darkMode ? 'white' : 'black'}` }} src={currentUser?.imageUrl} referrerPolicy='no-referrer' ></Avatar>
                                ) : (
                                    <Avatar style={{ border: selected === 'profile' && `3px solid ${darkMode ? 'white' : 'black'}` }} ><ProfileIcon fontSize='large' /></Avatar>
                                )}
                            </Tooltip>
                        </IconButton>
                    </Container>
                </AppBar>
            </Container>
        </ThemeProvider>
    );
}

export default DownBar;