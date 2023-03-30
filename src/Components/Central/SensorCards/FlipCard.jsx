import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles({
  cardCss: {
    position: "relative",
    borderRadius: "7px",
    padding: "7px",
    boxShadow: "1px 3px 10px rgb(0 0 0 / 0.2)",
    margin: "5px 0px 5px 0px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    marginBottom: "-5px",
    borderRadius: "7px",
  },
  mainImg: {
    position: "absolute",
    transition: "all ease-in 0.2s",
    transform: "rotateY(90deg)",
    paddingRight: "6px",
  },
  backgroundImg: {
    transform: "rotateY(0deg)",
    transition: "all ease-in 0.2s",
    transitionDelay: "0.25s",
  },
});

const SensorCard = ({ card, handleClick, toFlip, isGameStarted }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.cardCss} style={isGameStarted ? {cursor: "pointer"} : {}}>
        <div
          className={classes.mainImg}
          style={
            toFlip ? { transform: "rotateY(0deg)", transitionDelay: "0s" } : {}
          }
        >
          <img className={classes.image} src={card.src} alt={card.src} />
        </div>
        <div
          className={classes.backgroundImg}
          style={
            toFlip ? { transform: "rotateY(90deg)", transitionDelay: "0s" } : {}
          }
        >
          <img
            className={classes.image}
            src="/card_images/background.png"
            alt="backgroundImg"
            onClick={() => isGameStarted ? handleClick(card): null}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default SensorCard;
