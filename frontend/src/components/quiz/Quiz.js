import React, { useState } from "react";


function Quiz({quizs}) {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);


  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizs.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <>
      {quizs.length !== 0 ?
       <div className="quiz col-md-8">

      <h2>Điểm số: {score}</h2>

      {showResults ? (
        /* 4. Final Results */
        <div className="final-results">
          <h1>Kết quả cuối cùng</h1>
          <h2>
            Đúng {score} trên {quizs.length}  - (
            {(score / quizs.length) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Lạm lại</button>
        </div>
      ) : (
        /* 5. Question Card  */
        <div className="question-card">
          {/* Current Question  */}
          <h2>
            Câu hỏi: {currentQuestion + 1} trên {quizs.length}
          </h2>
          <div className="card text-success p-2">{quizs[currentQuestion].question}</div>

          {/* List of possible answers  */}
          <ul>
            {quizs[currentQuestion].choice.map((option) => {
              return (
                <li
                  key={option._id}
                  onClick={() => optionClicked(option.isCorrect)}
                >
                  {option.body}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    :
    <div className="quiz col-md-8">
      Chưa có bài tập
    </div>
    } 
    </>
 
  );
}

export default Quiz;