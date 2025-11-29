import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, RefreshCw } from 'lucide-react';

const Quiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === QUIZ_QUESTIONS[currentQ].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
        <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700 text-center max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Результат</h2>
          <div className="text-6xl font-black mb-6 text-blue-500">
            {score} <span className="text-2xl text-zinc-500 font-normal">/ {QUIZ_QUESTIONS.length}</span>
          </div>
          
          <p className="text-zinc-400 mb-8">
            {score === QUIZ_QUESTIONS.length ? "Идеально! Вы мастер указателей." : 
             score > QUIZ_QUESTIONS.length / 2 ? "Хорошо, но можно лучше." : "Стоит повторить теорию."}
          </p>

          <button 
            onClick={restart}
            className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition"
          >
            <RefreshCw size={20} /> Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="mb-8 flex justify-between items-end">
        <h2 className="text-xl text-zinc-400 font-semibold uppercase tracking-widest">Вопрос {currentQ + 1}</h2>
        <span className="text-zinc-600 font-mono">Score: {score}</span>
      </div>

      <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700 shadow-xl">
        <h3 className="text-2xl text-white font-bold mb-8">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let btnClass = "w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2 ";
            
            if (isAnswered) {
                if (idx === question.correctIndex) {
                    btnClass += "bg-green-900/40 border-green-500 text-green-100";
                } else if (idx === selectedOption) {
                    btnClass += "bg-rose-900/40 border-rose-500 text-rose-100";
                } else {
                    btnClass += "bg-zinc-700/30 border-transparent text-zinc-500";
                }
            } else {
                btnClass += "bg-zinc-700 border-transparent hover:bg-zinc-600 hover:border-blue-500 text-zinc-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isAnswered && idx === question.correctIndex && <Check size={20} />}
                    {isAnswered && idx === selectedOption && idx !== question.correctIndex && <X size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
            <div className="mt-6 pt-6 border-t border-zinc-700 animate-fade-in">
                <p className="text-zinc-300 mb-4 bg-zinc-900/50 p-3 rounded">
                    <span className="font-bold text-blue-400">Пояснение:</span> {question.explanation}
                </p>
                <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition"
                >
                    {currentQ === QUIZ_QUESTIONS.length - 1 ? "Показать результат" : "Следующий вопрос"}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
