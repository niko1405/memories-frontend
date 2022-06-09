import { createTheme, Divider, Grid, ThemeProvider, Container, Tooltip, IconButton } from "@material-ui/core";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

import ArrowBack from '@mui/icons-material/ArrowBack';

import { getSavedPosts, removeSavedPost } from "../../actions/posts";
import Post from "../Posts/Post/Post";

const SavedPosts = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const theme = createTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { darkMode } = useSelector(state => state.settings);
    const { savedPosts, isLoading } = useSelector(state => state.posts);

    useEffect(() => {
        dispatch(getSavedPosts(user?.result?._id));
    }, []);

    const handleRemoveSavedPost = (postId) => {
        dispatch(removeSavedPost(postId, user.result._id));
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='lg' style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Container style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={t('back')} ><IconButton onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} ><ArrowBack htmlColor={darkMode ? 'white' : 'gray'} /></IconButton></Tooltip>
                    <Typography variant='h4' color='primary' >{t('saved_posts')}</Typography>
                </Container>
                <Divider style={{ marginTop: theme.spacing(1), width: '100%', background: darkMode && '#414141' }} />
                {isLoading ? (
                    <Container style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size='3em' />
                    </Container>
                ) : (
                    <>
                        {!savedPosts.length ? (
                            <Container style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant='h6' color='gray'>{t('no_saved_posts')}</Typography>
                            </Container>
                        ) : (
                            <Grid container alignItems='stretch' spacing={2} style={{ padding: theme.spacing(1) }}>
                                {savedPosts.map((post) => (
                                    <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} style={{ position: 'relative' }}>
                                        <Post post={post} deleteIcon={false} showIcons={false} showEdit={false} />
                                        <IconButton style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 50 }} onClick={() => handleRemoveSavedPost(post._id)}>
                                            <Tooltip title={t('remove')}><DeleteIcon htmlColor="red" /></Tooltip>
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default SavedPosts;