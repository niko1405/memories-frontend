import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  downBarContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
    display: 'flex',
    padding: 0,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
  downBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    position: 'relative',
  },
  heading: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '2em',
    fontWeight: 300,
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
  },
  navPath: {
    fontSize: '24px',
    color: 'gray',
    marginRight: '20px',
    textDecoration: 'none'
  },
  logout: {
    marginLeft: '20px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profileAvatar: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: 'gray',
    cursor: 'pointer',
    width: '45px',
    height: '45px',
  },
}));