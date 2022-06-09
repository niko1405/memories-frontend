import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBarSearch: {
    borderRadius: 4,
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '16px',
  },
  pagination: {
    borderRadius: 4,
    marginTop: '1rem',
    padding: '16px',
  },
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  profileAvatar: {
    backgroundColor: 'gray',
    width: '70px',
    height: '70px',
    border: '2px solid black',
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
}));