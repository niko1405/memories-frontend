import axios from 'axios';

const API = axios.create({ baseURL: 'https://memories-project-v1-0.herokuapp.com' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (section) => API.get(`/posts?section=${section}`);
export const fetchPostsBySearchs = ({ title, creator, tags, id }) => API.get(`/posts/search?title=${title}&creator=${creator}&tags=${tags}&id=${id}`);
export const fetchPostsBySearch = (searchQuery) => API.patch(`/posts/search`, { searchQuery });
export const createPost = (formData) => API.post('/posts', formData);
export const updatePost = (id, formData) => API.patch(`/posts/${id}`, formData);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const commentPost = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const refreshPosts = (prevUsername, userName) => API.post(`/posts/refreshPosts`, { prevUsername, userName });
export const savePost = (postId, userId) => API.post(`/posts/save/${postId}`, { userId });
export const getSavedPosts = (id) => API.get(`/posts/save/${id}`);
export const removeSavedPost = (postId, userId) => API.patch(`/posts/save/remove/${postId}`, { userId });

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const activateUser = (id) => API.get(`/user/activate/${id}`);
export const googleSignIn = (googleData) => API.post('/user/googleSignIn', googleData);
export const getUser = ({ id = '0', userName = '0' }) => API.get(`/user?id=${id}&userName=${userName}`);
export const forgotPassword = (email) => API.post(`/user/forgotPw`, { email });
export const changePassword = (id, password) => API.post(`/user/changePw`, { id, password });
export const deleteAccount = (id) => API.get(`/user/deleteAcc/${id}`);
export const changeUsername = (id, userName) => API.post(`/user/changeUsername/${id}`, { userName });

export const changeTheme = (id, darkMode) => API.patch(`/settings/theme/${id}`, { darkMode });
export const changeLanguage = (id, language) => API.patch(`/settings/language/${id}`, { language });
export const getTheme = (id) => API.get(`/settings/theme/${id}`);
export const getLanguage = (id) => API.get(`/settings/language/${id}`);
export const updatePersInfo = (id, persInfo) => API.patch(`/settings/persInfo/${id}`, persInfo);
export const getPersInfo = (id) => API.get(`/settings/persInfo/${id}`);
export const updateNotifications = (id, notifications) => API.patch(`/settings/notifications/${id}`, notifications);
export const getNotifications = (id) => API.get(`/settings/notifications/${id}`);

export const getProfileUser = ({ id, userName }) => API.get(`/profile?id=${id}&userName=${userName}`);
export const updateOwnProfile = (id, formData) => API.patch(`/profile/${id}`, formData);
export const follow = (userToFollow, userWhoFollows) => API.patch('/profile/follow', { userToFollow, userWhoFollows });
export const unfollow = (userToUnfollow, userWhoUnfollows) => API.patch(`/profile/unfollow`, { userToUnfollow, userWhoUnfollows });
export const getUsers = (userIds, section) => API.post(`/profile?section=${section}`, { userIds });
export const searchUsers = (userIds, userName) => API.post(`/profile/search`, { userIds, userName });
export const getProfiles = (section) => API.get(`/profile/getProfiles?section=${section}`);
export const searchProfiles = (searchQuery) => API.patch(`/profile/searchProfiles`, { searchQuery });

export const getSuggestedProfiles = (id) => API.get(`/profile/suggestedProfiles/${id}`);
export const getRecentChats = (id) => API.get(`/profile/recentChats/${id}`);
export const searchChats = (id, value) => API.get(`/profile/chats?id=${id}&value=${value}`);
export const getChat = (id, chatId) => API.patch(`/profile/chat/${id}`, { chatId });
export const sendDirectMessage = (id, chatId, message) => API.patch(`/profile/directMessage/${id}`, { chatId, message });

export const sendPushNotification = (id, subscription, { title, message, icon }) => API.post(`/subscribe/${id}`, { subscription, title, message, icon });