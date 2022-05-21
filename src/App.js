import "./styles.css";
import React from "react";
import Quiz from "./components/Quiz"
import Footer from "./components/Footer";
import { nanoid } from "nanoid";
import Start from "./components/Start";
import Answer from "./components/Answer";
import { decode } from "html-entities";
// import Confetti from "react-confetti";

export default function App() {
  const [startGame, setStartGame] = React.useState();
  const [quiz, setQuiz] = React.useState([]);
  const [isFinished, setIsFinished] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [button, setButton] = React.useState();
  const [score, setScore] = React.useState();
  const [perfect, setPerfect] = React.useState(false);
  const [reset, setReset] = React.useState(false);

  React.useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=29&difficulty=easy&type=multiple"
    )
      .then((resp) => resp.json())
      .then((data) => {
        const quizData = data.results.map((item) => {
          const correctAnswer = item.correct_answer;

          const incorrectAnswers = item.incorrect_answers;
          const allAnswers = incorrectAnswers.concat(correctAnswer);

          const answerData = allAnswers.map((answer) => {
            return {
              answer: answer,
              isSelected: false,
              isCorrect: answer === item.correct_answer ? true : false,
              id: nanoid(),
              key: nanoid()
            };
          });

          return {
            question: decode(item.question),
            answers: sortAnswers(answerData),
            id: nanoid(),
            key: nanoid()
          };
        });
        // console.log(quizArray);
        setQuiz(quizData);
      });
  }, [reset]);
  // console.log(quiz);
  function sortAnswers(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }
    return array;
  }

  const allQuizData = quiz.map((item) => {
    return (
      <>
        <Quiz key={nanoid()} question={item.question} />
        <div className="choiceEl">
          {item.answers.map((answer) => {
            return (
              <Answer
                key={answer.id}
                answer={answer.answer}
                isSelected={answer.isSelected}
                select={select}
                checkAnswers={checkAnswers}
                isCorrect={answer.isCorrect}
                answerId={answer.id}
                questionId={item.id}
                isFinsished={false}
                checking={checking}
              />
            );
          })}
        </div>
      </>
    );
  });
  console.log(allQuizData);

  function generateQuiz() {
    setReset(!reset);
    setStartGame(false);
    setChecking(false);
    setPerfect(false)
    setIsFinished(false)
  }

  function start() {
    setStartGame((prevStartGame) => {
      if (!startGame) {
        setStartGame(true);
        setScore("Score: ");
        setButton("Check Score");
      } else {
      }
    });
  }

  function checkAnswers() {
    if (isFinished) {
      generateQuiz();
    } else {
      setChecking(true);
      console.log("click");
      finishGame();
    }
  }

  function select(answerId, questionId) {
    setQuiz((prevQuiz) => {
      const quizData = prevQuiz.map((prev) => {
        if (questionId === prev.id) {
          const answerData = prev.answers.map((answer) => {
            if (answerId === answer.id) {
              console.log("true");
              return {
                ...answer,
                isSelected: true
              };
            } else if (answerId !== answer.id) {
              return {
                ...answer,
                isSelected: false
              };
            }
            return answer;
          });
          return { ...prev, answers: answerData };
        } else return prev;
      });
      return quizData;
    });
  }

  function finishGame() {
    let results = 0;
    quiz.map((item) => {
      item.answers.map((answer) => {
        if (answer.isSelected && answer.isCorrect) {
          results++;
        }
        if (results === 5) {
          setPerfect(true);
        } else {
          setPerfect(false);
        }
      });
    });
    setIsFinished(true);
    setScore(`You scored ${results}/5 answers correct`);
    setButton("Play Again");
  }

  return (
    <main>
      <div>
        {!startGame ? (
          <Start start={start} />
        ) : (
          <div className="quizEl">
            {/* {checking && perfect ? <Confetti /> : ""} */}
            {allQuizData}


            <Footer score={score} button={button} checkAnswers={checkAnswers} />
          </div>
        )}
      </div>
    </main>
  );
}
