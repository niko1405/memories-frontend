import { CircularProgress, Container, createTheme, Paper, ThemeProvider } from "@material-ui/core";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { activateUser } from "../../../actions/auth";

import useStyles from './styles';

const EmailSent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    let theme = createTheme();

    const [error, setError] = useState('');

    const { id } = useParams();
    const language = new URLSearchParams(location.search).get('language') || 'en';

    const { isLoading } = useSelector(state => state.auth);

    useEffect(() => {
        i18n.changeLanguage(language);
        dispatch(activateUser(id, setError));
    }, []);

    const login = () => {
        navigate('/auth');
    }

    const tryAgain = () => {
        dispatch(activateUser(id, setError));
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component='main' maxWidth='lg'>
                <Paper className={classes.paper} >
                    <Typography variant='h4' color='primary'>{t('user_activation')}</Typography>
                    {isLoading ? (
                        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing(2) }} >
                            <CircularProgress size='3em' />
                            <Typography style={{ marginLeft: theme.spacing(2) }} variant='h6' color='grey'>{t('verify_user')}</Typography>
                        </Container>
                    ) : (
                        <>
                            {error.length ? (
                                <Container style={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2) }} >
                                    <Typography variant='h6' color='red'>{error}</Typography>
                                    <Button style={{ marginLeft: theme.spacing(2) }} variant='outlined' color='primary' onClick={tryAgain} >{t('try_again')}</Button>
                                </Container>
                            ) : (
                                <Container style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', marginTop: theme.spacing(2) }} >
                                    <Typography variant='h6' color='green'><b>{t('user_activated')}</b></Typography>
                                    <Typography style={{ marginTop: theme.spacing(1) }} variant='h6' color='grey'>{t('login_now')}</Typography>
                                    <Button style={{ marginTop: theme.spacing(2.5) }} variant='outlined' color='primary' onClick={login} >Login</Button>
                                </Container>
                            )}
                        </>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default EmailSent;