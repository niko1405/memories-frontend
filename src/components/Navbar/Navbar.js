import { AppBar, Avatar, Button, ListItemIcon, Divider, ListItemText, createTheme, ThemeProvider, Container, MenuItem, Tooltip, Menu, useMediaQuery, TextField, InputBase, IconButton, Paper } from "@material-ui/core";
import { Autocomplete, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProfileIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SavedPostsIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import MessageIcon from '@mui/icons-material/NearMe';
import MessageIconOutlined from '@mui/icons-material/NearMeOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import decode from 'jwt-decode';

import useStyles from './styles';

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import memoriesTextWhite from '../../images/memoriesTextWhite.png';

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../actions/auth";
import { LOGOUT } from "../../constants/actionTypes";
import { getPostsBySearch } from "../../actions/posts";
import { searchProfiles } from "../../actions/profile";
import { useTranslation } from "react-i18next";

const mix = (...arrays) => {
    const transposed = arrays.reduce((result, row) => {
        row?.forEach((value, i) => result[i] = [...result[i] || [], value]);
        return result;
    }, []);
    return transposed.flat();
};

const emptyUserSettings = {
    show: false,
    anchorEl: null,
}

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = createTheme();
    const smDivise = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();

    const [search, setSearch] = useState('');
    const [userSettings, setUserSettings] = useState(emptyUserSettings);
    const [loading, setLoading] = useState(false);
    const [showMessages, setShowMessages] = useState(false);

    const userData = useSelector(state => state.auth.user);
    const { darkMode } = useSelector(state => state.settings);
    const { searchPosts } = useSelector(state => state.posts);
    const { profiles } = useSelector(state => state.profile);

    const searchResults = mix(profiles, searchPosts);

    useEffect(() => {
        if (user && !userData) dispatch(getUser({ id: user.result._id }));
    }, []);

    const handleProfileClick = (e) => {
        setUserSettings({ show: !userSettings.show, anchorEl: e.currentTarget });
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);

        dispatch(getPostsBySearch(e.target.value, true, setLoading));
        dispatch(searchProfiles(e.target.value, undefined, setLoading));
    }

    const handleCloseUserSettings = () => {
        setUserSettings({ show: false, anchorEl: null });
    }

    const logout = () => {
        handleCloseUserSettings();

        dispatch({ type: LOGOUT });

        setUser(null);

        navigate('/auth');
    }

    const handleOpenProfile = (e) => {
        handleCloseUserSettings();

        navigate(`/profile/${user.result?._id}`);
    }

    const handleOpenSettings = (e) => {
        handleCloseUserSettings();

        navigate('/settings');
    }

    const handleOpenSavedPosts = (e) => {
        handleCloseUserSettings();

        navigate('/savedPosts');
    }

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));

        if(!location.pathname.includes('messages')) setShowMessages(false);
        else setShowMessages(true);
    }, [location]);

    const handleSearchProfileClick = (id) => {
        setSearch('');
        document.activeElement.blur();
        navigate(`/profile/${id}`);
    }

    const handlePostClick = (id) => {
        setSearch('');
        document.activeElement.blur();
        navigate(`/posts/${id}`);
    }

    const handleClickMessages = () => {
        setShowMessages(true);

        navigate('/messages');
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" style={{ width: '100%', padding: 0, display: 'flex', zIndex: 100, position: 'sticky', top: 0, marginBottom: theme.spacing(1) }} >
                <AppBar style={{ borderBottom: darkMode ? '1px solid gray' : '1px solid lightgray', backgroundColor: darkMode && 'black' }} position="static" color="inherit" elevation={0}>
                    <Container maxWidth='lg' className={classes.contentContainer} >
                        <Link to="/" className={classes.brandContainer}>
                            <img src={darkMode ? memoriesTextWhite : memoriesText} alt="icon" height={theme.spacing(3)} />
                            <img className={classes.image} src={memoriesLogo} alt="icon" height={theme.spacing(4)} />
                        </Link>
                        {!smDivise && !location.pathname.includes('search') && !location.pathname.includes('messages') && (
                            <Autocomplete
                                disablePortal
                                freeSolo
                                getOptionLabel={(searchResults) => {
                                    if(typeof searchResults === 'string') return searchResults;
                                    return `${searchResults.title ? `${searchResults.title} ${searchResults.name} ${searchResults.tags.map((tag) => `#${tag} `)}`
                                     : `${searchResults.userName} ${searchResults.description}`}`}
                                }
                                options={searchResults}
                                sx={{ width: 300 }}
                                noOptionsText={t('no_results')}
                                renderOption={(props, searchResults) => (
                                    <>
                                        {searchResults.title ? (
                                            <Container onClick={() => handlePostClick(searchResults._id)} style={{ zIndex: 100, padding: theme.spacing(1), cursor: 'pointer', display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
                                                <img alt={searchResults.title} src={searchResults.selectedFile} style={{ maxWidth: 60, maxHeight: 60 }} />
                                                <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                                    <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='black'><b>{searchResults.title}</b></Typography>
                                                    <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='gray'>{searchResults.tags.length <= 2 ? searchResults.tags.map((tag) => `#${tag} `) : searchResults.tags.slice(0, 2).map((tag) => `#${tag} `)}</Typography>
                                                </Container>
                                            </Container>
                                        ) : (
                                            <Container onClick={() => handleSearchProfileClick(searchResults._id)} style={{ zIndex: 100, padding: theme.spacing(1), cursor: 'pointer', display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
                                                <Avatar className={classes.profileAvatar} alt={searchResults.userName} src={searchResults.imageUrl} />
                                                <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                                    <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='black'><b>{searchResults.userName}</b></Typography>
                                                    <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='gray'>{searchResults.description.length <= 30 ? searchResults.description : searchResults.description.substring(0, 30) + '..'}</Typography>
                                                </Container>
                                            </Container>
                                        )}
                                    </>
                                )}
                                renderInput={(params) => (
                                    <Paper onClick={(e) => { }} style={{ width: '300px', display: 'flex', alignItems: 'center', backgroundColor: '#ebebeb', position: 'relative' }} elevation={0} >
                                        <IconButton style={{ cursor: 'default' }} >
                                            <SearchIcon />
                                        </IconButton>
                                        <TextField
                                            style={{ paddingRight: theme.spacing(1) }}
                                            placeholder={t('search_placeholder')}
                                            onChange={handleSearch}
                                            value={search}
                                            variant='standard'
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                                disableUnderline: true,
                                            }}
                                        />
                                    </Paper>
                                )}
                            />
                        )}
                        {user ? (
                            <>
                                <IconButton style={{ position: 'absolute', right: 60, zIndex: 100 }} onClick={handleClickMessages}>
                                    <Tooltip title={t('messages')}>
                                        {showMessages ? (
                                            <MessageIcon fontSize="medium" htmlColor={darkMode ? 'white' : 'none'} />
                                        ) : (
                                            <MessageIconOutlined fontSize="medium" htmlColor={darkMode ? 'white' : 'none'} />
                                        )}
                                    </Tooltip>
                                </IconButton>
                                <Tooltip title={t('user_profile')}>
                                    <Avatar className={classes.profileAvatar} alt={user?.result.name} src={userData?.imageUrl}
                                        style={{ border: `1px solid ${darkMode ? 'white' : 'black'}`, }}
                                        id="profile-button"
                                        aria-controls={userSettings.show ? 'user-settings-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={userSettings.show ? 'true' : undefined}
                                        onClick={handleProfileClick}
                                        referrerPolicy='no-referrer'
                                    >
                                        {user?.result.name.charAt(0)}
                                    </Avatar>
                                </Tooltip>
                            </>
                        ) : (
                            <Button component={Link} to="/auth" variant="contained" color="primary">{t('sign_in')}</Button>
                        )}
                        {/* showUserSettings */}
                        <Menu
                            id="user-settings-menu"
                            anchorEl={userSettings.anchorEl}
                            open={userSettings.show}
                            onClose={handleCloseUserSettings}
                            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                            PaperProps={{
                                style: {
                                    width: 250,
                                    transform: 'translateY(55px)'
                                }
                            }}
                        >
                            <MenuItem onClick={handleOpenProfile}>
                                <ListItemIcon>
                                    <ProfileIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{t('profile')}</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleOpenSettings}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{t('settings')}</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleOpenSavedPosts}>
                                <ListItemIcon>
                                    <SavedPostsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{t('saved_posts')}</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{t('logout')}</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Container>
                </AppBar>
            </Container>
        </ThemeProvider >
    );


}

export default Navbar;
