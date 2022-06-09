import { makeStyles, withStyles } from "@material-ui/core/styles";
import { deepPurple } from '@material-ui/core/colors';
import { TextField } from "@material-ui/core";

export default makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        top: '50%',
        left: '25%',
        right: '25%',
        textAlign: 'center',
        position: 'fixed',
      },
}));