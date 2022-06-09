import { Container, createTheme, Paper, ThemeProvider, Button, Dialog, MenuList, MenuItem, ListItemText, ListItemIcon, Divider, Tooltip, IconButton, Switch, Slide, Grid, TextField, CircularProgress } from "@material-ui/core";
import { Typography, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";

import Bell from '@mui/icons-material/NotificationsActive';
import Account from '@mui/icons-material/Person';
import Security from '@mui/icons-material/SecurityUpdateGood';
import Logout from '@mui/icons-material/Logout';
import Theme from '@mui/icons-material/ColorLens';
import Delete from '@mui/icons-material/DeleteForever';
import Language from '@mui/icons-material/Language';
import Key from '@mui/icons-material/Key';
import Username from '@mui/icons-material/Edit';
import ArrowBack from '@mui/icons-material/ArrowBack';

import useStyles from './styles';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import ChangePassword from "../ForgotPassword/ChangePassword";
import { CHANGE_THEME, DELETE_USER, LOGOUT } from "../../constants/actionTypes";
import { changeUsername, deleteAccount } from "../../actions/auth";
import { changeLanguage, changeTheme, getLanguage, getNotifications, getPersInfo, getTheme, updateNotifications, updatePersInfo } from "../../actions/settings";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const emptyRemark = {
    status: '',
    message: '',
}

const emptyFormData = {
    changeUsername: ''
}

const emptyPersInfo = {
    email: '',
    phoneNumb: '',
    gender: '',
    birth: '',
}

const emptyNotifications = {
    enable: true,
    fromUs: true,
    directMessages: true,
    following_followers: true,
    posts_comments: true
}

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const theme = createTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [tab, setTab] = useState('');
    const [notifications, setNotifications] = useState(emptyNotifications);
    const [remark, setRemark] = useState(emptyRemark);
    const [formData, setFormData] = useState(emptyFormData);
    const [persInfo, setPersInfo] = useState(emptyPersInfo);

    const { darkMode, language } = useSelector(state => state.settings);
    const { isLoading } = useSelector(state => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(getTheme(user.result._id));
            dispatch(getLanguage(user.result._id));
            dispatch(getPersInfo(user.result._id, setPersInfo));
            dispatch(getNotifications(user.result._id, setNotifications));
        }
    }, []);

    const changeTab = (tab) => {
        setTab(tab);
        setRemark(emptyRemark);
        setFormData(emptyFormData);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const logout = () => {
        dispatch({ type: LOGOUT });

        setTimeout(() => {
            navigate('/auth');
        }, 300);
    }

    const handleDeleteAcc = () => {
        dispatch(deleteAccount(user?.result?._id, setRemark));
    }

    const handleChangeUsername = (e) => {
        e.preventDefault();

        dispatch(changeUsername(user?.result?._id, formData.changeUsername, setRemark, user));
    }

    const handleThemeChange = (e) => {
        if (e.target.value === 'Dark') dispatch(changeTheme(user.result._id, true));
        else dispatch(changeTheme(user.result._id, false));
    }

    const handleLanguageChange = (e) => {
        if (e.target.value === 'en') dispatch(changeLanguage(user.result._id, 'en'));
        else dispatch(changeLanguage(user.result._id, 'de'));
    }

    const handleSubmitPersonalInformation = (e) => {
        e.preventDefault();

        dispatch(updatePersInfo(user.result._id, persInfo, setRemark, emptyRemark));
    }

    const handleUpdateNotifications = (e) => {
        const newState = { ...notifications, [e.target.name]: e.target.checked }
        setNotifications(newState);

        dispatch(updateNotifications(user.result._id, newState));
    }

    if (!tab.length) {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center', padding: 0, justifyContent: 'center', position: 'relative' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => navigate(-1)} style={{ position: 'absolute', left: 0, cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h4' color='primary' ><b>{t('settings')}</b></Typography>
                        </Container>
                        <MenuList >
                            <Divider style={{ marginBottom: theme.spacing(1) }} />
                            <MenuItem onClick={() => changeTab('notifications')}>
                                <ListItemIcon>
                                    <Bell />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('notifications')}</b></Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => changeTab('security')}>
                                <ListItemIcon>
                                    <Security />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('security')}</b></Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => changeTab('account')}>
                                <ListItemIcon>
                                    <Account />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('account')}</b></Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => changeTab('theme')}>
                                <ListItemIcon>
                                    <Theme />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('theme')}</b></Typography></ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' onClick={logout}><b>{t('logout')}</b></Typography></ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    //#region theme

    if (tab === 'theme') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h5' color='gray' ><b>{t('theme')}</b></Typography>
                        </Container>
                        <FormControl style={{ marginTop: theme.spacing(1), width: '100%' }}>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="Light" checked={!darkMode} onChange={handleThemeChange} control={<Radio />} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} label={<Typography variant='body1' color='gray' ><b>{t('light')}</b></Typography>} labelPlacement="start" disableTypography />
                                <FormControlLabel value="Dark" checked={darkMode} onChange={handleThemeChange} control={<Radio />} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} label={<Typography variant='body1' color='gray' ><b>{t('dark')}</b></Typography>} labelPlacement="start" disableTypography />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    //#endregion

    //#region account

    if (tab === 'account') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h5' color='gray' ><b>{t('account')}</b></Typography>
                        </Container>
                        <MenuList >
                            <MenuItem onClick={() => changeTab('personal-information')}>
                                <ListItemIcon>
                                    <Account />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('personal_information')}</b></Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => changeTab('language')}>
                                <ListItemIcon>
                                    <Language />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('language')}</b></Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => changeTab('username')}>
                                <ListItemIcon>
                                    <Username />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('change_username')}</b></Typography></ListItemText>
                            </MenuItem >
                            <Divider />
                            <MenuItem onClick={() => setRemark({ status: 'pending', message: '' })}>
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray'><b>{t('delete_account')}</b></Typography></ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Container>
                <Dialog open={remark.status.length > 0} TransitionComponent={Transition} >
                    <Container className={classes.deleteAcc} elevation={6} >
                        <Typography variant='h4' color='primary'><b>{t('delete_account')}</b></Typography>
                        <Typography style={{ paddingTop: theme.spacing(1) }} variant='h6' color='grey'>{t('delete_account_question')}</Typography>
                        <Typography style={{ paddingTop: theme.spacing(1) }} variant='h6' color='darkred'><b>{t('warning')}:</b></Typography>
                        <Typography style={{ paddingTop: theme.spacing(1), wordBreak: 'break-word' }} variant='h6' color='grey'>{t('delete_account_warning')}</Typography>
                        {isLoading ? (
                            <Container style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center' }}>
                                <CircularProgress />
                                <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='grey'>{t('loading')}</Typography>
                            </Container>
                        ) : (
                            <>
                                {remark.message.length > 0 ? (
                                    <Typography style={{ backgroundColor: remark.status === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5), marginTop: theme.spacing(2) }} variant='body1' color='grey'>{remark.message}</Typography>
                                ) : ''}
                            </>
                        )}
                        {remark.status === 'successfull' ? (
                            <Button style={{ marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={() => {
                                setRemark(emptyRemark);
                                dispatch({ type: DELETE_USER });
                            }} >Ok</Button>
                        ) : (
                            <Container style={{ display: 'flex', marginTop: theme.spacing(2), justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant='outlined' color='primary' onClick={() => setRemark(emptyRemark)} >{t('cancel')}</Button>
                                <Button style={{ marginLeft: theme.spacing(1) }} variant='contained' color='primary' onClick={handleDeleteAcc} >
                                    {remark.status === 'error' ? t('try_again') : t('yes')}
                                </Button>
                            </Container>
                        )}
                    </Container>
                </Dialog >
            </ThemeProvider >
        );
    }

    if (tab === 'personal-information') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('account')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h6' color='gray' ><b>{t('personal_information')}</b></Typography>
                        </Container>
                        <form className={classes.form} onSubmit={handleSubmitPersonalInformation}>
                            <Typography style={{ marginTop: theme.spacing(1) }} variant='body1' color='grey' >{t('provide_information')}</Typography>
                            <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                                <TextField style={{ marginTop: theme.spacing(1.5) }} name="email" value={persInfo.email} required={false} InputLabelProps={{ shrink: true }} variant='standard' label={t('email')} onChange={(e) => setPersInfo({ ...persInfo, email: e.target.value })} type='email' error={false} helperText='' />
                                <TextField style={{ marginTop: theme.spacing(2.5) }} name="phone-number" value={persInfo.phoneNumb} required={false} InputLabelProps={{ shrink: true }} variant='standard' label={t('phone_number')} onChange={(e) => setPersInfo({ ...persInfo, phoneNumb: e.target.value })} type='text' error={false} helperText='' />
                                <TextField style={{ marginTop: theme.spacing(2.5) }} id="outlined-select-currency" value={persInfo.gender} select label={t('gender')} onChange={(e) => setPersInfo({ ...persInfo, gender: e.target.value })} >
                                    <MenuItem key={'male'} value='male'>{t('male')}</MenuItem>
                                    <MenuItem key={'female'} value='female'>{t('female')}</MenuItem>
                                    <MenuItem key={'custom'} value='custom'>{t('custom')}</MenuItem>
                                </TextField>
                                <TextField style={{ marginTop: theme.spacing(2.5) }} value={persInfo.birth} name="birthday" label={t('birthday')} InputLabelProps={{ shrink: true }} variant='standard' required={false} onChange={(e) => setPersInfo({ ...persInfo, birth: e.target.value })} type='date' error={false} helperText='' />
                            </Container>
                            {remark.status.length ? (
                                <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(2) }}>
                                    {isLoading ? (
                                        <>
                                            <CircularProgress size='2em' />
                                            <Typography variant='body1' color='grey' >{t('loading')}</Typography>
                                        </>
                                    ) : (
                                        <Typography style={{ backgroundColor: remark.status === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                            {remark.message}
                                        </Typography>
                                    )}
                                </Container>
                            ) : ''}
                            <Grid style={{ marginTop: theme.spacing(3) }} container justifyContent='flex-end'>
                                <Grid item>
                                    <Button style={{ marginLeft: theme.spacing(1.5) }} variant='contained' color='primary' type='submit'>
                                        {t('submit')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    if (tab === 'language') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('account')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h6' color='gray' ><b>{t('change_language')}</b></Typography>
                        </Container>
                        <FormControl style={{ marginTop: theme.spacing(1), width: '100%' }}>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="en" checked={language === 'en'} onChange={handleLanguageChange} control={<Radio />} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} label={<Typography variant='body1' color='gray' ><b>English</b></Typography>} labelPlacement="start" disableTypography />
                                <FormControlLabel value="de" checked={language === 'de'} onChange={handleLanguageChange} control={<Radio />} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} label={<Typography variant='body1' color='gray' ><b>Deutsch</b></Typography>} labelPlacement="start" disableTypography />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Container>
            </ThemeProvider >
        );
    }

    if (tab === 'username') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper} >
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('account')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h6' color='gray' ><b>{t('change_username')}</b></Typography>
                        </Container>
                        <form className={classes.form} onSubmit={handleChangeUsername}>
                            <Typography style={{ marginTop: theme.spacing(1) }} variant='h6' color='grey' >{t('new_username')}</Typography>
                            <TextField
                                style={{ marginTop: theme.spacing(2.5) }}
                                name='changeUsername'
                                onChange={handleChange}
                                variant="outlined"
                                required
                                label={t('user_name')}
                                autoFocus={true}
                                helperText=''
                                error={false}
                                type='text'
                            />
                            {isLoading ? (
                                <Container style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress />
                                    <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='grey'>{t('loading')}</Typography>
                                </Container>
                            ) : (
                                <>
                                    {remark.message.length > 0 ? (
                                        <Typography style={{ backgroundColor: remark.status === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5), marginTop: theme.spacing(2) }} variant='body1' color='grey'>{remark.message}</Typography>
                                    ) : ''}
                                </>
                            )}
                            {remark.status !== 'successfull' ? (
                                <Grid style={{ marginTop: theme.spacing(2) }} container justifyContent='flex-end'>
                                    <Grid item>
                                        <Button style={{ marginLeft: theme.spacing(1.5) }} variant='contained' color='primary' type='submit'>
                                            {remark.status === 'error' ? t('try_again') : t('submit')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : ''}
                        </form>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    //#endregion

    //#region security

    if (tab === 'security') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h5' color='gray' ><b>{t('security')}</b></Typography>
                        </Container>
                        <MenuList >
                            <MenuItem onClick={() => changeTab('password')}>
                                <ListItemIcon>
                                    <Key />
                                </ListItemIcon>
                                <ListItemText><Typography variant='body1' color='gray' ><b>{t('password')}</b></Typography></ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    if (tab === 'password') {
        return (
            <ChangePassword userId={user?.result?._id} onClose={() => changeTab('security')} />
        );
    }

    //#endregion

    //#region notifications

    if (tab === 'notifications') {
        return (
            <ThemeProvider theme={theme}>
                <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper}>
                        <Container style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={t('back')} ><IconButton onClick={() => changeTab('')} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h5' color='gray' ><b>{t('notifications')}</b></Typography>
                        </Container>
                        <FormControl style={{ marginTop: theme.spacing(1), width: '100%' }}>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel control={<Switch />} name='enable' checked={notifications.enable} onChange={handleUpdateNotifications} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} label={<Typography variant='body1' color='gray' ><b>{t('enable')}</b></Typography>} labelPlacement="start" disableTypography />
                                <Divider />
                                <FormControlLabel control={<Switch />} name='fromUs' checked={notifications.fromUs} onChange={handleUpdateNotifications} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} disabled={!notifications.enable} label={<Typography variant='body1' color='gray' ><b>{t('from_us')}</b></Typography>} labelPlacement="start" disableTypography />
                                <FormControlLabel control={<Switch />} name='directMessages' checked={notifications.directMessages} onChange={handleUpdateNotifications} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} disabled={!notifications.enable} label={<Typography variant='body1' color='gray' ><b>{t('direct_messages')}</b></Typography>} labelPlacement="start" disableTypography />
                                <FormControlLabel control={<Switch />} name='following_followers' checked={notifications.following_followers} onChange={handleUpdateNotifications} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} disabled={!notifications.enable} label={<Typography variant='body1' color='gray' ><b>{t('following_followers')}</b></Typography>} labelPlacement="start" disableTypography />
                                <FormControlLabel control={<Switch />} name='posts_comments' checked={notifications.posts_comments} onChange={handleUpdateNotifications} style={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(1) }} disabled={!notifications.enable} label={<Typography variant='body1' color='gray' ><b>{t('posts_comments')}</b></Typography>} labelPlacement="start" disableTypography />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    //#endregion
}

export default Settings;