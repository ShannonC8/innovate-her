import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./welcome.css";
import { useUser } from "../UserContext";

const QuestionCard = ({ question, onAnswerChange, answer }) => {
  return (
    <div className="question-card">
      {question.type === "text" ? (
        <textarea
          value={answer || ""}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          placeholder="Type your answer here"
        />
      ) : (
        <div className="options">
          {question.options.map((option, idx) => (
            <label key={idx} className="option">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answer === option}
                onChange={() => onAnswerChange(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const questions = [
  { id: 1, question: "What is your age?", type: "text", options: [] },
  { id: 2, question: "What is your average energy level?", type: "multiple", options: ["Low", "Medium", "High"] },
  { id: 3, question: "What activities do you enjoy?", type: "text", options: [] },
  { id: 4, question: "How often do you exercise?", type: "multiple", options: ["Daily", "Weekly", "Rarely", "Never"] },
  { id: 5, question: "What motivates you the most?", type: "text", options: [] },
  { id: 6, question: "Do you follow a specific diet?", type: "multiple", options: ["Yes", "No"] },
  { id: 7, question: "On a scale of 1-10, how stressed are you usually?", type: "text", options: [] },
  { id: 8, question: "Do you work from home?", type: "multiple", options: ["Yes", "No"] },
  { id: 9, question: "How do you prefer to relax?", type: "text", options: [] },
  { id: 10, question: "Would you like to share any other details?", type: "text", options: [] }
];

const WelcomePage = () => {
  const { userId, userName } = useUser(); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatAnswers = () => {
    return Object.keys(answers).map(questionId => {
      const question = questions.find(q => q.id === parseInt(questionId));

      if (!question) return ""; // Skip if question is not found

      const answer = answers[questionId];
      switch (questionId) {
        case "1":
          return `Their age is ${answer}`;
        case "2":
          return `Their energy level is ${answer}`;
        case "3":
          return `They enjoy ${answer}`;
        case "4":
          return `They exercise ${answer.toLowerCase()}`;
        case "5":
          return `What motivates them is ${answer}`;
        case "6":
          return `They follow a ${answer.toLowerCase()} diet`;
        case "7":
          return `On a scale of 1-10, their stress level is ${answer}`;
        case "8":
          return `They work from home: ${answer}`;
        case "9":
          return `They prefer to relax by ${answer}`;
        case "10":
          return `They would like to share: ${answer}`;
        default:
          return "";
      }
    }).join(', ');
  };

  // useEffect to submit answers once all questions are answered
  useEffect(() => {
    if (isComplete) {
      const submitAnswers = async () => {
        const formattedAnswers = formatAnswers();

        try {
          console.log(answers)
          const response = await axios.post("http://localhost:5000/api/user-answers", {
            user_id: userId,
            answer: formattedAnswers,
          });
          console.log("Answers submitted successfully:", response.data);

          // Redirect to /todo page
          navigate("/todo");
        } catch (error) {
          console.error("Error submitting answers:", error);
        }
      };

      submitAnswers();
    }
  }, [isComplete, answers, userId, navigate]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="questionnaire-page">
      {isComplete ? (
        <div className="completion-message">
          <h2>Thank you for completing the questionnaire!</h2>
        </div>
      ) : (
        <div className="questionnaire-container">
          <h2>{currentQuestion.question}</h2>
          <QuestionCard 
            question={currentQuestion}
            onAnswerChange={handleAnswerChange} 
            answer={answers[currentQuestion.id]} 
          />
          <div className="buttons">
            <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button onClick={() => setIsComplete(true)}>Submit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;