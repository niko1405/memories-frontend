import { Button, CircularProgress, Container, createTheme, AppBar, Dialog, Divider, Slide, TextField, ThemeProvider, Tooltip, useMediaQuery } from '@material-ui/core';
import { IconButton, Typography } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { useTranslation } from 'react-i18next';

import Like from '@mui/icons-material/FavoriteBorder';
import Liked from '@mui/icons-material/Favorite';
import Comment from '@mui/icons-material/Comment';
import Save from '@mui/icons-material/BookmarkBorder';
import Saved from '@mui/icons-material/Bookmark';

import { commentPost, getSavedPosts, removeSavedPost, savePost } from '../../actions/posts';
import useStyles from './styles';
import { getUser } from '../../api';
import { useNavigate } from 'react-router-dom';

import { likePost } from '../../actions/posts';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CommentSection = ({ post }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = createTheme();
    const smDivise = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();

    const { savedPosts, isLoading } = useSelector(state => state.posts);
    const { darkMode } = useSelector(state => state.settings);
    const alreadySavedStore = savedPosts.filter(savedPost => savedPost._id === post?._id)?.length !== 0;

    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState(post?.likes);
    const [remark, setRemark] = useState({ type: '', message: '' });
    const [alreadySaved, setAlreadySaved] = useState(alreadySavedStore);

    const commentsRef = useRef();

    const likingPost = likes?.find((like) => like === user?.result?._id);

    useEffect(() => {
        if (user) dispatch(getSavedPosts(user.result._id));
    }, []);

    const handleClick = () => {
        if (!comment.length || !user) return;

        const newComment = `${user.result.userName}: ${comment}`;

        setComments([...comments, newComment]);
        setComment('');

        commentsRef.current.scrollIntoView({ behavior: 'smooth' });

        dispatch(commentPost(newComment, post._id, user.result._id, t));
    }

    const goToUser = async (userName) => {
        await getUser({ userName }).then(({ data }) => navigate(`/profile/${data?._id}`)).catch(err => console.log(err));
    }

    const handleLike = () => {
        dispatch(likePost(post._id));

        if (likingPost) {
            setLikes(post.likes.filter((id) => id !== user.result._id));
        } else {
            setLikes([...post.likes, user.result._id]);
        }
    }

    const handleComment = () => {
        const commentInput = document.getElementById('commentInput');

        if (commentInput) {
            commentInput.focus();
            commentInput.scrollIntoView({ behavior: 'smooth' });
        };
    }

    const handleSavePost = () => {
        if (alreadySaved) {
            dispatch(removeSavedPost(post._id, user.result._id));
            setAlreadySaved(false);
        } else {
            dispatch(savePost(post._id, user.result._id, setRemark));
            setAlreadySaved(true);
        }
    }

    if (!comments) return null;

    if (smDivise) {
        return (
            <ThemeProvider theme={theme}>
                <Container style={{ padding: theme.spacing(1) }}>
                    <div className={classes.commentsOuterContainer} style={{ marginBottom: document.getElementById('postDetailsCommentSection')?.clientHeight || '197px' }}>
                        <div className={classes.commentsInnerContainer}>
                            {!comments.length ? (<Typography gutterBottom variant="subtitle1">{t('no_comments')}</Typography>) : comments.map((c, i) => (
                                <Typography style={{ wordBreak: 'break-word' }} key={i} gutterBottom variant="subtitle1">
                                    <strong style={{ cursor: 'pointer' }} onClick={() => goToUser(c.split(': ')[0])}>{c.split(': ')[0]}</strong>
                                    {c.split(':')[1]}
                                </Typography>
                            ))}
                            <div ref={commentsRef} />
                        </div>
                    </div>
                    <Container maxWidth='xl' style={{ padding: 0 }} className={classes.downBarContainer} >
                        <AppBar id='postDetailsCommentSection' style={{ padding: theme.spacing(1), position: 'absolute', bottom: 0, display: 'flex', borderTop: darkMode ? 'none' : '1px solid black', backgroundColor: darkMode && 'black', width: '100%' }} position="static" color="inherit" elevation={0}>
                            <Container style={{ display: 'flex', alignItems: 'center', padding: 0, position: 'relative' }}>
                                <IconButton disabled={!user?.result} onClick={handleLike}>
                                    <Tooltip title={likingPost ? t('unlike') : t('like')} >{likingPost ? <Liked htmlColor='red' /> : <Like htmlColor='gray' />}</Tooltip>
                                </IconButton>
                                <IconButton disabled={!user?.result} onClick={handleComment} >
                                    <Tooltip title={t('comment')} ><Comment htmlColor={darkMode ? 'white' : 'none'} /></Tooltip>
                                </IconButton>
                                <IconButton disabled={!user?.result} style={{ position: 'absolute', right: 0 }} onClick={handleSavePost}>
                                    <Tooltip title={alreadySaved ? t('unsave') : t('save')} >{alreadySaved ? <Saved htmlColor={darkMode ? 'white' : 'none'} /> : <Save htmlColor={darkMode ? 'white' : 'none'} />}</Tooltip>
                                </IconButton>
                            </Container>
                            <Container style={{ display: 'flex', flexDirection: 'column', padding: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(3) }} >
                                <Typography variant="body1" color={darkMode ? 'white' : 'textPrimary'} ><b>{`${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}`}</b></Typography>
                                <Typography variant="body2" color='gray' ><b>{moment(post?.createdAt).fromNow()}</b></Typography>
                            </Container>
                            <Divider />
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
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                    inputProps={{ style: { color: darkMode ? 'white' : 'black' }, maxLength: 500 }}
                                    style={{ maxHeight: '150px', overflowY: 'auto' }}
                                />
                                <Typography style={{ cursor: 'pointer', marginTop: '10px', marginLeft: theme.spacing(2) }} variant="body1" color={comment.length && user ? 'primary' : 'lightblue'} onClick={handleClick}>
                                    <b>{t('submit')}</b>
                                </Typography>
                            </Container>
                        </AppBar>
                    </Container>
                </Container>
                <Dialog open={remark.type === 'error'} TransitionComponent={Transition} >
                    <Container style={{ padding: 0, width: '230px' }}>
                        <Typography style={{ padding: theme.spacing(1) }} variant='h6' color='darkred'><b>{t('error')}</b></Typography>
                        <Divider />
                        <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography style={{ padding: theme.spacing(.5) }} variant='body1' color='black' >
                                <b>{remark.message}</b>
                            </Typography>
                            <Container style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button style={{ marginTop: theme.spacing(2) }} variant='outlined' color='primary' onClick={() => setRemark({ type: '', message: '' })}>
                                    {t('cancel')}
                                </Button>
                                <Button style={{ marginLeft: theme.spacing(1), marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={handleSavePost}>
                                    {isLoading ? <CircularProgress /> : t('try_again')}
                                </Button>
                            </Container>
                        </Container>
                    </Container>
                </Dialog >
            </ThemeProvider >
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container style={{ padding: theme.spacing(1) }}>
                <div className={classes.commentsOuterContainer}>
                    <div className={classes.commentsInnerContainer2}>
                        {!comments.length ? (<Typography gutterBottom variant="subtitle1">There're no comments yet</Typography>) : comments.map((c, i) => (
                            <Typography style={{ wordBreak: 'break-word' }} key={i} gutterBottom variant="subtitle1">
                                <strong style={{ cursor: 'pointer' }} onClick={() => goToUser(c.split(': ')[0])}>{c.split(': ')[0]}</strong>
                                {c.split(':')[1]}
                            </Typography>
                        ))}
                        <div ref={commentsRef} />
                    </div>
                </div>
                <Divider />
                <Container style={{ padding: 0 }}>
                    <Container style={{ display: 'flex', alignItems: 'center', padding: 0, position: 'relative' }}>
                        <IconButton disabled={!user?.result} onClick={handleLike}>
                            <Tooltip title={likingPost ? t('unlike') : t('like')} >{likingPost ? <Liked htmlColor='red' /> : <Like htmlColor='gray' />}</Tooltip>
                        </IconButton>
                        <IconButton disabled={!user?.result} onClick={handleComment} >
                            <Tooltip title={t('comment')} ><Comment /></Tooltip>
                        </IconButton>
                        <IconButton disabled={!user?.result} style={{ position: 'absolute', right: 0 }} onClick={handleSavePost}>
                            <Tooltip title={alreadySaved ? t('unsave') : t('save')} >{alreadySaved ? <Saved /> : <Save />}</Tooltip>
                        </IconButton>
                    </Container>
                    <Container style={{ display: 'flex', flexDirection: 'column', padding: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(3) }} >
                        <Typography variant="body1" color='textPrimary' ><b>{`${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}`}</b></Typography>
                        <Typography variant="body2" color='gray' ><b>{moment(post?.createdAt).fromNow()}</b></Typography>
                    </Container>
                    <Divider />
                    <Container style={{ display: 'flex', marginTop: theme.spacing(1), padding: 0, alignItems: 'center' }}>
                        <TextField
                            id='commentInput'
                            fullWidth
                            minRows={1}
                            multiline
                            variant="standard"
                            placeholder={t('comment') + '..'}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            inputProps={{ style: { maxLength: 500 } }}
                            style={{ maxHeight: '150px', overflowY: 'auto' }}
                        />
                        <Typography style={{ cursor: 'pointer', marginTop: '10px', marginLeft: theme.spacing(2) }} variant="body1" color={comment.length && user ? 'primary' : 'lightblue'} onClick={handleClick}>
                            <b>{t('submit')}</b>
                        </Typography>
                    </Container>
                </Container>
            </Container>
            <Dialog open={remark.type === 'error'} TransitionComponent={Transition} >
                <Container style={{ padding: 0, width: '230px' }}>
                    <Typography style={{ padding: theme.spacing(1) }} variant='h6' color='darkred'><b>{t('error')}</b></Typography>
                    <Divider />
                    <Container style={{ padding: theme.spacing(1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ padding: theme.spacing(.5) }} variant='body1' color='black' >
                            <b>{remark.message}</b>
                        </Typography>
                        <Container style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{ marginTop: theme.spacing(2) }} variant='outlined' color='primary' onClick={() => setRemark({ type: '', message: '' })}>
                                {t('cancel')}
                            </Button>
                            <Button style={{ marginLeft: theme.spacing(1), marginTop: theme.spacing(2) }} variant='contained' color='primary' onClick={handleSavePost}>
                                {isLoading ? <CircularProgress /> : t('try_again')}
                            </Button>
                        </Container>
                    </Container>
                </Container>
            </Dialog >
        </ThemeProvider >
    );
}

export default CommentSection;