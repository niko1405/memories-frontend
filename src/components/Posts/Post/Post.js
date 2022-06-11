import { Button, ButtonBase, Card, CardActions, CardContent, CardMedia, createTheme, Dialog, ThemeProvider, Container, CircularProgress, Divider, Slide, IconButton, Tooltip } from '@material-ui/core';
import { Typography } from '@mui/material';
import Like from '@mui/icons-material/FavoriteBorder';
import Liked from '@mui/icons-material/Favorite';
import Save from '@mui/icons-material/BookmarkBorder';
import Saved from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useStyles from './styles';

import moment from 'moment';

import { deletePost as deletePostAction } from "../../../api";
import { getSavedPosts, likePost, removeSavedPost, savePost } from '../../../actions/posts';
import { DELETE } from '../../../constants/actionTypes';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const emptyRemark = {
    type: '',
    message: '',
}

const Post = ({ post, deleteIcon = true, showIcons = true, showEdit = true }) => {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = createTheme();
    const userId = (user?.result?.googleId || user?.result?._id);
    const hasLiked = post.likes.find((like) => like === userId);
    const { t, i18n } = useTranslation();

    const { darkMode } = useSelector(state => state.settings);
    const { savedPosts } = useSelector(state => state.posts);
    
    const alreadySavedStore = savedPosts.filter(savedPost => savedPost._id === post._id).length !== 0;

    const [deleteState, setDeleteState] = useState(false);
    const [remark, setRemark] = useState(emptyRemark);
    const [likes, setLikes] = useState(post?.likes);
    const [alreadySaved, setAlreadySaved] = useState(alreadySavedStore);

    const deletePost = async () => {
        setDeleteState(false)

        setRemark({ type: 'loading', message: '' })

        await deletePostAction(post?._id).then(({ data }) => {
            setRemark({ type: 'successfull', message: data.message });
        }).catch(err => {
            setRemark({ type: 'error', message: err.response.data.message });
        });
    }

    const gotDelete = () => {
        setRemark(emptyRemark)

        dispatch({ type: DELETE, payload: post?._id });
    }

    const handleLike = () => {
        if (hasLiked) {
            setLikes(post.likes.filter((id) => id !== userId));
            dispatch(likePost(post._id, user.result._id, user.result.userName, i18n.getFixedT, true));
        } else {
            setLikes([...post.likes, userId]);
            dispatch(likePost(post._id, user.result._id, user.result.userName, i18n.getFixedT, false));
        }
    }

    const handleSave = () => {
        if (alreadySaved) {
            dispatch(removeSavedPost(post._id, user.result._id));
            setAlreadySaved(false);
        } else {
            dispatch(savePost(post._id, user.result._id));
            setAlreadySaved(true);
        }
    }

    const Icons = () => {
        return (
            <Container style={{ paddingLeft: '5px' }}>
                {likes.find((like) => like === userId)
                    ? <IconButton size='small' disabled={!user?.result} onClick={handleLike} ><Tooltip title={t('unlike')} ><Liked htmlColor='red' /></Tooltip> &nbsp;<b>{likes.length}</b></IconButton>
                    : <IconButton size='small' disabled={!user?.result} onClick={handleLike} ><Tooltip title={t('like')} ><Like htmlColor='gray' /></Tooltip> &nbsp;<b>{likes.length}</b></IconButton>
                }
                <IconButton size='small' disabled={!user?.result} onClick={handleSave}>
                    <Tooltip title={alreadySaved ? t('unsave') : t('save')} >{alreadySaved ? <Saved style={{ marginLeft: '5px' }} /> : <Save style={{ marginLeft: '5px' }} />}</Tooltip>
                </IconButton>
            </Container>
        );
    }

    const openPost = () => {
        navigate(`/posts/${post._id}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.card} style={{ backgroundColor: darkMode && '#e8e8e8' }} raised elevation={darkMode ? 0 : 2}>
                <ButtonBase className={classes.cardAction} onClick={openPost}>
                    <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                    <div className={classes.overlay}>
                        <div onClick={e => {
                            e.stopPropagation();
                            navigate(`/profile/${post.creator}`);
                        }}>
                            <Typography style={{ wordBreak: 'break-word' }} variant="h6">{post.name}</Typography>
                        </div>
                        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                    </div>
                    {(userId == post?.creator) && showEdit && (
                        <div className={classes.overlay2} name="edit">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/create/${post._id}`);
                                }}
                                style={{ color: 'white' }}
                                size="small"
                            >
                                <Tooltip title={t('edit')}><MoreHorizIcon fontSize="medium" /></Tooltip>
                            </div>
                        </div>
                    )}
                    <div className={classes.details}>
                        <Typography style={{ wordBreak: 'break-word' }} variant="body2" color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
                    </div>
                    <Typography style={{ wordBreak: 'break-word' }} className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
                    <CardContent>
                        <Typography style={{ wordBreak: 'break-word' }} variant="body2" color='textSecondary' component='p'>{post.message}</Typography>
                    </CardContent>
                </ButtonBase>
                <CardActions className={classes.cardActions}>
                    {showIcons && <Icons />}
                    {(userId === post?.creator) && deleteIcon && (
                        <Button size="small" color="secondary" onClick={() => setDeleteState(true)}>
                            <DeleteIcon fontSize="small" />
                            {t('delete')}
                        </Button>
                    )}
                </CardActions>
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
                <Dialog open={remark.type.length > 0} TransitionComponent={Transition} >
                    <Container style={{ padding: 0, width: '230px' }}>
                        <Typography style={{ padding: theme.spacing(1) }} variant='h6' color='gray'><b>Info</b></Typography>
                        <Divider />
                        {remark.type === 'loading' ? (
                            <Container style={{ padding: theme.spacing(1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress size='2em' />
                                <Typography variant='body1' color='gray' >&nbsp;{t('loading')}</Typography>
                            </Container>
                        ) : (
                            <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography style={{ backgroundColor: remark.type === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                    {remark.message}
                                </Typography>
                                {remark.type === 'successfull' ? (
                                    <Button style={{ marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={gotDelete}>
                                        {t('got_it')}
                                    </Button>
                                ) : (
                                    <Button style={{ marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={deletePost}>
                                        {t('try_again')}
                                    </Button>
                                )}
                            </Container>
                        )}
                    </Container>
                </Dialog >
            </Card>
        </ThemeProvider>
    );
}

export default Post;