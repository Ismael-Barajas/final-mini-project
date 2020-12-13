import React from "react";
import useSWR, { SWRConfig } from "swr";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ScrollUpButton from "react-scroll-up-button";
import "./App.css";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, fetcher }}>
      <Crimes />
    </SWRConfig>
  );
}

function Crimes() {
  const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2020-10";
  const { data, error } = useSWR(url);

  if (error) {
    return (
      <div className="loading">
        <div className="center">
          <Typography variant="h3">
            Something went wrong check the console :D
          </Typography>
          <LinearProgress color="secondary" />
          {console.log(error)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading">
        <div className="center">
          <Typography variant="h1">Loading....</Typography>
          <LinearProgress color="secondary" />
        </div>
      </div>
    );
  }

  return (
    <DisplayCrimes
      crimes={data}
      categories={[...new Set(data.map((crime) => crime.category))]}
    />
  );
}

function DisplayCrimes({ crimes, categories }) {
  const [filterCategory, setFilterCategory] = React.useState(null);
  const classes = useStyles();
  const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2020-10";

  const filteredCrimes = filterCategory
    ? crimes.filter((crime) => crime.category === filterCategory)
    : crimes;

  return (
    <Container maxWidth="xl">
      <ScrollUpButton />
      <div className="headerDiv">
        <Typography variant="h3">Street Crimes: Leicester, UK</Typography>
        <Typography variant="body1">{`Api source: ${url}`}</Typography>
      </div>
      <div
        className={classes.root}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {categories.map((category) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFilterCategory(category);
            }}
            key={category}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="resetDiv">
        {filterCategory && (
          <Button
            variant="contained"
            color="secondary"
            className="resetButton"
            onClick={() => {
              setFilterCategory(null);
            }}
          >
            reset
          </Button>
        )}
      </div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        {filteredCrimes.map((category, index) => (
          <Grid item key={index} xs={6} xl={4} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Category</Typography>
                <Typography variant="h5">
                  {category.category.toUpperCase()}
                </Typography>
                <br />
                <Typography color="textSecondary">Date</Typography>
                <Typography variant="body2" gutterBottom>
                  {category.month}
                </Typography>
                <Typography color="textSecondary">Street</Typography>
                <Typography variant="body2" gutterBottom>
                  {category.location.street.name +
                    ` [${category.location.latitude}, ${category.location.longitude}]`}
                </Typography>
                <Typography color="textSecondary">Outcome</Typography>
                {category.outcome_status ? (
                  <Typography variant="body2">
                    {category.outcome_status.category}
                  </Typography>
                ) : (
                  <Typography variant="body2">No outcome provided.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
