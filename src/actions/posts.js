import { sendPushNotification } from '..';
import * as api from '../api';
import { FETCH_ALL, CREATE, UPDATE, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, FETCH_POST, FETCH_ALL_POSTS, COMMENT, POST_ERROR, FETCH_SAVED_POSTS, REMOVE_SAVED_POST } from '../constants/actionTypes';

//Action Creators
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await api.fetchPost(id);

        if (data != null) {
            dispatch({ type: FETCH_POST, payload: data });

            dispatch({ type: END_LOADING });
        } else
            dispatch({ type: POST_ERROR });

    } catch (error) {
        dispatch({ type: POST_ERROR });
    }
}

export const getPosts = (section, setError) => async (dispatch) => {
    dispatch({ type: START_LOADING })

    await api.fetchPosts(section).then(({ data }) => {
        dispatch({ type: FETCH_ALL, payload: data });

        setError(false);
    }).catch(err => {
        setError(true);
    });

    dispatch({ type: END_LOADING });
}

export const getPostsBySearch = (searchQuery, searchPosts = false, setLoading = undefined) => async (dispatch) => {
    setLoading ? setLoading(true) : dispatch({ type: START_LOADING });

    await api.fetchPostsBySearch(searchQuery).then(({ data }) => {
        dispatch({ type: FETCH_BY_SEARCH, payload: { ...data, searchPosts } });
    }).catch(err => console.log(err));

    setLoading ? setLoading(false) : dispatch({ type: END_LOADING });
}

export const createPost = (formData, setRemark, clear) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    setRemark({ type: 'loading', message: 'loading...' });

    await api.createPost(formData).then(({ data }) => {
        setRemark({ type: 'successfull', message: data.message, id: data.post._id });
        clear();

        dispatch({ type: CREATE, payload: data.post });

        //send push notification to followers when specific notifications enabled
        data.followersSettings.forEach(followerSettings => {
            if (followerSettings.notifications.enable && followerSettings.notifications.posts_comments)
                sendPushNotification(followerSettings._id, `Post has been shared`, `${data.post.name} has shared a new post, go check it out!`, data.profileImg || 'default')
        });
    }).catch((err) => {
        setRemark({ type: 'error', message: err.response.data.message });
    });

    dispatch({ type: END_LOADING });
}

export const updatePost = (id, formData, setRemark, clear) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    setRemark({ type: 'loading', message: 'loading...' });

    await api.updatePost(id, formData).then(({ data }) => {
        setRemark({ type: 'successfull', message: data.message, id });
        clear();

        dispatch({ type: UPDATE, payload: data.post });
    }).catch(err => {
        setRemark({ type: 'error', message: err.response.data.message });
    });

    dispatch({ type: END_LOADING });
}

export const commentPost = (value, id, userId) => async (dispatch) => {
    try {
        const { data } = await api.commentPost(value, id);

        dispatch({ type: COMMENT, payload: data.updatedPost });

        if (userId !== data.updatedPost.creator) {
            //send push notification to post creator when specific notifications enabled
            if (data.creatorSettings.notifications.enable && data.creatorSettings.notifications.posts_comments)
                sendPushNotification(data.creatorSettings._id, `${value.split(':')[0]} has comment on your post!`, `Message: ${value.split(':')[1]}`, data.creatorProfileImg);
        }
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);

        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);

        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const savePost = (postId, userId, setRemark = () => { }) => async (dispatch) => {
    await api.savePost(postId, userId).then(({ data }) => {
        setRemark({ type: 'success', message: data.message });
    }).catch(err => setRemark({ type: 'error', message: err.response.data.message }));
}

export const getSavedPosts = (id) => async (dispatch) => {
    await api.getSavedPosts(id).then(({ data }) => {
        dispatch({ type: FETCH_SAVED_POSTS, payload: data.savedPosts });
    }).catch(err => console.log(err));
}

export const removeSavedPost = (postId, userId) => async (dispatch) => {
    await api.removeSavedPost(postId, userId).then(({ data }) => {
        dispatch({ type: REMOVE_SAVED_POST, payload: postId });
    }).catch(err => console.log(err));
}