
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface QuizData {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface QuizState {
  currentPoints: number;
  completedQuizzes: number[];
  totalQuizzes: number;
  quizData: QuizData[];
}

// Sample quiz data based on Citrea documentation
const QUIZ_DATA: QuizData[] = [
  {
    id: 1,
    question: "What is Citrea?",
    options: [
      "A Bitcoin wallet",
      "Bitcoin's first ZK rollup",
      "An Ethereum Layer 2",
      "A DeFi protocol"
    ],
    correctAnswer: 1,
    points: 10,
    explanation: "Citrea is Bitcoin's first ZK rollup, bringing scalability and programmability to Bitcoin."
  },
  {
    id: 2,
    question: "What virtual machine does Citrea use?",
    options: [
      "Bitcoin Script",
      "Ethereum Virtual Machine (EVM)",
      "WebAssembly (WASM)",
      "Solana Virtual Machine"
    ],
    correctAnswer: 1,
    points: 15,
    explanation: "Citrea uses the Ethereum Virtual Machine (EVM), making it compatible with Ethereum tooling and smart contracts."
  },
  {
    id: 3,
    question: "How does Citrea achieve finality?",
    options: [
      "Through Bitcoin mining",
      "Using proof-of-stake consensus",
      "By publishing ZK proofs to Bitcoin",
      "Through validator voting"
    ],
    correctAnswer: 2,
    points: 20,
    explanation: "Citrea achieves finality by publishing zero-knowledge proofs to the Bitcoin blockchain."
  },
  {
    id: 4,
    question: "What can developers build on Citrea?",
    options: [
      "Only simple payment apps",
      "Bitcoin-native applications only",
      "Full-featured DApps with smart contracts",
      "Static websites only"
    ],
    correctAnswer: 2,
    points: 15,
    explanation: "Developers can build full-featured decentralized applications with smart contracts on Citrea."
  },
  {
    id: 5,
    question: "What is the native token standard on Citrea?",
    options: [
      "BRC-20",
      "ERC-20",
      "SPL tokens",
      "Ordinals"
    ],
    correctAnswer: 1,
    points: 10,
    explanation: "Citrea supports ERC-20 tokens due to its EVM compatibility."
  }
];

export const useQuiz = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentPoints: 0,
    completedQuizzes: [],
    totalQuizzes: QUIZ_DATA.length,
    quizData: QUIZ_DATA,
  });

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('nimpad_quiz_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setQuizState(prev => ({
          ...prev,
          currentPoints: parsed.currentPoints || 0,
          completedQuizzes: parsed.completedQuizzes || [],
        }));
      } catch (error) {
        console.error('Error loading quiz progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progressData = {
      currentPoints: quizState.currentPoints,
      completedQuizzes: quizState.completedQuizzes,
    };
    localStorage.setItem('nimpad_quiz_progress', JSON.stringify(progressData));
  }, [quizState.currentPoints, quizState.completedQuizzes]);

  const completeQuiz = (quizId: number, earnedPoints: number) => {
    setQuizState(prev => {
      if (prev.completedQuizzes.includes(quizId)) {
        toast({
          title: "Quiz already completed",
          description: "You have already completed this quiz!",
          variant: "destructive",
        });
        return prev;
      }

      const newState = {
        ...prev,
        currentPoints: prev.currentPoints + earnedPoints,
        completedQuizzes: [...prev.completedQuizzes, quizId],
      };

      toast({
        title: "Quiz completed!",
        description: `You earned ${earnedPoints} points!`,
      });

      return newState;
    });
  };

  const getAvailableQuizzes = () => {
    return QUIZ_DATA.filter(quiz => !quizState.completedQuizzes.includes(quiz.id));
  };

  const getQuizById = (id: number) => {
    return QUIZ_DATA.find(quiz => quiz.id === id);
  };

  const resetProgress = () => {
    setQuizState({
      currentPoints: 0,
      completedQuizzes: [],
      totalQuizzes: QUIZ_DATA.length,
      quizData: QUIZ_DATA,
    });
    localStorage.removeItem('nimpad_quiz_progress');
    
    toast({
      title: "Progress reset",
      description: "Your quiz progress has been reset",
    });
  };

  return {
    ...quizState,
    completeQuiz,
    getAvailableQuizzes,
    getQuizById,
    resetProgress,
  };
};
