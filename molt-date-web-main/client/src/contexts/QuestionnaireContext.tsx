import { createContext, useContext, useState, type ReactNode } from "react";

interface QuestionnaireState {
  answers: Record<number, string>;
  currentQuestion: number;
  isComplete: boolean;
  setAnswer: (questionId: number, optionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetQuestionnaire: () => void;
  getProgress: () => number;
}

const QuestionnaireContext = createContext<QuestionnaireState | undefined>(undefined);

const TOTAL_QUESTIONS = 66;

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const setAnswer = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < TOTAL_QUESTIONS) {
      setCurrentQuestion(index);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const resetQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestion(0);
  };

  const getProgress = () => {
    return (Object.keys(answers).length / TOTAL_QUESTIONS) * 100;
  };

  const isComplete = Object.keys(answers).length === TOTAL_QUESTIONS;

  return (
    <QuestionnaireContext.Provider
      value={{
        answers,
        currentQuestion,
        isComplete,
        setAnswer,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        resetQuestionnaire,
        getProgress,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) throw new Error("useQuestionnaire must be used within QuestionnaireProvider");
  return context;
}
