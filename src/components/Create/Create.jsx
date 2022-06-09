import { Button, ButtonBase, Card, CardActions, CardContent, CardMedia, Container, createTheme, Divider, Grid, IconButton, Input, Paper, TextField, ThemeProvider, CircularProgress, Select, MenuItem, FormControl } from '@material-ui/core';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UploadImg from '@mui/icons-material/AddAPhoto'
import moment from 'moment';

import useStyles from './styles';

import { useDispatch, useSelector } from 'react-redux';
import { createPost, getPost, updatePost } from '../../actions/posts';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Like from '@mui/icons-material/Favorite';
import ChipInput from 'material-ui-chip-input';

const emptyPost = {
    title: '',
    message: '',
    tags: [],
    selectedFile: '',
    url: '',
}

const emptyRemark = {
    type: '',
    message: '',
    id: '',
}

const Form = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = createTheme();
    const { id: postId } = useParams();
    const { t } = useTranslation();

    const imageNotFound = 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

    const img = document.getElementById('uploadedImage');
    if (img) img.onerror = () => img.src = imageNotFound;

    const actualPost = useSelector((state) => state.posts.post);
    const { isLoading } = useSelector(state => state.posts);

    const post = actualPost?._id === postId ? actualPost : null;

    const [postData, setPostData] = useState(emptyPost);
    const [image, setImage] = useState('');
    const [remark, setRemark] = useState(emptyRemark);
    const [imageMode, setImageMode] = useState('desktop');

    useEffect(() => {
        if (postId) dispatch(getPost(postId));
        else clear();
    }, [postId]);

    useEffect(() => {
        if (post && !remark.type.length) {
            setPostData(post);
            setImage(post.selectedFile);
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLoading || remark.type === 'successfull') return;

        if (!postData.tags.length)
            return setRemark({ type: 'tags', message: t('enter_one_tag') });

        if (!image.length) {
            if (imageMode === 'desktop') return setRemark({ type: 'selectedImage', message: t('please_select_image') });
            else return setRemark({ type: 'url', message: t('enter_url') });
        }

        if (img?.src === imageNotFound) {
            if (imageMode === 'desktop') return setRemark({ type: 'selectedImage', message: t('invalid_url') });
            else return setRemark({ type: 'url', message: t('invalid_url') });
        }

        const formData = new FormData();
        if (postData.selectedFile) formData.append('postImage', postData.selectedFile);
        else if (postData.url) formData.append('url', postData.url);
        formData.append('title', postData.title);
        formData.append('message', postData.message);
        formData.append('tags', postData.tags);
        formData.append('name', user?.result?.userName);

        if (post)
            dispatch(updatePost(postId, formData, setRemark, clear));
        else
            dispatch(createPost(formData, setRemark, clear, t));
    }

    const clear = () => {
        setPostData(emptyPost);
        setImage('');
    }

    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
        setRemark(emptyRemark);
    }

    const handleAddImage = (e) => {
        if (remark.type === 'successfull') return;

        const file = e.target.files[0];
        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (fileReader.readyState === 2)
                setImage(fileReader.result);
        }
        fileReader.readAsDataURL(file);

        setPostData({ ...postData, selectedFile: file, url: '' });
        setRemark(emptyRemark);
    }

    const handleSwitchMode = (e) => {
        setImageMode(e.target.value);

        if (remark.type === 'successfull') return;
        setRemark(emptyRemark);
    }

    const handleChangeUrl = (e) => {
        if (remark.type === 'successfull') return;

        setPostData({ ...postData, selectedFile: '', url: e.target.value })
        setImage(e.target.value);
        setRemark(emptyRemark);
    }

    if (!user?.result?.name) {
        return (
            <Container maxWidth='lg'>
                <Paper className={classes.err} >
                    <Typography variant="h6" align="center">
                        {t('sign_in_create')}
                    </Typography>
                </Paper>
            </Container>
        )
    }

    if (isLoading && !remark.type.length) {
        return (
            <Container maxWidth='lg' style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing(5) }}>
                <CircularProgress size="5em" />
            </Container>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth='md' >
                <Paper className={classes.paper} >
                    <Typography variant="h4" color='primary'>{!post ? t('create_post') : t('editing_post')}</Typography>
                    <Divider style={{ borderBottom: '2px solid lightgray' }} />
                    <Grid container style={{ marginTop: theme.spacing(1) }} alignItems='stretch'>
                        <Grid item className={classes.formGrid} xs={12} md={6}>
                            <form style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
                                <Container style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                                    <TextField style={{ marginTop: theme.spacing(1) }} name='title' required={true} variant='standard' label={t('title')} value={postData.title} inputProps={{ maxLength: 40 }} InputLabelProps={{ shrink: true }} onChange={handleChange} />
                                    <TextField style={{ marginTop: theme.spacing(2) }} name='message' required={true} variant='standard' label={t('message')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 800 }} value={postData.message} onChange={handleChange} />
                                    <ChipInput style={{ marginTop: theme.spacing(2) }} value={postData.tags} error={remark.type === 'tags'} helperText={remark.type === 'tags' && remark.message} onInput={() => remark.type !== 'successfull' && setRemark(emptyRemark)} onAdd={(tag) => { postData.tags.length <= 30 && tag.length <= 35 && setPostData({ ...postData, tags: [...postData.tags, tag] }) }} onDelete={(tagToDelete) => setPostData({ ...postData, tags: postData.tags.filter(tag => tag !== tagToDelete) })} label="Tags" variant='standard' InputLabelProps={{ shrink: true }} />
                                    <Container style={{ padding: 0, marginTop: theme.spacing(3), display: 'flex', alignItems: 'center' }}>
                                        <Select value={imageMode} label='Mode' color='primary' onChange={handleSwitchMode} variant='outlined' style={{ marginRight: theme.spacing(2) }} >
                                            <MenuItem value='desktop' >{t('from_desktop')}</MenuItem>
                                            <MenuItem value='url' >URL</MenuItem>
                                        </Select>
                                        {imageMode === 'desktop' ? (
                                            <>
                                                <Input type="file" name='postImage' accept='image/*' onChange={handleAddImage} style={{ display: 'none' }} id='uploadPostImage' />
                                                <label htmlFor="uploadPostImage">
                                                    <Container style={{ display: 'flex', padding: 0, alignItems: 'center', marginTop: theme.spacing(3), cursor: 'pointer' }} >
                                                        <UploadImg />
                                                        <Typography style={{ marginLeft: theme.spacing(1) }} variant="body1" color='gray'>{t('select_image')}</Typography>
                                                    </Container>
                                                </label>
                                            </>
                                        ) : (
                                            <TextField style={{ marginTop: theme.spacing(2) }} fullWidth name='url' error={remark.type === 'url'} helperText={remark.type === 'url' && remark.message} variant='standard' label="Url" InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 800 }} value={postData.url} onChange={handleChangeUrl} />
                                        )}
                                    </Container>
                                    <Container id='imageContainer' style={{ padding: 0, marginTop: theme.spacing(2) }} >
                                        <img id='uploadedImage' src={image || imageNotFound} alt={postData.title} className={classes.imageEl} />
                                    </Container>
                                    {remark.type === 'selectedImage' ? (
                                        <Typography style={{ marginTop: theme.spacing(1), backgroundColor: '#c3717b', padding: theme.spacing(.5) }} variant='body1' color='black' >
                                            {remark.message}
                                        </Typography>
                                    ) : ''}
                                </Container>
                                <Container style={{ padding: 0 }} className={classes.remark} >
                                    {isLoading ? (
                                        <Container style={{ marginTop: theme.spacing(2), display: 'flex', padding: 0, alignItems: 'center' }}>
                                            <CircularProgress size='2em' />
                                            <Typography style={{ marginLeft: theme.spacing(1) }} variant='body1' color='grey' >{t('loading')}</Typography>
                                        </Container>
                                    ) : (
                                        <>
                                            {remark.type === 'error' || remark.type === 'successfull' ? (
                                                <Typography style={{ marginTop: theme.spacing(2), backgroundColor: remark.type === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                                    {remark.message}
                                                </Typography>
                                            ) : ''}
                                        </>
                                    )}
                                </Container>
                                <Container className={classes.formButtons} >
                                    {remark.type !== 'successfull' ? (
                                        <Container style={{ marginTop: theme.spacing(2), display: 'flex', padding: 0 }}>
                                            {!post ? (
                                                <Button variant="outlined" color="secondary" onClick={clear} fullWidth>{t('clear')}</Button>
                                            ) : (
                                                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} fullWidth>{t('cancel')}</Button>
                                            )}
                                            <Button className={classes.buttonSubmit} variant="contained" color="primary" type="submit" fullWidth >
                                                {remark.type === 'error' ? t('try_again') : `${!post ? t('create') : t('save')}`}
                                            </Button>
                                        </Container>
                                    ) : (
                                        <Container style={{ marginTop: theme.spacing(2), padding: 0 }}>
                                            <Button variant="contained" color="primary" onClick={() => navigate(`/posts/${remark.id}`)} fullWidth>{t('show_post')}</Button>
                                        </Container>
                                    )}
                                </Container>
                            </form>
                        </Grid>
                        <Grid item style={{ padding: theme.spacing(1) }} xs={12} md={6}>
                            <Typography variant="h5" color='primary'>{t('preview')}</Typography>
                            <Divider />
                            <Container style={{ marginTop: theme.spacing(1), padding: 0 }}>
                                <Card className={classes.card} raised elevation={2}>
                                    <ButtonBase className={classes.cardAction}>
                                        <CardMedia className={classes.media} image={image.length ? image : imageNotFound} title={postData.title || ''} />
                                        <div className={classes.overlay}>
                                            <Typography variant="h6">{user?.result?.userName}</Typography>
                                            <Typography variant="body2">
                                                {post ? moment(post.createdAt).fromNow() : 'a few seconds ago'}
                                            </Typography>
                                        </div>
                                        <div className={classes.details}>
                                            <Typography variant="body2" color='textSecondary'>
                                                {postData.tags.length ? (
                                                    postData.tags.map(tag => ` #${tag}`)
                                                ) : 'tags'}
                                            </Typography>
                                        </div>
                                        <Typography className={classes.title} variant="h5" gutterBottom>
                                            {postData.title.length ? postData.title : t('title')}
                                        </Typography>
                                        <CardContent>
                                            <Typography variant="body2" color='textSecondary' component='p'>
                                                {postData.message.length ? postData.message : t('message')}
                                            </Typography>
                                        </CardContent>
                                    </ButtonBase>
                                    <CardActions className={classes.cardActions}>
                                        <IconButton size="small" color="primary">
                                            <Like htmlColor='red'/>&nbsp;{post ? `${post.likes.length}` : '0'}
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Container>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Form;