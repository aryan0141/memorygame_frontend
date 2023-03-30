import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { makeStyles } from "@material-ui/styles";
import {BACKEND_HOST_URL} from "../../config/default"

const useStyles = makeStyles({
  infoCSS: {
    backgroundColor: "white",
    borderRadius: "7px",
    padding: "15px",
    boxShadow: "1px 3px 10px rgb(0 0 0 / 0.2)",
    margin: "10px 0px 30px 0px",
    textAlign: "center",
  },
});

const GameInfo = ({
  restartGame,
  startGame,
  moves,
  time,
  score,
  isGameCompleted,
}) => {
  const classes = useStyles();

  function handleSubmit() {
    if (!isGameCompleted) {
      alert("Complete the game first to submit!");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    fetch(`${BACKEND_HOST_URL}/leaderboard/addLeaderboard/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        time: time,
        moves: moves,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 201) {
          alert("Succesfully Submitted");
          setTimeout(() => {
            restartGame();
          }, 1000);
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <React.Fragment>
      <Box className={classes.infoCSS}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Typography variant="h5">Moves: {moves}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Typography variant="h5">Time: {time}sec</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Typography variant="h5">Score: {score}</Typography>
          </Grid>
        </Grid>
        <hr style={{ border: "1px solid #FFB400", background: "#FFB400" }}></hr>
        <Grid container spacing={2} style={{ marginTop: "-10px" }}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Button variant="contained" onClick={() => startGame()}>
              Start Game
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Button variant="contained" onClick={() => restartGame()}>
              Restart Game
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Button variant="contained" onClick={() => handleSubmit()}>
              Submit Score
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default GameInfo;
