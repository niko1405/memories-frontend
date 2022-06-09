import { Container, Avatar, Grid, Divider, CircularProgress, TextField, Input, responsiveFontSizes, createTheme, ThemeProvider } from '@material-ui/core';
import { Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import CamIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getPostsBySearch } from '../../actions/posts';
import { follow, unfollow, updateOwnProfile } from '../../actions/profile';
import { getProfileUser } from '../../actions/profile';
import { getUser } from '../../actions/auth';
import Post from '../Posts/Post/Post';

import useStyles from './styles';
import ErrorPage from '../ErrorPage/ErrorPage';
import FollowList from './FollowList/FollowList';

const emptyProfileData = {
    description: '',
    links: '',
    selectedImage: '',
}

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [editProfile, setEditProfile] = useState(false);
    const [fullTextField, setFullTextField] = useState(false);
    const [profileData, setProfileData] = useState(emptyProfileData);
    const [image, setImage] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [followList, setFollowList] = useState({ type: undefined });
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    let theme = createTheme();
    theme = responsiveFontSizes(theme, { factor: 5 });

    const error = useSelector(state => state.profile.error);
    const { isLoading } = useSelector(state => state.posts);
    const myPosts = useSelector(state => state.posts.posts);
    const profileUser = useSelector(state => state.profile.profileUser);
    const currentUser = useSelector(state => state.auth.user);
    const { darkMode } = useSelector(state => state.settings);

    const following = currentUser?.follows?.filter(followId => followId === profileUser?._id).length > 0;

    useEffect(() => {
        dispatch(getProfileUser({ id }));
        setLoadingPosts(false);
        setFollowList({ type: undefined });
    }, [id]);

    useEffect(() => {
        dispatch(getUser({ id: user?.result._id }));
    }, [following, profileUser]);

    useEffect(() => {
        if (!loadingPosts && profileUser?._id === id) {
            dispatch(getPostsBySearch(profileUser?._id));
            setProfileData({ description: profileUser?.description, links: profileUser?.links, selectedImage: profileUser?.imageUrl });
            setImage(profileUser?.imageUrl);
            setLoadingPosts(true);
        }
    }, [profileUser]);

    const handleChange = (e, charLimit) => {
        if (e.target.value.length <= charLimit) {
            setFullTextField(false);
            setProfileData({ ...profileData, [e.target.name]: e.target.value });
        } else setFullTextField(true);
    }

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('profileImage', profileData.selectedImage);
        formData.append('description', profileData.description);
        formData.append('links', profileData.links);

        dispatch(updateOwnProfile(profileUser._id, formData, setLoading, setEditProfile));
    }

    const handleFollow = () => {
        if (!user) return;

        if (!following) {
            dispatch(follow(profileUser, currentUser, profileUser, user, setLoading));
        } else {
            dispatch(unfollow(profileUser, currentUser, profileUser, user, setLoading));
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                setImage(fileReader.result);
            }
        }
        fileReader.readAsDataURL(file);

        setProfileData({ ...profileData, selectedImage: file });
    }

    const showFollowerList = () => {
        setFollowList({ type: 'follower' });
    }

    const showFollowsList = () => {
        setFollowList({ type: 'following' });
    }

    const handleEdit = () => {
        if (editProfile) { setProfileData({ description: profileUser?.description, links: profileUser?.links, selectedImage: profileUser?.imageUrl }); setImage(profileUser?.imageUrl); }
        setEditProfile(!editProfile);
    }

    const handleMessage = () => {
        if (!user) return;

        navigate(`/messages/${profileUser._id}`);
    }

    if (error) return <ErrorPage />

    if (isLoading && !followList.type) {
        return (
            <Container maxWidth='lg' style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing(5) }}>
                <CircularProgress size="3em" />
            </Container>
        )
    }

    if (followList.type) return <FollowList profileUser={profileUser} currentUser={currentUser} followList={followList} setFollowList={setFollowList} />

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" className={classes.main}>
                <Grid container style={{ paddingTop: theme.spacing(2) }}>
                    <Grid item style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} md={5} xs={12}>
                        <Avatar src={image} className={classes.profileAvatar} referrerPolicy='no-referrer' />
                        {editProfile && (
                            <>
                                <Input type="file" accept='image/*' onChange={handleImageUpload} style={{ display: 'none' }} id='imageProfile' />
                                <label htmlFor="imageProfile"><Avatar style={{ cursor: 'pointer', position: 'absolute', top: '75%', left: '55%', border: '2px solid grey' }}><CamIcon /> </Avatar></label>
                            </>
                        )}
                    </Grid>
                    <Grid item md={6} xs={12} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-around', marginTop: theme.spacing(2) }}>
                        <Container className={classes.stats} >
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} ><strong>{myPosts.length}</strong></Typography>
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} >{t('posts')}</Typography>
                        </Container>
                        <Container className={classes.stats} >
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} style={{ cursor: 'pointer' }} onClick={showFollowerList} ><strong>{profileUser?.follower.length}</strong></Typography>
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} >Follower</Typography>
                        </Container>
                        <Container className={classes.stats} >
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} style={{ cursor: 'pointer' }} onClick={showFollowsList}><strong>{profileUser?.follows.length}</strong></Typography>
                            <Typography variant='h6' color={darkMode ? 'white' : 'none'} >{t('following')}</Typography>
                        </Container>
                    </Grid>
                </Grid>
                <Container className={classes.information} >
                    <Typography variant='h4' style={{ color: darkMode ? 'white' : '#666666' }}><strong>{profileUser?.userName}</strong></Typography>
                    <Container className={classes.profileInfo} maxWidth="sm">
                        <div style={{ display: 'flex' }}>
                            <Typography variant='h6' style={{ color: darkMode ? 'white' : '#666666' }}><strong>{t('description')}:</strong></Typography>
                            <TextField
                                name='description'
                                disabled={!editProfile}
                                style={{ marginTop: !editProfile && theme.spacing(-1.7) }}
                                InputProps={{
                                    style: {
                                        color: darkMode ? 'white' : '#666666',
                                        fontSize: '19px'
                                    },
                                    classes: {
                                        notchedOutline: !editProfile && classes.noEditProfile
                                    }
                                }} variant='outlined' type="text" fullWidth maxRows={4} multiline value={profileData.description} onChange={(e) => handleChange(e, 250)} error={fullTextField} helperText={fullTextField ? 'Max numb. of chars: 250' : ''}
                            />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography variant='h6' style={{ color: darkMode ? 'white' : '#666666' }}><strong>Links:</strong></Typography>
                            <TextField name='links' disabled={!editProfile} style={{ marginTop: !editProfile && theme.spacing(-1.7) }}
                                InputProps={{
                                    style: {
                                        color: darkMode ? 'white' : '#666666',
                                        fontSize: '19px'
                                    },
                                    classes: {
                                        notchedOutline: !editProfile && classes.noEditProfile
                                    }
                                }} variant='outlined' type="text" fullWidth maxRows={4} multiline value={profileData.links} onChange={(e) => handleChange(e, 300)} error={fullTextField} helperText={fullTextField ? 'Max numb. of chars: 300' : ''}
                            />
                        </div>
                    </Container>
                </Container>
                <Container style={{ marginTop: '15px', padding: theme.spacing(.5) }} >
                    {!user?.result || user?.result?.name !== profileUser?.name ? (
                        <>
                            <Button variant={following ? 'outlined' : 'contained'} color='primary' size="small" onClick={handleFollow} >
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <>
                                        {following ? t('unfollow') : t('follow')}
                                    </>
                                )}
                            </Button>
                            <Button variant='outlined' color='primary' size="small" onClick={handleMessage} style={{ marginLeft: theme.spacing(1) }} >
                                {t('message')}
                            </Button>
                        </>
                    ) : (
                        <Container style={{ display: 'flex', padding: 0 }} >
                            <Button variant={!editProfile ? 'contained' : 'outlined'} disabled={loading} color="primary" onClick={handleEdit} style={{ marginRight: theme.spacing(1) }} >
                                <EditIcon />&nbsp;{t('edit_profile')}
                            </Button>
                            {editProfile && (
                                <Button disabled={profileData.description.length === 0 || profileData.links.length === 0 || loading} variant='contained' type='submit' color='primary' onClick={handleSubmit} >
                                    {loading ? <CircularProgress /> : t('submit')}
                                </Button>
                            )}
                        </Container>
                    )}
                </Container>
                <Container className={classes.posts} >
                    <Typography variant='h4' color='primary'>Posts</Typography>
                    <Divider style={{ background: darkMode && 'gray' }} />
                    {myPosts.length ? (
                        <Grid container className={classes.postsGrid} alignItems="stretch" spacing={3} >
                            {myPosts.map((post) => (
                                <Grid item key={post._id} xs={12} sm={12} md={6} lg={4}>
                                    <Post post={post} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='h6' color={darkMode ? 'lightgray' : 'textPrimary'} style={{ margin: '20px 20px' }} >{t('no_posts')}</Typography>
                        </Container>
                    )}
                </Container>
            </Container>
        </ThemeProvider>
    );
}

export default Profile;