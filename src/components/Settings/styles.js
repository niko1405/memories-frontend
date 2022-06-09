import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1.5),
  },
  deleteAcc: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));