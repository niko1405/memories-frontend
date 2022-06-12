import { Container, TextField, createTheme, ThemeProvider, Grid, Button, CircularProgress } from "@material-ui/core";
import { Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../actions/auth";

import { useTranslation } from 'react-i18next';

import useStyles from "./styles";

const emptyRemark = {
    message: '',
    error: false
}

const ForgotPassword = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    let theme = createTheme();

    const [email, setEmail] = useState('');
    const [remark, setRemark] = useState(emptyRemark);

    const { isLoading } = useSelector(state => state.auth);

    const handleChange = (e) => {
        setEmail(e.target.value);

        setRemark(emptyRemark);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(forgotPassword(email, setRemark, i18n.language || 'en'));
    }

    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth='md'>
                <Paper>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Typography variant='h5' color='primary' ><b>{t('forgot_password')}</b></Typography>
                        <Typography style={{ marginTop: theme.spacing(1) }} variant='h6' color='grey' >{t('not_remember_password')}</Typography>
                        <TextField
                            style={{ marginTop: theme.spacing(2.5) }}
                            name='Email'
                            onChange={handleChange}
                            variant="outlined"
                            required
                            label='Email'
                            autoFocus={true}
                            helperText=''
                            error={false}
                            type='email'
                        />
                        {remark.message.length ? (
                            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(1) }}>
                                {isLoading ? (
                                    <>
                                        <CircularProgress size='2em' />
                                        <Typography variant='body1' color='grey' >{t('loading')}</Typography>
                                    </>
                                ) : (
                                    <Typography style={{ backgroundColor: remark.error ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                        {remark.message}
                                    </Typography>
                                )}
                            </Container>
                        ) : ''}
                        {!remark.message.length || remark.error ? (
                            <Grid style={{ marginTop: theme.spacing(2) }} container justifyContent='flex-end'>
                                <Grid item>
                                    <Button variant='outlined' color='primary' onClick={() => navigate('/auth')}>
                                        {t('back')}
                                    </Button>
                                    <Button style={{ marginLeft: theme.spacing(1.5) }} variant='contained' color='primary' type='submit'>
                                        {t('submit')}
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : ''}
                    </form>
                </Paper>
            </Container>
        </ThemeProvider >
    );
}

export default ForgotPassword;