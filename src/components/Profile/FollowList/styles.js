import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    top: {
        display: 'flex',
        alignItems: 'left',
    },
    topGrid: {
        display: 'flex',
        marginTop: theme.spacing(3)
    },
    card: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        maxWidth: 'xs'
    },
}));