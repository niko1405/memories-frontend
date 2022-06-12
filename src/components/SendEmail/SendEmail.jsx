import { Button, CircularProgress, Container, createTheme, Grid, IconButton, Paper, TextField, ThemeProvider, Tooltip } from "@material-ui/core";
import { Typography } from "@mui/material";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useStyles from "./styles";
import { sendEmail } from "../../actions/auth";

const emptyRemark = {
    type: '',
    message: '',
}

const SendEmail = () => {
    const classes = useStyles();
    const theme = createTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState('');
    const [remark, setRemark] = useState(emptyRemark);

    const { isLoading } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(sendEmail(email, setRemark, i18n.language || 'en'));
    }

    const handleChange = (e) => {
        setEmail(e.target.value);
        setRemark(emptyRemark);
    }

    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth='md'>
                <Paper>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Container style={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'center' }} >
                            <Tooltip title={t('back')} ><IconButton onClick={() => navigate(-1)} style={{ cursor: 'pointer', position: 'absolute', left: 0 }} ><ArrowBack /></IconButton></Tooltip>
                            <Typography variant='h4' color='primary' style={{ marginLeft: theme.spacing(3) }} ><b>{t('send_email')}</b></Typography>
                        </Container>
                        <Typography style={{ marginTop: theme.spacing(2) }} variant='h6' color='grey' >{t('send_email_text')}</Typography>
                        <TextField
                            style={{ marginTop: theme.spacing(2.5) }}
                            name='email'
                            onChange={handleChange}
                            variant="outlined"
                            required
                            label={t('email')}
                            autoFocus={true}
                            type='email'
                        />
                        {isLoading ? (
                            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(2) }}>
                                <CircularProgress size='2em' />&nbsp;
                                <Typography variant='body1' color='grey' >{t('loading')}</Typography>
                            </Container>
                        ) : (
                            <>
                                {remark.type.length ? (
                                    <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(2) }}>
                                        <Typography style={{ backgroundColor: remark.type === 'error' ? '#c3717b' : '#b9eb65', padding: theme.spacing(.5) }} variant='body1' color='grey' >
                                            {remark.message}
                                        </Typography>
                                    </Container>
                                ) : ''
                                }
                            </>
                        )}
                        <Grid style={{ marginTop: theme.spacing(6) }} container justifyContent='flex-end'>
                            <Grid item>
                                {remark.type === 'successfull' ? (
                                    <Typography variant='h6' color='gray' >{t('email_ver_3')}</Typography>
                                ) : (
                                    <Button variant='contained' color='primary' type='submit'>
                                        {remark.type === 'error' ? t('try_again') : t('submit')}
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>

    );
}

export default SendEmail;