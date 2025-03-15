import React, { useState } from "react";

const Flashcard = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="flashcard">
      <div className="question" onClick={toggleAnswer}>
        {question}
      </div>
      {showAnswer && <div className="answer">{answer}</div>}
    </div>
  );
};

export default Flashcard;
