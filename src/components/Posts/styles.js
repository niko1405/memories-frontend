import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
  },
  smMargin: {
    margin: theme.spacing(1),
  },
  actionDiv: {
    textAlign: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  error: {
    backgroundColor: '#c3717b',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  noPosts: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '-20px',
    color: '#818181',
  }
}));