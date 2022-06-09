import { Button, Container, createTheme, Grid, ThemeProvider } from "@material-ui/core";
import { Typography, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import Post from "./Post/Post";
import { getPosts, getSavedPosts } from '../../actions/posts';

import useStyles from './styles';
import sadFace from '../../images/sadFace.png';
import { store } from "../..";
import { LOADING_MORE } from "../../constants/actionTypes";

const scrollFunc = () => {
    if (store.getState().posts.isLoading) return;

    const scrollEl = document.scrollingElement;

    //when scrolling to bottom load more posts
    if ((scrollEl.scrollHeight - Math.round(scrollEl.scrollTop)) >= scrollEl.clientHeight) {
        store.dispatch({ type: LOADING_MORE, data: true });

        //wait 2 seconds after checking again
        setTimeout(() => {
            store.dispatch({ type: LOADING_MORE, data: false });
        }, 1000);
    }
}

window.onscroll = scrollFunc;

const Posts = ({ loadingCircleSize = '3em' }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = createTheme();
    const { t } = useTranslation();

    const [error, setError] = useState(false);
    const [section, setSection] = useState(1);

    const { posts, isLoading, loadingMore, numbOfSections } = useSelector((state) => state.posts);
    const { darkMode } = useSelector(state => state.settings);

    useEffect(() => {
        window.scrollTo(0, 0);
        setSection(1);

        dispatch(getPosts(1, setError));

        if(user) dispatch(getSavedPosts(user.result._id));
    }, []);

    useEffect(() => {
        if (loadingMore) {
            if (numbOfSections <= section) return;
            const nextSection = section + 1;

            setSection(nextSection);
            dispatch(getPosts(nextSection, setError));
        }
    }, [loadingMore]);

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <Container style={{ padding: theme.spacing(2) }} maxWidth='md'>
                    <Container className={classes.error}>
                        <Typography variant='body1' color='grey' >
                            {t('internal_server_error')}
                        </Typography>
                        <Button style={{ marginTop: theme.spacing(1) }} variant='contained' color='primary' onClick={() => dispatch(getPosts(section, setError))} >
                            {isLoading ? <CircularProgress color="warning" /> : t('try_again')}
                        </Button>
                    </Container>
                </Container>
            </ThemeProvider>
        )
    }

    if (!posts?.length && !isLoading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: darkMode && 'black' }}>
                <Typography variant="h5" className={classes.noPosts}>
                    {t('nothing_to_see')}&nbsp;<img src={sadFace} width="30px" height="30px" />
                </Typography>
            </Container>
        )
    }

    if (isLoading && section < 2)
        return <Container className={classes.loading}><CircularProgress size={loadingCircleSize} /></Container>

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='lg' className={classes.mainContainer} >
                <Grid container alignItems='stretch' spacing={2} >
                    {posts.map((post) => (
                        <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
                            <Post post={post} />
                        </Grid>
                    ))}
                    {isLoading && section > 1 && (
                        <Container style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1), display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size='3em' />
                        </Container>
                    )}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default Posts;