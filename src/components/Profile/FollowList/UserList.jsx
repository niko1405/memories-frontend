import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Container, CircularProgress } from "@material-ui/core";
import Dustbin from '@mui/icons-material/Delete';
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { clearUsers, follow, getUsers, unfollow } from "../../../actions/profile";

const UserList = ({ profileUser, theme, type, userList }) => {
    const currUser = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const { isLoading } = useSelector(state => state.posts);
    const { currentUser, users, currentSection } = useSelector(state => state.profile);

    const [loading, setLoading] = useState(false);

    const ownProfile = profileUser._id === currentUser?._id;

    useEffect(() => {
        dispatch(clearUsers());
        if(userList.length)
            dispatch(getUsers(userList, 1));
    }, []);

    const navigateToProfile = (user) => {
        navigate(`/profile/${user._id}`);
    }

    const handleRemove = (e, user) => {
        e.stopPropagation();

        if (type === 'follower')
            dispatch(unfollow(currentUser, user, profileUser, currUser, setLoading, type));
        else
            dispatch(unfollow(user, currentUser, profileUser, currUser, setLoading, type));
    }

    const handleFollow = (e, user) => {
        e.stopPropagation();

        const isFollowing = currentUser.follows.includes(user._id)

        if (!isFollowing)
            dispatch(follow(user, currentUser, profileUser, currUser, setLoading, type));
        else
            dispatch(unfollow(user, currentUser, profileUser, currUser, setLoading, type));
    }

    const handleShowMore = () => {
        dispatch(getUsers(userList, currentSection + 1));
    }

    if (isLoading || loading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2) }} >
                <CircularProgress size="3em" />
            </Container>
        )
    }

    return (
        <List sx={{ width: '100%', backgroundColor: 'green' }} >
            {users.length > 0 ? (
                <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                    {users?.map(user => (
                        <ListItem alignItems="center" style={{ width: '250px', maxWidth: '250px' }} onClick={() => navigateToProfile(user)} key={user._id} >
                            <ListItemAvatar>
                                <Avatar alt={user.userName} src={user.imageUrl} />
                            </ListItemAvatar>
                            <ListItemText primary={user.userName} secondary={user.name} />
                            {ownProfile ? (
                                <>
                                    {!currentUser?.follows.includes(user._id) && (
                                        <Typography onClick={(e) => handleFollow(e, user)} variant='subtitle1' color='primary' style={{ cursor: 'pointer', marginRight: theme.spacing(1), marginLeft: theme.spacing(5) }} ><strong>{t('follow')}</strong></Typography>
                                    )}
                                    <Tooltip title={t('remove')} ><IconButton variant='outlined' size='small' onClick={(e) => handleRemove(e, user)} ><Dustbin /></IconButton></Tooltip>
                                </>
                            ) : (
                                <>
                                    {user._id !== currentUser?._id && currUser && (
                                        <Button style={{ marginLeft: theme.spacing(7), fontSize: theme.spacing(1.3) }} onClick={(e) => handleFollow(e, user)} variant={currentUser?.follows?.includes(user._id) ? 'outlined' : 'contained'} size='small' color='primary' >{currentUser?.follows?.includes(user._id) ? t('unfollow') : t('follow')}</Button>
                                    )}
                                </>
                            )}
                        </ListItem>
                    ))}
                    {userList.length > 10 && users.length < userList.length && (
                        <Typography variant='h6' color='primary' onClick={handleShowMore} style={{ cursor: 'pointer', marginTop: theme.spacing(1) }} >{t('show_more')}</Typography>
                    )}
                </Container>
            ) : (
                <Container style={{ display: 'flex', justifyContent: 'center' }} >
                    <Typography variant='subtitle1' style={{ color: '#666' }} >{t('nothing_to_see')}</Typography>
                </Container>
            )}
        </List>
    );
}

export default UserList;