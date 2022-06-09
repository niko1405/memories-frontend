import { Container, Paper, Typography } from '@material-ui/core';
import useStyles from './styles';

const ErrMessage = ({ maxWidth = 'lg', title = 'Something went wrong' }) => {
    const classes = useStyles();

    return (
        <Container maxWidth={maxWidth} >
            <Paper className={classes.paper} >
                <Typography variant="h6" align="center">
                    {title}
                </Typography>
            </Paper>
        </Container>
    )
}

export default ErrMessage;