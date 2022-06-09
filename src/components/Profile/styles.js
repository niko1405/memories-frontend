import { makeStyles } from "@material-ui/core/styles";
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    profileAvatar: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: 'grey',
        width: '130px',
        height: '130px',
        border: '3px solid black',
    },
    main: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 0,
        width: '100%',
    },
    notSignIn: {
        padding: theme.spacing(2),
        top: '50%',
        left: '25%',
        right: '25%',
        textAlign: 'center',
        position: 'fixed',
    },
    stats: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    information: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'left',
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: 0,
            paddingLeft: theme.spacing(.5),
        },
    },
    posts: {
        display: 'flex', 
        flexDirection: 'column', 
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
    },
    postsGrid: {
        display: 'flex',
        marginTop: theme.spacing(2),
    },
    noEditProfile: {
        border: 'none',
    }
}));