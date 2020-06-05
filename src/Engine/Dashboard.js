import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import BChart from './BChart';
import PChart from './PChart';

import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://gitlab.com/isis3510_202010_team9">
        TuristApp
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: theme.spacing(50),
  },
}));

export default function Dashboard() {
  const [places, setPlaces] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [users, setUsers] = React.useState(0);
  React.useEffect(() => {
   database.collection('plans').get()
      .then(response => {
        const fetchedPlaces = [];
        const fetchedDates = [];
        response.docs.forEach(document => {
          const places = document.data().places;
          fetchedPlaces.push(places);
          const dates = document.data().createdAt;
          fetchedDates.push(dates);
        });
        setPlaces(fetchedPlaces);
        setDates(fetchedDates);
      })
      .catch(error => {
        console.error(error);
      });
      database.collection('usuarios').get()
      .then(response => {
        setUsers(response.size);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            TuristApp Analytics Engine
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Lugares más visitados */}
            <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <BChart 
                  title="¿Cuáles son los puntos turísticos más visitados en la ciudad?" 
                  data={places}
                  type="places"/>
              </Paper>
            </Grid>
            {/* Usuarios */}
            <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <PChart 
                  title="Según la app, ¿Cuántos turistas recibe Bogotá al año?" 
                  data={users}
                  type="users"/>
              </Paper>
            </Grid>
            {/* Fechas más visitadas */}
            <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <BChart 
                  title="¿Cuáles son las fechas más comunes en la que un turista viaja a Bogotá?" 
                  data={dates}
                  type="dates"/>
              </Paper>
            </Grid>
            {/* Núm. puntos turisticos por día */}
          <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <PChart 
                  title="¿Cuántos puntos turísticos logra recorrer un turista en un día?" 
                  data={places}
                  type="countPoints"/>
              </Paper>
            </Grid>
            {/* Sitios dif a puntos turisticos */}
            <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <BChart 
                  title="¿Qué tipo de sitios visita un turista cuando recorre la ciudad?" 
                  data={places}
                  type="establishments"/>
              </Paper>
            </Grid>
            {/* Horas del plan */}
            <Grid item xs={12} >
              <Paper className={fixedHeightPaper}>
                <PChart 
                  title="¿En qué horas del día planean los turistas sus rutas?" 
                  data={dates}
                  type="hours"/>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}