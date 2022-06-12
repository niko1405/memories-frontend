import { Container, InputBase, IconButton, Box, Divider, Paper, ThemeProvider, createTheme, useMediaQuery, Grid, Button, CircularProgress, Avatar } from "@material-ui/core";
import { Typography, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import SearchIcon from '@mui/icons-material/Search';
import PostsIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Person';

import useStyles from './styles';
import { getPostsBySearch } from "../../actions/posts";
import { getProfiles, searchProfiles } from "../../actions/profile";
import Posts from "../Posts/Posts";
import Post from "../Posts/Post/Post";

function limit(string = '', limit = 0) {
    if (string.length >= limit)
        return string.substring(0, limit) + '..';
    return string;
}

const Search = () => {
    const classes = useStyles();
    const theme = createTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const smDivise = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();

    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('posts');
    const [section, setSection] = useState(1);

    const { posts, isLoading, loadingMore } = useSelector(state => state.posts);
    const { profiles, numberOfSections } = useSelector(state => state.profile);
    const { darkMode } = useSelector(state => state.settings);

    useEffect(() => {
        setTab('posts');
        setSearch('');
        setSection(1);
    }, []);

    useEffect(() => {
        if (loadingMore) {
            if (numberOfSections <= section) return;
            const nextSection = section + 1;

            setSection(nextSection);
            dispatch(getProfiles(nextSection, setError));
        }
    }, [loadingMore]);

    const handleSearch = (searchVal = search) => {
        if (tab === 'posts') dispatch(getPostsBySearch(searchVal));
        else if (tab === 'profiles') dispatch(searchProfiles(searchVal, setError));
    }

    const handleChange = (e) => {
        setSearch(e.target.value);

        handleSearch(e.target.value);
    }

    const handlePressEnter = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleSearch();
        }
    }

    const handleClear = () => {
        setSearch('');

        handleSearch('');
    }

    const handleTab = (e, newTab) => {
        setTab(newTab);
        setError(false);
        setSection(1);

        if (newTab === 'profiles') {
            if (!search.length) dispatch(getProfiles(1, setError));
            else dispatch(searchProfiles(search, setError));
        } else if (newTab === 'posts') {
            if (search.length) dispatch(getPostsBySearch(search));
        }
    }

    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth='md' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, position: 'sticky', top: 70 }} >
                <Paper style={{ width: smDivise ? '300px' : '450px', display: 'flex', alignItems: 'center', borderRadius: '15px', backgroundColor: '#ebebeb', position: 'relative' }} elevation={0} >
                    <IconButton onClick={handleSearch} >
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder={t('search_placeholder')}
                        value={search}
                        onChange={handleChange}
                        onKeyDown={handlePressEnter}
                    />
                    <Typography onClick={handleClear} style={{ padding: theme.spacing(1.5), cursor: 'pointer', position: 'absolute', right: 0 }} variant='body1' color='primary'>✖</Typography>
                </Paper>
            </Container>
            <Box sx={{ width: '100%', typography: 'body1', marginTop: theme.spacing(1) }}>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTab} textColor="primary" indicatorColor="primary" variant="fullWidth" scrollButtons='auto' centered>
                            <Tab icon={<PostsIcon />} iconPosition='start' label='posts' value="posts" sx={{ color: darkMode && 'white' }} />
                            <Tab icon={<UserIcon />} iconPosition='start' label={t('profiles')} value="profiles" sx={{ color: darkMode && 'white' }} />
                        </TabList>
                    </Box>
                    <Divider />
                    <TabPanel value="posts" style={{ padding: 0, marginTop: theme.spacing(1) }}>
                        {!search.length ? (
                            <Container style={{ padding: 0 }} >
                                <Posts />
                            </Container>
                        ) : (
                            <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {isLoading ? <CircularProgress size='3em' /> : (
                                    <Grid container alignItems='stretch' spacing={2} >
                                        {posts.length ? (
                                            posts.map((post) => (
                                                <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} >
                                                    <Post post={post} />
                                                </Grid>
                                            ))
                                        ) : (
                                            <Container style={{ marginTop: theme.spacing(2), display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography variant='h6' color='gray' >{t('no_results')}</Typography>
                                            </Container>
                                        )}
                                    </Grid>
                                )}
                            </Container>
                        )}
                    </TabPanel>
                    <TabPanel value="profiles">
                        {error ? (
                            <Container className={classes.error} maxWidth='md'>
                                <Typography variant='body1' color='grey' >
                                    {t('internal_server_error')}
                                </Typography>
                                <Button style={{ marginTop: theme.spacing(1) }} variant='contained' color='primary' onClick={() => dispatch(getProfiles(section, setError))} >
                                    {isLoading ? <CircularProgress color="warning" /> : t('try_again')}
                                </Button>
                            </Container>
                        ) : (
                            <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                {isLoading && section === 1 ? <CircularProgress size='3em' /> : (
                                    <Grid container alignItems='stretch' spacing={2} style={{ position: !smDivise && 'absolute', left: !smDivise && '40%', top: 0, maxWidth: '550px' }}>
                                        {profiles.length ? (
                                            profiles.map((profile) => (
                                                <Grid key={profile._id} item xs={12} sm={12} md={12} lg={12} onClick={() => navigate(`/profile/${profile._id}`)}>
                                                    <Grid container alignItems={!smDivise ? "flex-start" : 'center'} style={{ display: 'flex', flexDirection: smDivise && 'column', alignItems: 'center', justifyContent: smDivise && 'center' }}>
                                                        <Grid item >
                                                            <Avatar src={profile.imageUrl} className={classes.profileAvatar} referrerPolicy='no-referrer' />
                                                        </Grid>
                                                        <Grid item style={{ marginLeft: !smDivise && theme.spacing(1), display: 'flex', flexDirection: 'column', justifyContent: smDivise && 'center', alignItems: smDivise && 'center' }} >
                                                            <Typography variant='h6' color={darkMode ? 'white' : 'black'} ><b>{profile.userName}</b></Typography>
                                                            <Typography variant='h6' style={{ wordBreak: 'break-word' }} color={darkMode ? 'white' : 'gray'}>{limit(profile.description, 20)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Container style={{ marginTop: theme.spacing(1), display: 'flex', justifyContent: 'center', alignItems: 'center', position: !smDivise && 'absolute', left: !smDivise && '-40%' }}>
                                                <Typography variant='h6' color='gray' >{t('no_results')}</Typography>
                                            </Container>
                                        )}
                                        {isLoading && section > 1 && (
                                            <Container style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1), display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <CircularProgress size='3em' />
                                            </Container>
                                        )}
                                    </Grid>
                                )}
                            </Container>
                        )}
                    </TabPanel>
                </TabContext>
            </Box>
        </ThemeProvider>
    );
}

export default Search;