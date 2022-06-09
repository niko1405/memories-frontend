import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    paddingRight: theme.spacing(1),
    borderRight: '4px solid gray',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none',
      borderBottom: '4px solid gray',
    },
  },
  postSettings: {
    marginTop: theme.spacing(1), 
    display: 'flex', 
    alignItems: 'center', 
    flexDirection: 'column',
    padding: 0, 
    position: 'absolute', 
    bottom: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'sticky',
      marginBottom: theme.spacing(1),
    },
  },
  noEditProfile: {
    border: 'none',
  },
  profileAvatar: {
    border: '2px solid orange',
    cursor: 'pointer',
  },
  recommendedPosts: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  loadingPaper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentsInnerContainer: {
    marginRight: '30px',
  },
  commentsInnerContainer2: {
    marginRight: '30px',
    height: '300px',
    overflowY: 'auto',
  },
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
  },
}));