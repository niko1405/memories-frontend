import { GET_PROFILE_USER, HANDLE_FOLLOWING, UPDATE_OWN_PROFILE, PROFILE_ERROR, GET_USERS,
     SEARCH_CHATS, CLEAR_USERS, SEND_DIRECT_MESSAGE, SEARCH_USERS, LOAD_CURRENT_USER, GET_CHAT,
      GET_PROFILES, CLEAR_PROFILES, SEARCH_PROFILES, GET_SUGGESTED_PROFILES, GET_RECENT_CHATS } from "../constants/actionTypes";

const defaultState = {
    profileUser: null,
    currentUser: null, error: false,
    numberOfSections: 1,
    currentSection: 1,
    users: [],
    profiles: [],
    recentChats: [],
    chat: {
        chatProfile: {},
        messages: [],
    },
}

const profileReducer = (state = defaultState, action) => {
    let payload;
    switch (action.type) {
        case GET_PROFILE_USER:
            return { ...state, profileUser: action?.data, error: false };
        case UPDATE_OWN_PROFILE:
            payload = action?.data;

            return { ...state, profileUser: payload.updatedProfile, error: false };
        case HANDLE_FOLLOWING:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data.currentUser }));

            return { ...state, profileUser: action?.data.updatedProfileUser, currentUser: action?.data.updatedCurrentUser, error: false };
        case GET_USERS:
            return {
                ...state, error: false,
                users: [...state.users, ...action?.data.users],
                numberOfSections: action?.data.numberOfSections,
                currentSection: action?.data.currentSection,
            };
        case CLEAR_USERS:
            return { ...state, error: false, users: [], numberOfSections: 1, currentSection: 1 };
        case SEARCH_USERS:
            return { ...state, error: false, users: action?.data.users, numberOfSections: 1, currentSection: 1 }
        case GET_PROFILES:
            return {
                ...state, error: false,
                profiles: action.data.currentSection > 1 ? [...state.profiles, ...action.data.profiles] : action.data.profiles,
                numberOfSections: action?.data.numberOfSections,
                currentSection: action?.data.currentSection,
            };
        case GET_SUGGESTED_PROFILES:
            return { ...state, profiles: action.data };
        case GET_RECENT_CHATS:
            return { ...state, recentChats: action.data };
        case GET_CHAT:
            return { ...state, chat: action.data };
        case SEARCH_CHATS:
            return { ...state, recentChats: action.data.recentChats, profiles: action.data.suggestedChats };
        case SEND_DIRECT_MESSAGE:
            return { ...state, chat: action.data };
        case CLEAR_PROFILES:
            return { ...state, error: false, profiles: [], numberOfSections: 1, currentSection: 1 };
        case SEARCH_PROFILES:
            return { ...state, error: false, profiles: action?.data.profiles, numberOfSections: 1, currentSection: 1 };
        case LOAD_CURRENT_USER:
            return { ...state, currentUser: action?.data };
        case PROFILE_ERROR:
            return { ...state, profileUser: null, error: true };
        default:
            return state;
    }
}

export default profileReducer;