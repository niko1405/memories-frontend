import { Divider, Paper, CircularProgress, Grid, Button, Container, createTheme, ThemeProvider, Avatar, Slide, Dialog, Tooltip } from "@material-ui/core";
import { Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import useStyles from "./styles";
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from "./CommentSection";
import ErrorPage from "../ErrorPage/ErrorPage";
import { getUser } from "../../actions/auth";
import { getProfileUser } from "../../actions/profile";
import { deletePost as postDetailsDelete } from "../../api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const emptyRemark = {
    state: '',
    message: '',
}

const PostDetails = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = createTheme();
    const { id } = useParams();
    const { t } = useTranslation();

    const { post, isLoading, error } = useSelector(state => state.posts);
    const { profileUser } = useSelector(state => state.profile);
    const currentUser = useSelector(state => state.auth.user);

    const [deleteState, setDeleteState] = useState(false);
    const [remark, setRemark] = useState(emptyRemark);

    const mySelf = post?.creator === user?.result?._id;
    const following = currentUser?.follows?.filter(followId => followId === post?.creator).length > 0;

    useEffect(() => {
        dispatch(getPost(id));
        if (!currentUser) dispatch(getUser({ id: user?.result?._id }));
    }, [id]);

    useEffect(() => {
        if (post?._id === id) {
            dispatch(getProfileUser({ id: post?.creator }));
        }
    }, [post]);

    const deletePost = async () => {
        setDeleteState(false)

        setRemark({ state: 'loading', message: '' })

        await postDetailsDelete(post?._id).then(({ data }) => {
            setRemark({ state: 'successfull', message: data.message });
        }).catch(err => {
            setRemark({ state: 'error', message: err.response.data.message });
        });
    }

    const editPost = () => {
        navigate(`/create/${post?._id}`);
    }

    if (error) return <ErrorPage />

    if (isLoading) {
        return (
            <Container maxWidth='lg' className={classes.loadingPaper}>
                <CircularProgress size="3em" />
            </Container>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component='main' maxWidth='lg' style={{ padding: 0 }}>
                <Paper style={{ padding: theme.spacing(1), borderRadius: '15px', position: 'relative' }}>
                    <Tooltip title={t('close')} ><Typography onClick={() => navigate(-1)} style={{ cursor: 'pointer', position: 'absolute', right: 15, top: 5, zIndex: 10 }} variant='h5' color='primary'>✖</Typography></Tooltip>
                    <Container style={{ display: 'flex', flexDirection: 'column', padding: 0, marginTop: theme.spacing(1.5) }}>
                        <Typography style={{ wordBreak: 'break-word' }} variant="h3" component="h2">{post?.title}</Typography>
                        <Divider />
                        <Typography style={{ wordBreak: 'break-word' }} gutterBottom variant="h6" color="textSecondary" component="h2">{post?.tags.map((tag) => `#${tag} `)}</Typography>
                    </Container>
                    <Grid container>
                        <Grid id='postImageContainer' className={classes.imageSection} item xs={12} md={6}>
                            <img id='postImage' className={classes.media} src={post?.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post?.title} />
                            {mySelf && (
                                <Container className={classes.postSettings} >
                                    <Container style={{ display: 'flex', padding: 0 }}>
                                        <Button size="small" color="secondary" onClick={() => setDeleteState(true)} disabled={remark.state === 'loading'}>
                                            <DeleteIcon fontSize="small" />&nbsp;
                                            {t('delete')}
                                        </Button>
                                        <Button size="small" color="primary" onClick={editPost} disabled={remark.state === 'loading'}>
                                            <EditIcon fontSize="small" />&nbsp;
                                            {t('edit')}
                                        </Button>
                                    </Container>
                                </Container>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Container style={{ display: 'flex', alignItems: 'center', padding: theme.spacing(1) }} >
                                <Avatar onClick={() => navigate(`/profile/${post?.creator}`)} className={classes.profileAvatar} src={profileUser?.imageUrl} referrerPolicy='no-referrer' ></Avatar>
                                <Typography style={{ marginLeft: theme.spacing(1) }} variant="body1" color='gray'><b>{post?.name} {!mySelf && user && ' •'}&nbsp;</b></Typography>
                                {!mySelf && user && (
                                    <Typography variant="body1" color='primary'>
                                        <b>
                                            {following ? t('following_details') : t('unfollowed')}
                                        </b>
                                    </Typography>
                                )}
                            </Container>
                            <Typography style={{ padding: theme.spacing(1), wordWrap: 'break-word' }} variant="body1" color='gray' >{post?.message}</Typography>
                            <Divider />
                            <CommentSection post={post} />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Dialog open={deleteState} TransitionComponent={Transition} >
                <Container style={{ padding: 0 }}>
                    <Typography style={{ padding: theme.spacing(1) }} variant='h6' color='darkred'><b>{t('warning')}</b></Typography>
                    <Divider />
                    <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='body1' color='gray' >{t('delete_post')}</Typography>
                        <Container style={{ display: 'flex', padding: 0, marginTop: theme.spacing(2), justifyContent: 'center' }}>
                            <Button variant='outlined' color='secondary' onClick={() => setDeleteState(false)} >{t('cancel')}</Button>
                            <Button style={{ marginLeft: theme.spacing(1) }} variant='contained' color='primary' onClick={deletePost} >{t('yes')}</Button>
                        </Container>
                    </Container>
                </Container>
            </Dialog>
            <Dialog open={remark.state.length > 0} TransitionComponent={Transition} >
                <Container style={{ padding: 0, width: '230px' }}>
                    <Typography style={{ padding: theme.spacing(1) }} variant='h6' color='gray'><b>Info</b></Typography>
                    <Divider />
                    {remark.state === 'loading' ? (
                        <Container style={{ padding: theme.spacing(1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress size='2em' />
                            <Typography variant='body1' color='gray' >&nbsp;Loading..</Typography>
                        </Container>
                    ) : (
                        <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography style={{ backgroundColor: remark.state === 'error' ? '#b9eb65' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                {remark.message}
                            </Typography>
                            {remark.state === 'successfull' && (
                                <Button style={{ marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={() => navigate(`/profile/${user?.result?._id}`)}>
                                    {t('show_profile')}
                                </Button>
                            )}
                        </Container>
                    )}
                </Container>
            </Dialog >
        </ThemeProvider>
    );
}

export default PostDetails;