import { Button, Container, createTheme, ThemeProvider, useMediaQuery } from "@material-ui/core";
import { Typography } from '@mui/material'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import bg from '../../images/stars.jpg';

const ErrorPage = () => {
    const navigate = useNavigate();
    const theme = createTheme();
    const smDivise = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();

    const { darkMode } = useSelector(state => state.settings);

    return (
        <ThemeProvider theme={theme}>
            <Container id="notfound">
                <Container className="notfound">
                    {darkMode ? (
                        <Container >
                            <Typography className='darkmode-header' variant='h1' color='white' style={{ fontWeight: 900, fontFamily: 'Montserrat, sans-serif', fontSize: smDivise ? '80px' : '230px' }}>Oops!</Typography>
                        </Container>
                    ) : (
                        <Container className="notfound-404">
                            <h1>Oops!</h1>
                        </Container>
                    )}
                    <Typography style={{ marginTop: '40px' }} variant="h4" color="darkred" ><strong>{t('error_404')}</strong></Typography>
                    <Typography style={{ color: '#747782' }} variant="h6"><strong>{t('error_404_message')}</strong></Typography>
                    <Container style={{ display: 'flex', padding: 0, justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing(4) }}>
                        <Button variant='outlined' color='primary' onClick={() => navigate(-1)} size='large' style={{ marginRight: theme.spacing(1) }} >{t('back')}</Button>
                        <Button variant='contained' color='primary' onClick={() => navigate('/')} size='large' >{t('go_home')}</Button>
                    </Container>
                </Container>
            </Container>
        </ThemeProvider>
    );
}

export default ErrorPage;