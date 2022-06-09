import { Box, Button, Card, Container, createTheme, Divider, Grid, responsiveFontSizes, Tab, ThemeProvider, Tooltip, Typography, IconButton } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import useStyles from './styles';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchField from "../../SearchField/SearchField";
import UserList from "./UserList";

import { clearUsers, getUsers, searchUsers } from '../../../actions/profile';

const FollowList = ({ profileUser, currentUser, followList, setFollowList }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    let theme = createTheme();
    theme = responsiveFontSizes(theme, { factor: 8 });

    const { darkMode } = useSelector(state => state.settings);

    const [tab, setTab] = useState(followList.type === 'follower' ? '1' : '2');
    const showFollower = tab === '1';

    const handleTab = (e, newTab) => {
        setTab(newTab);
    };

    const goBack = () => {
        navigate(`/profile/${profileUser._id}`);
        setFollowList({ type: undefined });
    }

    const handleSearch = (value) => {
        const userIds = showFollower ? profileUser?.follower : profileUser?.follows;
        if (!value.length) {
            dispatch(clearUsers());
            return dispatch(getUsers(userIds, 1));
        }
        dispatch(searchUsers(userIds, value));
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth='xs'>
                <Card className={classes.card} elevation={3} >
                    <Container className={classes.top} >
                        <Tooltip title={t('back')} ><IconButton onClick={() => goBack()} style={{ cursor: 'pointer' }} ><ArrowBack /></IconButton></Tooltip>
                        <Typography variant='h5' color='primary' >{profileUser?.userName}</Typography>
                    </Container>
                    <Box sx={{ width: '100%', typography: 'body1', marginTop: theme.spacing(2) }}>
                        <TabContext value={tab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTab} textColor="primary" indicatorColor="primary">
                                    <Tab label={`${profileUser?.follower.length} followers`} value="1" />
                                    <Tab label={`${profileUser?.follows.length} ${t('following')}`} value="2" />
                                </TabList>
                            </Box>
                            <Divider />
                            <TabPanel value="1">
                                {/*follower*/}
                                <Container style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SearchField placeHolder={t('search_placeholder')} onSearch={handleSearch} width='250px' />
                                </Container>
                                <Typography style={{ marginTop: theme.spacing(2) }} variant='subtitle1' color='textPrimary'><strong>{t('all_followers')}</strong></Typography>
                                <UserList profileUser={profileUser} currentUser={currentUser} theme={theme} type='follower' userList={profileUser?.follower} />
                            </TabPanel>
                            <TabPanel value="2">
                                {/*following*/}
                                <Container style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SearchField placeHolder={t('search_placeholder')} onSearch={handleSearch} width='250px' />
                                </Container>
                                <Typography style={{ marginTop: theme.spacing(2) }} variant='subtitle1' color='textPrimary'><strong>{t('following')}</strong></Typography>
                                <UserList profileUser={profileUser} currentUser={currentUser} theme={theme} type='following' userList={profileUser?.follows} />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Card>
            </Container>
        </ThemeProvider>
    );
}

export default FollowList;