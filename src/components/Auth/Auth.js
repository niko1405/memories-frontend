import { Avatar, Button, Container, Grid, Paper, CircularProgress, Dialog, Slide, Link } from '@material-ui/core';
import { Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { googleSignIn, signin, signup } from '../../actions/auth';

import CustomInput from './Input';
import Icon from './icon';

import useStyles from './styles';

import { isValid, isEqual } from '../../passwordChecker';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = {
    name: '',
    firstName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const noErrors = {
    email: '',
    name: '',
    userName: '',
    password: '',
    confirmPassword: '',
    broadcast: '',
}

const Auth = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [emailVer, setEmailVer] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState(noErrors);

    const { isLoading } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp) {
            if (isValid(formData.password, 6, 20, 2, 1, 1, 1)) {
                if (isEqual(formData.password, formData.confirmPassword))
                    dispatch(signup(formData, setError, setEmailVer));
                else
                    setError({ ...noErrors, confirmPassword: t('password_not_match') });
            } else
                setError({ ...noErrors, password: t('password_strong_error') })
        } else {
            //check if userName or email
            if (formData.email.indexOf('@') === -1 && formData.email.length) {
                formData.userName = formData.email;
                formData.email = '';
            }

            dispatch(signin(formData, navigate, setError));
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({ ...noErrors });
    }

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);

        setShowPassword(false);
        setError({ ...noErrors });
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch(googleSignIn({ result, token }, navigate, setError));
        } catch (error) {
            setError({ ...noErrors, broadcast: error.message });
        }
    }

    const googleFailure = (error) => {
        setError({ ...noErrors, broadcast: t('google_error') });
        alert(error.message);
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleEmailVer = () => {
        setEmailVer(false);

        setIsSignUp(false);
    }

    const forgotPassword = () => {
        navigate('/forgotPassword');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} >
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" ><b>{isSignUp ? t('sign_up') : t('sign_in')}</b></Typography>
                {error.broadcast.length ? (
                    <>
                        {error.broadcast.includes('{{here}}') ? (
                            <Typography variant='body1' color='secondary' style={{ marginTop: '3px' }} >
                                {error.broadcast.split('{{here}}')[0]}&nbsp;
                                <Link style={{ cursor: 'pointer' }} onClick={() => navigate('/sendEmail')}>here</Link>.
                            </Typography>
                        ) : <Typography variant='body1' color='secondary' style={{ marginTop: '3px' }} >{error.broadcast}</Typography>
                        }
                    </>
                ) : ''}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignUp && (
                            <>
                                <CustomInput name="name" label="Name" cstyle={{ borderColor: '#3256b9' }} handleChange={handleChange} autoFocus half helperText={error.name} error={error.name.length ? true : false} />
                                <CustomInput name="firstName" label={t('first_name')} handleChange={handleChange} half />
                                <CustomInput name="userName" label={t('user_name')} handleChange={handleChange} error={error.userName.length ? true : false} helperText={error.userName} />
                            </>
                        )}
                        <CustomInput name='email' label={`${t('email')}${!isSignUp ? ' / ' + t('user_name') : ''}`} handleChange={handleChange} type={isSignUp ? 'email' : 'text'} error={error.email.length ? true : false} helperText={error.email} />
                        <CustomInput name="password" label={t('password')} handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} error={error.password.length ? true : false} helperText={error.password} />
                        {isSignUp && <CustomInput name="confirmPassword" label={t('repeat_password')} handleChange={handleChange} type="password" error={error.confirmPassword.length ? true : false} helperText={error.confirmPassword} />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isLoading ? (
                            <CircularProgress size='2em' style={{ color: 'white' }} />
                        ) : (
                            <>
                                {isSignUp ? t('sign_up') : t('sign_in')}
                            </>
                        )}
                    </Button>
                    <GoogleLogin
                        clientId='308354617247-34qbsf09c2gqe6esk54l6pqbamk727h2.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">{t('google_sign_in')}</Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignUp ? t('already_account') : t('no_account')}
                            </Button>
                        </Grid>
                    </Grid>
                    {error.password.length ? (
                        <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <Typography variant='body1' color='primary' style={{ cursor: 'pointer' }} onClick={forgotPassword} >{t('forgot_password')}</Typography>
                        </Container>
                    ) : ''}
                </form>
            </Paper>
            <Dialog open={emailVer} onClose={() => { }} TransitionComponent={Transition} >
                <Container className={classes.emailVer} elevation={6} >
                    <Typography variant='h4' color='darkgreen'><b>{t('email_ver')}</b></Typography>
                    <Typography className={classes.emailVerContent} variant='h6' color='grey'>{t('email_ver_1')} <b>{formData.email}</b></Typography>
                    <Typography className={classes.emailVerContent} variant='h6' color='grey'>{t('email_ver_2')}</Typography>
                    <Typography className={classes.emailVerContent} variant='body1' color='grey'>{t('email_ver_3')}</Typography>
                    <Button style={{ marginTop: '15px' }} variant='contained' color='primary' onClick={handleEmailVer} >{t('got_it')}</Button>
                </Container>
            </Dialog>
        </Container >
    );
}

export default Auth;