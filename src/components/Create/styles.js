import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  err: {
    padding: theme.spacing(2),
    top: '50%',
    left: '25%',
    right: '25%',
    textAlign: 'center',
    position: 'fixed',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInputContainer: {
    width: '100%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginLeft: theme.spacing(1),
  },
  formButtons: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    position: 'absolute',
    bottom: 0,
    right: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'sticky',
      marginTop: theme.spacing(1.5),
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
  },
  border: {
    border: 'solid',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      borderRight: '2px solid lightgray',
    },
    paddingRight: theme.spacing(1)
  },
  imageEl: {
    maxHeight: '190px',
    maxWidth: '415px',
    marginBottom: theme.spacing(5.5),
    [theme.breakpoints.only('sm')]: {
      maxWidth: '400px',
    },
    [theme.breakpoints.only('xs')]: {
      maxWidth: '300px',
    },
  },
  remark: {
    marginBottom: theme.spacing(6), 
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
  },
  overlay2: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
  },
  title: {
    padding: '0 16px',
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardAction: {
    display: 'block',
    textAlign: 'initial',
  },
}));