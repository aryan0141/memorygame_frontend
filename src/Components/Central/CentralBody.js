import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import GameInfo from "./GameInfo";
import FlipCard from "./Cards/FlipCard";

const ImgCards = [
  { src: "/card_images/apple.png" },
  { src: "/card_images/figures.png" },
  { src: "/card_images/fruits.png" },
  { src: "/card_images/gamepad.png" },
  { src: "/card_images/people.png" },
  { src: "/card_images/planets.png" },
];

const CentralBody = () => {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  useEffect(() => {
    if (isGameStarted) {
      const timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameStarted]);

  // Used to add basic information and to shuffle the cards
  useEffect(() => {
    // Adding a unique id and matched to each image
    const updatedCards = [...ImgCards].map((card, index) => ({
      ...card,
      imageId: index + 1,
      matched: false,
    }));
    const moreUpdated = [...updatedCards, ...updatedCards].map(
      (card, index) => ({
        ...card,
        id: index + 1,
      })
    );
    const shuffledCards = shuffleCards(moreUpdated);
    setCards([...shuffledCards]);
  }, []);

  function handleClick(card) {
    if (firstChoice) {
      setSecondChoice(card);
    } else {
      setFirstChoice(card);
    }
  }

  // Used to find a correct match
  useEffect(() => {
    if (firstChoice && secondChoice) {
      if (firstChoice.imageId === secondChoice.imageId) {
        const updatedArray = [...cards].map((card) => {
          if (card === firstChoice || card === secondChoice) {
            return { ...card, matched: true };
          } else {
            return card;
          }
        });
        setCards(updatedArray);
        setScore((score) => score + 1);
        setSecondChoice(null);
        setFirstChoice(null);
      }
      setTimeout(() => {
        setSecondChoice(null);
        setFirstChoice(null);
      }, 800);
      setMoves((m) => m + 1);
    }
  }, [firstChoice, secondChoice]);

  // Check the completion of the game
  useEffect(() => {
    setTimeout(() => {
      if (score === cards.length / 2 && score !== 0) {
        setIsGameStarted(false);
        setIsGameCompleted(true);
        alert(
          "Hurray! You have completed the game. You can now submit your score."
        );
      }
    }, 1000);
  }, [score]);

  // Shuffle the cards in random order
  function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  // Function to restart the game
  function restartGame() {
    setFirstChoice(null);
    setSecondChoice(null);
    setTime(0);
    setMoves(0);
    setIsGameStarted(false);
    setScore(0);
    setIsGameCompleted(false);
    // Mark all the classes as unmatched
    const unmatchedCards = cards.map((card) => ({ ...card, matched: false }));
    //Shuffle all the cards
    setCards([...shuffleCards(unmatchedCards)]);
  }

  // Function to start the game
  function startGame() {
    restartGame();
    // Show all cards for 5sec
    const openCards = cards.map((card) => ({ ...card, matched: true }));
    setCards(openCards);
    setTimeout(() => {
      const closeCards = cards.map((card) => ({ ...card, matched: false }));
      setCards(closeCards);
      setIsGameStarted(true);
    }, 3000);
  }

  return (
    <React.Fragment>
      <Container>
        <Grid container px={{ xs: 5, sm: 10, md: 15, lg: 35 }} spacing={1.5}>
          {cards &&
            cards.map((card) => (
              <Grid key={card.id} item xs={2} sm={12} md={3} lg={3}>
                <FlipCard
                  card={card}
                  handleClick={handleClick}
                  toFlip={
                    card === firstChoice || card === secondChoice || card.matched
                  }
                  isGameStarted={isGameStarted}
                />
              </Grid>
            ))}
        </Grid>
        <GameInfo
          restartGame={restartGame}
          startGame={startGame}
          time={time}
          moves={moves}
          score={score}
          isGameCompleted={isGameCompleted}
        />
      </Container>
    </React.Fragment>
  );
};

export default CentralBody;
