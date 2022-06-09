import { makeStyles } from '@material-ui/core/styles';

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
  notchedOutline: {
    borderRadius: "10px",
    borderColor: "gray !important",
  }
}));