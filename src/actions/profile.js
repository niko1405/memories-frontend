import * as api from '../api';
import { GET_PROFILE_USER, UPDATE_OWN_PROFILE, HANDLE_FOLLOWING, START_LOADING, END_LOADING, PROFILE_ERROR, 
    GET_USERS, CLEAR_USERS, SEARCH_USERS, GET_USER, GET_PROFILES, SEARCH_PROFILES, GET_SUGGESTED_PROFILES, GET_CHAT, SEND_DIRECT_MESSAGE, GET_RECENT_CHATS, SEARCH_CHATS } from '../constants/actionTypes';
import { getUser } from './auth';

import { sendPushNotification } from '../';

export const getProfileUser = query => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await api.getProfileUser(query);

        if (data != null)
            dispatch({ type: GET_PROFILE_USER, data });
        else
            dispatch({ type: PROFILE_ERROR });

        dispatch({ type: END_LOADING });

    } catch (error) {
        dispatch({ type: PROFILE_ERROR });
    }
}

export const updateOwnProfile = (id, formData, setLoading, setEditProfile) => async (dispatch) => {
    setLoading(true);

    await api.updateOwnProfile(id, formData).then(({ data }) => {
        dispatch({ type: UPDATE_OWN_PROFILE, data });

        dispatch({ type: GET_USER, data: data.updatedProfile });

        setLoading(false);
        setEditProfile(false);
    }).catch(_ => dispatch({ type: PROFILE_ERROR }));
}

export const follow = (userToFollow, userWhoFollows, profileUser, currentUser, setLoading, type = undefined, t) => async (dispatch) => {
    setLoading(true);

    await api.follow(userToFollow, userWhoFollows).then(({ data }) => {
        let updatedProfileUser = profileUser;

        if (userToFollow._id === profileUser._id) updatedProfileUser = data.updatedUserToFollow;
        else if (userWhoFollows._id === profileUser._id) updatedProfileUser = data.updatedUserWhoFollows;

        let updatedCurrentUser = currentUser.result;

        if (userToFollow._id === currentUser.result._id) updatedCurrentUser = data.updatedUserToFollow;
        else if (userWhoFollows._id === currentUser.result._id) updatedCurrentUser = data.updatedUserWhoFollows;

        dispatch({ type: HANDLE_FOLLOWING, data: { currentUser, updatedCurrentUser, updatedProfileUser } });

        //send push notification to userToFollow when specific notifications enabled
        if (data.userToFollowNotifications.enable && data.userToFollowNotifications.following_followers)
            sendPushNotification(userToFollow._id, t('follower_notification_title'), t('follower_notification_message', { user: userWhoFollows.userName }), userWhoFollows.imageUrl);

        setLoading(false);
    }).catch(err => console.log(err));
}

export const unfollow = (userToUnfollow, userWhoUnfollows, profileUser, currentUser, setLoading, type = undefined) => async (dispatch) => {
    setLoading(true);

    await api.unfollow(userToUnfollow, userWhoUnfollows).then(({ data }) => {
        let updatedProfileUser = profileUser;

        if (userToUnfollow._id === profileUser._id) updatedProfileUser = data.updatedUserToUnfollow;
        else if (userWhoUnfollows._id === profileUser._id) updatedProfileUser = data.updatedUserWhoUnfollows;

        let updatedCurrentUser = currentUser.result;

        if (userToUnfollow._id === currentUser.result._id) updatedCurrentUser = data.updatedUserToUnfollow;
        else if (userWhoUnfollows._id === currentUser.result._id) updatedCurrentUser = data.updatedUserWhoUnfollows;

        dispatch({ type: HANDLE_FOLLOWING, data: { currentUser, updatedCurrentUser, updatedProfileUser } });

        dispatch({ type: END_LOADING });

        if (currentUser.result._id === profileUser._id) {
            dispatch({ type: CLEAR_USERS });
            if (type === 'follower')
                dispatch(getUsers(updatedProfileUser.follower, 1));
            else if (type === 'following')
                dispatch(getUsers(updatedProfileUser.follows, 1));
        }

        setLoading(false);
    }).catch(err => {
        console.log(err)
        dispatch({ type: PROFILE_ERROR })
    });
}

export const getUsers = (userIds, section) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await api.getUsers(userIds, section);

        dispatch({ type: GET_USERS, data });

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: PROFILE_ERROR });
    }
}

export const clearUsers = () => async (dispatch) => {
    dispatch({ type: CLEAR_USERS });
}

export const searchUsers = (userIds, userName) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await api.searchUsers(userIds, userName);

        dispatch({ type: SEARCH_USERS, data });

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: PROFILE_ERROR });
    }
}

export const getProfiles = (section, setError) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    await api.getProfiles(section).then(({ data }) => {
        dispatch({ type: GET_PROFILES, data });

        setError(false);
    }).catch(err => setError(true));

    dispatch({ type: END_LOADING });
}

export const searchProfiles = (searchQuery, setError = undefined, setLoading = undefined) => async (dispatch) => {
    setLoading ? setLoading(true) : dispatch({ type: START_LOADING });

    await api.searchProfiles(searchQuery).then(({ data }) => {
        dispatch({ type: SEARCH_PROFILES, data });
    }).catch(err => setError && setError(err.response.data.message));

    setLoading ? setLoading(false) : dispatch({ type: END_LOADING });
}

export const getSuggestedProfiles = (id) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    await api.getSuggestedProfiles(id).then(({ data }) => {
        dispatch({ type: GET_SUGGESTED_PROFILES, data: data.profiles });
    }).catch(err => console.log(err));

    dispatch({ type: END_LOADING });
}

export const getRecentChats = (id) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    await api.getRecentChats(id).then(({ data }) => {
        dispatch({ type: GET_RECENT_CHATS, data: data.profiles });
    }).catch(err => console.log(err));

    dispatch({ type: END_LOADING });
}

export const searchChats = (id, value) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    await api.searchChats(id, value).then(({ data }) => {
        dispatch({ type: SEARCH_CHATS, data });
    }).catch(err => console.log(err));

    dispatch({ type: END_LOADING });
}

export const getChat = (id, chatId) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    await api.getChat(id, chatId).then(({ data }) => {
        dispatch({ type: GET_CHAT, data });
    }).catch(err => console.log(err));

    dispatch({ type: END_LOADING });
}

export const sendDirectMessage = (id, chatId, message, t) => async (dispatch) => {
    await api.sendDirectMessage(id, chatId, message).then(({ data }) => {
        dispatch({ type: SEND_DIRECT_MESSAGE, data: { messages: data.messages, chatProfile: data.chatProfile } });

         //send push notification to receiver when specific notifications enabled
         if (data.receiverSettings.notifications.enable && data.receiverSettings.notifications.directMessages)
            sendPushNotification(chatId, t('direct_message_notification_title', { user: message[0] }), `${t('message')}: ${message[1]}`, data.chatProfile.imageUrl);
    }).catch(err => console.log(err));
}