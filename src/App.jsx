import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, Heart, CheckCircle, XCircle } from 'lucide-react';

const mockQuizData = {
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    }
  ]
};

const QuizApp = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('start');
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setQuizData(mockQuizData);
    } catch (err) {
      setError("Failed to load quiz data. Please try again.");
    }
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0 && !showFeedback) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleWrongAnswer();
    }
    return () => clearInterval(interval);
  }, [gameState, timer, showFeedback]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setTimer(30);
    setError(null);
  };

  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);
    setShowFeedback(true);
    const correct = selected === quizData.questions[currentQuestion].correctAnswer;
    if (correct) {
      setScore(prev => prev + 100);
    } else {
      handleWrongAnswer();
    }
    setTimeout(() => {
      if (currentQuestion + 1 < quizData.questions.length && lives > 0) {
        setCurrentQuestion(prev => prev + 1);
        setTimer(30);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setLives(prev => prev - 1);
    if (lives <= 1) {
      setGameState('finished');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-white-500 to-yellow-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h1 className="text-4xl font-bold text-white-600 mb-6">MindQuest</h1>
            <p className="text-gray-600 mb-8">Engage, learn, and conquer the quiz world!</p>
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-pink-200 to-yellow-300 text-yellow px-8 py-3 rounded-full hover:shadow-lg transition-transform transform hover:scale-105"
            >
              Start Quiz
            </button>
          </motion.div>
        )}
        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Trophy className="text-yellow-300" />
                <span className="text-xl font-semibold">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                {[...Array(lives)].map((_, i) => (
                  <Heart key={i} className="text-red-500" fill="red" />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="text-red-800" />
                <span className="text-xl font-semibold">{timer}s</span>
              </div>
            </div>
            <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {quizData.questions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className="p-4 text-left rounded-lg border-2 border-gray-300 bg-gradient-to-r from-purple-200 to-yellow-200 hover:from-white-300 hover:to-white-300 transition-transform transform hover:scale-105"
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        {gameState === 'finished' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <h2 className="text-3xl font-bold mb-6">Quiz Complete!</h2>
            <div className="bg-gradient-to-r from-yellow-300 to-pink-200 rounded-lg p-6 mb-6">
              <p className="text-2xl font-semibold text-white-900">Final Score: {score}</p>
            </div>
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-yellow-500 to-pink-200 text-white px-8 py-3 rounded-full hover:shadow-lg transition-transform transform hover:scale-105"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
