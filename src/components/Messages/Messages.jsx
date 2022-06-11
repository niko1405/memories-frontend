import { AppBar, Avatar, CircularProgress, Container, createTheme, Divider, Grid, TextField, ThemeProvider, Tooltip, Paper, IconButton } from "@material-ui/core";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import ArrowBack from '@mui/icons-material/ArrowBack';

import { getChat, getRecentChats, getSuggestedProfiles, searchChats, sendDirectMessage } from "../../actions/profile";
import SearchField from "../SearchField/SearchField";

import useStyles from './styles';

function limit(string = '', limit = 0) {
    if (string.length >= limit)
        return string.substring(0, limit) + '..';
    return string;
}

const Messages = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const theme = createTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { id } = useParams();
    const { t, i18n } = useTranslation();

    const { isLoading } = useSelector(state => state.posts);
    const { darkMode } = useSelector(state => state.settings);
    const { profiles: suggestedProfiles, chat, recentChats } = useSelector(state => state.profile);

    const [comment, setComment] = useState('');
    const [messages, setMessages] = useState(chat?.messages || []);
    const [seeAllRecent, setSeeAllRecent] = useState(false);
    const [showSeeAll, setShowSeeAll] = useState(true);

    useEffect(() => {
        dispatch(getSuggestedProfiles(user?.result?._id));
        dispatch(getRecentChats(user?.result?._id));
    }, []);

    useEffect(() => {
        dispatch(getRecentChats(user?.result?._id));

        if (id) dispatch(getChat(user?.result?._id, id));
        else dispatch(getSuggestedProfiles(user?.result?._id));
    }, [id]);

    useEffect(() => {
        if (chat) chat.messages && setMessages(chat.messages);
    }, [chat]);

    useEffect(() => {
        if (messages.length) document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
    }, [messages]);

    const handleComment = () => {
        if (!comment.length || !user) return;
        setComment('');

        let currentDate = new Date();
        const sendTime = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + (currentDate.getFullYear() % 100) + " | " + currentDate.getHours() + ":" + currentDate.getMinutes();

        const newComment = [user.result.userName, comment, sendTime];

        setMessages([...messages, newComment]);

        dispatch(sendDirectMessage(user.result._id, chat.chatProfile._id, newComment, i18n.getFixedT));

        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
    }

    const handleSearch = (value) => {
        dispatch(searchChats(user?.result?._id, value));
    }

    const handleSearchInput = (value) => {
        value.length ? setShowSeeAll(false) : setShowSeeAll(true);
    }

    if (id) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth='md' style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center' }}>
                    {isLoading ? <CircularProgress size='3em' style={{ marginTop: theme.spacing(1) }} /> : (
                        <>
                            <Container id='messageProfile' style={{
                                padding: theme.spacing(1),
                                display: 'flex',
                                alignItems: 'center',
                                position: 'fixed',
                                zIndex: 10,
                                backgroundColor: darkMode ? 'black' : 'white',
                                marginTop: theme.spacing(-2)
                            }}>
                                <Tooltip title={t('back')} ><IconButton onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} ><ArrowBack htmlColor={darkMode ? 'white' : 'gray'} /></IconButton></Tooltip>
                                <Avatar src={chat?.chatProfile?.imageUrl} style={{ backgroundColor: 'gray', width: '40px', height: '40px' }} referrerPolicy='no-referrer' />
                                <Typography variant='h5' color={darkMode ? 'white' : 'gray'} style={{ marginLeft: theme.spacing(1), cursor: 'pointer' }} onClick={() => navigate(`/profile/${chat?.chatProfile?._id}`)} >{chat?.chatProfile?.userName}</Typography>
                            </Container>
                            <Container style={{ padding: 0, display: 'flex', marginTop: document.getElementById('messageProfile')?.clientHeight + 10 || 50, minHeight: '300px', flexDirection: 'column' }}>
                                {!messages.length ? (
                                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'} >{t('no_messages')}</Typography>
                                    </Container>
                                ) : (
                                    <>
                                        {messages?.map((c, i) => (
                                            <Paper key={i} style={{
                                                padding: theme.spacing(.5), display: 'flex', flexDirection: 'column', alignItems: 'left',
                                                minWidth: '200px',
                                                marginBottom: theme.spacing(2),
                                                alignSelf: c[0] === user?.result?.userName ? 'flex-end' : 'flex-start',
                                                backgroundColor: c[0] === user?.result?.userName && 'lightgreen',
                                                position: 'relative',
                                                maxWidth: '280px',
                                            }}>
                                                <Typography color='#494949' gutterBottom variant="subtitle1" style={{ position: 'absolute', right: 5, top: 0 }} >
                                                    {c[2]}
                                                </Typography>
                                                <Typography style={{ wordBreak: 'break-word' }} color='black' gutterBottom variant="subtitle1">
                                                    <strong >{c[0] === user?.result?.userName ? t('you') : c[0]}</strong>
                                                </Typography>
                                                <Typography style={{ wordBreak: 'break-word' }} color='#494949' gutterBottom variant="subtitle1">
                                                    {c[1]}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </>
                                )}
                            </Container>
                        </>
                    )}
                </Container>
                <Container maxWidth='xl' style={{ padding: 0 }} className={classes.downBarContainer} >
                    <AppBar style={{ padding: theme.spacing(1), position: 'absolute', bottom: 0, display: 'flex', borderTop: darkMode ? '1px solid white' : '1px solid black', backgroundColor: darkMode && 'black', width: '100%' }} position="static" color="inherit" elevation={0}>
                        <Container style={{ display: 'flex', marginTop: theme.spacing(1), padding: 0, alignItems: 'center' }}>
                            <TextField
                                id='commentInput'
                                fullWidth
                                minRows={1}
                                multiline
                                variant="outlined"
                                placeholder={t('comment') + '..'}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                InputProps={{
                                    // disableUnderline: true,
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                                inputProps={{ style: { color: darkMode ? 'white' : 'black' }, maxLength: 500 }}
                                style={{ maxHeight: '150px', overflowY: 'auto' }}
                            />
                            <Typography style={{ cursor: 'pointer', marginLeft: theme.spacing(2) }} variant="body1" color={comment.length && user ? 'primary' : 'lightblue'} onClick={handleComment}>
                                <b>{t('submit')}</b>
                            </Typography>
                        </Container>
                    </AppBar>
                </Container>
            </ThemeProvider >
        )
    }

    if (seeAllRecent) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth='md' style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Container style={{ padding: 0, display: 'flex', alignItems: 'center', position: 'relative', marginBottom: theme.spacing(1) }}>
                        <Tooltip title={t('back')} ><IconButton onClick={() => setSeeAllRecent(false)} style={{ cursor: 'pointer' }} ><ArrowBack htmlColor={darkMode ? 'white' : 'gray'} /></IconButton></Tooltip>
                        <Typography variant='h5' color='primary' ><b>{t('recent_chats')}</b></Typography>
                    </Container>
                    {!recentChats.length ? (
                        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'} style={{ marginTop: theme.spacing(1) }} >{t('no_recent_chats')}</Typography>
                        </Container>
                    ) : (
                        <Grid container alignItems='stretch' spacing={2} style={{ maxWidth: '550px', marginTop: theme.spacing(2) }}>
                            {recentChats.slice(0, 5).map((profile, i) => (
                                <Container key={i} style={{ marginBottom: theme.spacing(2) }}>
                                    {profile && (
                                        <Grid item xs={12} sm={12} md={12} lg={12} onClick={() => navigate(`/messages/${profile._id}`)}>
                                            <Grid container alignItems='flex-start' >
                                                <Grid item >
                                                    <Avatar src={profile.imageUrl} style={{ cursor: 'pointer', backgroundColor: 'gray', width: '70px', height: '70px', border: '2px solid black' }} referrerPolicy='no-referrer' />
                                                </Grid>
                                                <Grid item style={{ marginLeft: theme.spacing(1), display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }} >
                                                    <Typography variant='h6' color={darkMode ? 'white' : 'black'} ><b>{profile.userName}</b></Typography>
                                                    <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'}>{profile?.chats?.find(chatObj => chatObj.id === user.result._id)?.messages?.length ? limit(`${profile?.chats?.find(chatObj => chatObj.id === user.result._id)?.messages[profile?.chats?.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][0] === user?.result?.userName ? t('you') : profile.chats.find(chatObj => chatObj.id === user.result._id)?.messages[profile.chats.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][0]}: ${profile.chats.find(chatObj => chatObj.id === user.result._id)?.messages[profile.chats.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][1]}`, 21) : ''}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Container>
                            ))}
                        </Grid>
                    )}
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='md' style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column' }}>
                <Container style={{ padding: 0, display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <Tooltip title={t('back')} ><IconButton onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} ><ArrowBack htmlColor={darkMode ? 'white' : 'gray'} /></IconButton></Tooltip>
                    <Typography variant='h5' color='primary' ><b>{t('messages')}</b></Typography>
                    <Typography variant='h5' color={darkMode ? 'white' : 'gray'} style={{ position: 'absolute', right: 0 }} >{user?.result?.userName}</Typography>
                </Container>
                <Divider style={{ marginTop: theme.spacing(1), width: '100%', background: darkMode && '#414141' }} />
                <Container style={{ padding: 0, marginTop: theme.spacing(1.5), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SearchField onSearch={handleSearch} onInput={handleSearchInput} />
                </Container>
                <Container style={{ padding: 0, marginTop: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Container style={{ padding: 0, display: 'flex', position: 'relative' }}>
                        <Typography variant='h6' color={darkMode ? 'white' : 'gray'} ><b>{t('recent')}</b></Typography>
                        {showSeeAll && <Typography variant='h6' color='primary' style={{ cursor: 'pointer', position: 'absolute', right: 0 }} onClick={() => setSeeAllRecent(true)} >{t('see_all')}</Typography>}
                    </Container>
                    {isLoading ? <CircularProgress size='3em' /> : (
                        <>
                            {!recentChats.length ? (
                                <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'} style={{ marginTop: theme.spacing(1) }} >{showSeeAll ? t('no_recent_chats') : t('no_results')}</Typography>
                            ) : (
                                <Grid container alignItems='stretch' spacing={2} style={{ maxWidth: '550px', marginTop: theme.spacing(2) }}>
                                    {recentChats.slice(0, showSeeAll ? 5 : recentChats.length).map((profile, i) => (
                                        <Container key={i} style={{ marginBottom: theme.spacing(2) }}>
                                            {profile && (
                                                <Grid item xs={12} sm={12} md={12} lg={12} onClick={() => navigate(`/messages/${profile._id}`)}>
                                                    <Grid container alignItems='flex-start' >
                                                        <Grid item >
                                                            <Avatar src={profile.imageUrl} style={{ cursor: 'pointer', backgroundColor: 'gray', width: '70px', height: '70px', border: '2px solid black' }} referrerPolicy='no-referrer' />
                                                        </Grid>
                                                        <Grid item style={{ marginLeft: theme.spacing(1), display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }} >
                                                            <Typography variant='h6' color={darkMode ? 'white' : 'black'} ><b>{profile.userName}</b></Typography>
                                                            <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'}>{profile?.chats?.find(chatObj => chatObj.id === user.result._id)?.messages?.length ? limit(`${profile?.chats?.find(chatObj => chatObj.id === user.result._id)?.messages[profile?.chats?.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][0] === user?.result?.userName ? t('you') : profile.chats.find(chatObj => chatObj.id === user.result._id)?.messages[profile.chats.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][0]}: ${profile.chats.find(chatObj => chatObj.id === user.result._id)?.messages[profile.chats.find(chatObj => chatObj.id === user?.result?._id)?.messages?.length - 1][1]}`, 21) : ''}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Container>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </Container>
                <Container style={{ padding: 0, marginTop: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <Typography variant='h6' color={darkMode ? 'white' : 'gray'} style={{ position: 'absolute', left: 0 }} ><b>{t('suggested')}</b></Typography>
                    {isLoading ? <CircularProgress size='3em' style={{ marginTop: '40px' }} /> : (
                        <Grid container alignItems='stretch' spacing={2} style={{ maxWidth: '550px', marginTop: '40px' }}>
                            {suggestedProfiles.length ? (
                                suggestedProfiles.map((profile, i) => (
                                    <Container key={i} style={{ marginBottom: theme.spacing(2) }}>
                                        {profile && (
                                            <Grid item xs={12} sm={12} md={12} lg={12} onClick={() => navigate(`/messages/${profile._id}`)}>
                                                <Grid container alignItems='flex-start' >
                                                    <Grid item >
                                                        <Avatar src={profile.imageUrl} style={{ cursor: 'pointer', backgroundColor: 'gray', width: '70px', height: '70px', border: '2px solid black' }} referrerPolicy='no-referrer' />
                                                    </Grid>
                                                    <Grid item style={{ marginLeft: theme.spacing(1), display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }} >
                                                        <Typography variant='h6' color={darkMode ? 'white' : 'black'} ><b>{profile.userName}</b></Typography>
                                                        <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'}>{limit(profile.name, 20)}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Container>
                                ))
                            ) : (
                                <Container style={{ padding: theme.spacing(1), marginTop: theme.spacing(1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant='h6' color={darkMode ? 'lightgray' : 'gray'} >{showSeeAll ? t('no_suggested_chats') : t('no_results')}</Typography>
                                </Container>
                            )}
                        </Grid>
                    )}
                </Container>
            </Container>
        </ThemeProvider >
    );
}

export default Messages;