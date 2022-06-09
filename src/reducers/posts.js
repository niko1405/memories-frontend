import { FETCH_ALL, CREATE, UPDATE, DELETE, FETCH_BY_SEARCH, START_LOADING, CLEAR_POSTS, END_LOADING, FETCH_POST, COMMENT, POST_ERROR, LOADING_MORE, FETCH_SAVED_POSTS, REMOVE_SAVED_POST } from '../constants/actionTypes';

const reducer = (state = { isLoading: false, error: false, post: null, posts: [], searchPosts: [], savedPosts: [], numbOfSections: 1, loadingMore: false }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, error: false, isLoading: true };
        case END_LOADING:
            return { ...state, error: false, isLoading: false };
        case FETCH_ALL:
            return {
                ...state,
                numbOfSections: action.payload.numbOfSections,
                posts: action.payload.currentSection > 1 ? [ ...state.posts, ...action.payload.posts ] : action.payload.posts,
                error: false
            };
        case FETCH_BY_SEARCH:
            if(action.payload.searchPosts) return { ...state, error: false, searchPosts: action.payload.posts };
            else return { ...state, error: false, posts: action.payload.posts };
        case FETCH_SAVED_POSTS:
            return { ...state, error: false, savedPosts: action.payload };
        case REMOVE_SAVED_POST:
            return { ...state, error: false, savedPosts: state.savedPosts.filter((post) => post._id !== action.payload) };
        case FETCH_POST:
            return { ...state, error: false, post: action.payload };
        case CLEAR_POSTS:
            return { ...state, error: false, posts: [] };
        case CREATE:
            return { ...state, error: false, posts: [...state.posts, action.payload] };
        case COMMENT:
            return { ...state, error: false, posts: state.posts.map((post) => {
                if(post._id === action.payload._id)
                    return action.payload;

                return post;
            }) }
        case UPDATE:
            return { ...state, error: false, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
        case LOADING_MORE:
            return { ...state, loadingMore: action?.data };
        case DELETE:
            return { ...state, error: false, posts: state.posts.filter((post) => post._id !== action.payload) };
        case POST_ERROR:
            return { ...state, error: true, isLoading: false };
        default:
            return state;
    }
}

export default reducer;