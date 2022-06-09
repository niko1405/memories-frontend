import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    justifyContent: 'space-between',
  },
}));