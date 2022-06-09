import { Container } from "@material-ui/core";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useTranslation } from 'react-i18next';

const emptyState = {
    state: false,
    message: '',
}

const NetworkDetector = () => {
    const { t } = useTranslation();

    const [isDisconnected, setIsDisconnected] = useState(emptyState);

    useEffect(() => {
        handleConnectionChange();
        window.addEventListener('online', handleConnectionChange);
        window.addEventListener('offline', handleConnectionChange);

        return () => {
            window.removeEventListener('online', handleConnectionChange);
            window.removeEventListener('offline', handleConnectionChange);
        }
    }, []);

    const handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
            const webPing = setInterval(
                () => {
                    fetch('//google.com', {
                        mode: 'no-cors',
                    }).then(() => {
                        setIsDisconnected({ state: false, message: t('online') });
                        setTimeout(() => {
                            setIsDisconnected({ state: false, message: '' });
                        }, 2000);
                        return clearInterval(webPing);
                    }).catch(() => {
                        setIsDisconnected({ state: true, message: t('connection_lost') });
                        setTimeout(() => {
                            setIsDisconnected({ state: true, message: '' });
                        }, 2000);
                    });
                }, 2000);
            return;
        }

        if(isDisconnected.state !== true){
            setTimeout(() => {
                setIsDisconnected({ state: true, message: '' });
            }, 3000);
            return setIsDisconnected({ state: true, message: t('connection_lost') });
        }
        
    }


    return (
        <Container maxWidth='xs' style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }} >
            {isDisconnected.message.length ? (
                <>
                    {isDisconnected.state === true ? (
                        <Container style={{ backgroundColor: '#c3717b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant='h6' color='black'>{isDisconnected.message}</Typography>
                        </Container>
                    ) : (
                        <Container style={{ backgroundColor: '#63eb88', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant='h6' color='black'>{isDisconnected.message}</Typography>
                        </Container>
                    )}
                </>
            ) : ''}
        </Container>
    );
}

export default NetworkDetector;