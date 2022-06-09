import { ThemeProvider, createTheme, Paper, Container, Button, Grid, TextField, CircularProgress, Tooltip, IconButton } from "@material-ui/core";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { changePassword } from "../../actions/auth";
import { isValid } from "../../passwordChecker";

import ArrowBack from '@mui/icons-material/ArrowBack';

import { useTranslation } from 'react-i18next';

import useStyles from "./styles";

const emptyFormData = {
    password: '',
    confirmPassword: '',
}

const emptyRemark = {
    message: '',
    error: false,
    type: '',
}

const ChangePassword = ({ userId = undefined, onClose = undefined }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    let theme = createTheme();

    const [formData, setFormData] = useState(emptyFormData);
    const [remark, setRemark] = useState(emptyRemark);
    const [login, setLogin] = useState(false);

    const { isLoading } = useSelector(state => state.auth);
    const { darkMode } = useSelector(state => state.settings);

    const params = useParams();

    const id = params.id || userId;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        setRemark(emptyRemark);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword)
            return setRemark({ message: t('password_not_match'), error: true, type: 'confirmPassword' });

        if (!isValid(formData.password, 6, 20, 2, 1, 1, 1))
            return setRemark({ message: t('password_strong_error'), error: true, type: 'password' });

        dispatch(changePassword(id, formData.password, setRemark, setLogin));
    }

    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth='md'>
                <Paper>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {onClose ? (
                            <Container style={{ display: 'flex', alignItems: 'center' }} >
                                <Tooltip title={t('back')} ><IconButton onClick={onClose} style={{ cursor: 'pointer' }} ><ArrowBack htmlColor={darkMode ? 'white' : 'gray'} /></IconButton></Tooltip>
                                <Typography variant='h6' color='gray' ><b>{t('change_password')}</b></Typography>
                            </Container>
                        ) : (
                            <Typography variant='h5' color='primary' ><b>{t('change_password')}</b></Typography>
                        )}
                        <Typography style={{ marginTop: theme.spacing(1) }} variant='h6' color='grey' >{t('enter_new_password')}</Typography>
                        <TextField
                            style={{ marginTop: theme.spacing(2.5) }}
                            name='password'
                            onChange={handleChange}
                            variant="outlined"
                            required
                            label={t('password')}
                            autoFocus={true}
                            helperText={remark.type === 'password' ? remark.message : ''}
                            error={remark.type === 'password'}
                            type='password'
                        />
                        <TextField
                            style={{ marginTop: theme.spacing(2.5) }}
                            name='confirmPassword'
                            onChange={handleChange}
                            variant="outlined"
                            required
                            label={t('confirm_password')}
                            autoFocus={false}
                            helperText={remark.type === 'confirmPassword' ? remark.message : ''}
                            error={remark.type === 'confirmPassword'}
                            type='password'
                        />
                        {remark.type === 'broadcast' ? (
                            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(2) }}>
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
                        <Grid style={{ marginTop: theme.spacing(2) }} container justifyContent='flex-end'>
                            <Grid item>
                                {login ? (
                                    <>
                                        {!onClose ? (
                                            <Button variant='contained' color='primary' onClick={() => navigate('/auth')}>
                                                Login
                                            </Button>
                                        ) : ''}
                                    </>
                                ) : (
                                    <Button variant='contained' color='primary' type='submit'>
                                        {t('submit')}
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider >
    );
}

export default ChangePassword;