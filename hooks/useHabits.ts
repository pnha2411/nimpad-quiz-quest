import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitTemplate, UserProgress, JournalEntry } from '@/types/habits';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEYS = {
  HABITS: 'nimpad_custom_habits',
  PROGRESS: 'nimpad_user_progress',
  TEMPLATES: 'nimpad_habit_templates'
};

// Default BTCfi habits (preserved from original)
const getDefaultBTCfiHabits = (): Habit[] => [
  {
    id: 'btcfi-1',
    title: "🔍 Market Analysis",
    subtitle: "Fundamental, Technical & On-Chain Analysis",
    description: "Master the art of reading the BTCfi market like a skilled strategist",
    icon: "🔍",
    color: "blue",
    tags: ["analysis", "research", "btcfi"],
    category: 'daily',
    difficulty: 'medium',
    streak: 0,
    maxStreak: 0,
    completed: false,
    completedDates: [],
    tasks: [
      "Check total TVL across all BTCfi protocols",
      "Analyze Bitcoin price correlation with BTCfi tokens",
      "Scan TradingView daily chart to estimate price range for liquidity positions",
      "Analyze technical charts to identify effective BTCfi tokens for investment",
      "Review on-chain metrics: active addresses, transaction volume",
      "Study institutional Bitcoin adoption trends"
    ],
    resources: [
      { title: "DeFiLlama Yield Analytics", url: "https://defillama.com/yields", type: "Analytics" },
      { title: "CoinGecko BTCfi Sector", url: "https://www.coingecko.com/en/categories/bitcoin-layer-2", type: "Data" },
      { title: "TradingView BTC Chart", url: "https://www.in.tradingview.com/chart/?symbol=BINANCE:BTCUSDT", type: "Chart Analysis" },
      { title: "TradingView CORE Chart", url: "https://www.in.tradingview.com/chart/?symbol=BINANCE:COREUSDT", type: "Chart Analysis" },
      { title: "Dune Analytics BTCfi Dashboard", url: "https://dune.com/browse/dashboards", type: "On-Chain" },
      { title: "BitcoinLayers.org", url: "https://bitcoinlayers.org/", type: "Infrastructure" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCustom: false,
    points: 50,
    journalEntries: [],
    currentCount: 0
  },
  {
    id: 'btcfi-2',
    title: "⚡ Protocol Deep Dive",
    subtitle: "Yield Analysis & Chain Performance",
    description: "Discover the most promising protocols across different chains",
    icon: "⚡",
    color: "yellow",
    tags: ["protocols", "yield", "defi"],
    category: 'daily',
    difficulty: 'hard',
    streak: 0,
    maxStreak: 0,
    completed: false,
    completedDates: [],
    tasks: [
      "Compare APY rates across major BTCfi protocols",
      "Analyze liquidity depth and trading volume",
      "Check protocol security audits and track record",
      "Review governance token tokenomics"
    ],
    resources: [
      { title: "Core Chain Explorer", url: "https://scan.coredao.org/", type: "Explorer" },
      { title: "Rootstock (RSK) DeFi", url: "https://rootstock.io/", type: "Platform" },
      { title: "BOB Network", url: "https://gobob.xyz/", type: "L2" },
      { title: "Babylon Protocol", url: "https://babylonchain.io/", type: "Staking" },
      { title: "Stacks Ecosystem", url: "https://www.stacks.co/", type: "Smart Contracts" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCustom: false,
    points: 75,
    journalEntries: [],
    currentCount: 0
  },
  {
    id: 'btcfi-3',
    title: "💰 Asset Acquisition",
    subtitle: "Step-by-Step Investment Process",
    description: "Your complete guide to acquiring BTCfi assets safely",
    icon: "💰",
    color: "green",
    tags: ["investment", "acquisition", "security"],
    category: 'daily',
    difficulty: 'medium',
    streak: 0,
    maxStreak: 0,
    completed: false,
    completedDates: [],
    tasks: [
      "Set up secure wallet (MetaMask/Rabby)",
      "Add BTCfi network configurations",
      "Acquire base assets (BTC, ETH, USDT)",
      "Bridge assets to chosen BTCfi chains",
      "Start with small test transactions"
    ],
    resources: [
      { title: "Binance BTCfi Trading", url: "https://www.binance.com/", type: "CEX" },
      { title: "Uniswap V3", url: "https://app.uniswap.org/", type: "DEX" },
      { title: "1inch Aggregator", url: "https://1inch.io/", type: "DEX Aggregator" },
      { title: "MetaMask Wallet", url: "https://metamask.io/", type: "Wallet" },
      { title: "Rabby Wallet", url: "https://rabby.io/", type: "Multi-Chain Wallet" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCustom: false,
    points: 60,
    journalEntries: [],
    currentCount: 0
  },
  {
    id: 'btcfi-4',
    title: "📊 Portfolio Monitoring",
    subtitle: "Track & Optimize Your Positions",
    description: "Keep your investments performing at their best",
    icon: "📊",
    color: "purple",
    tags: ["monitoring", "portfolio", "optimization"],
    category: 'daily',
    difficulty: 'easy',
    streak: 0,
    maxStreak: 0,
    completed: false,
    completedDates: [],
    tasks: [
      "Set up portfolio tracking dashboard",
      "Monitor yield farming rewards daily",
      "Track impermanent loss on LP positions",
      "Review and rebalance monthly",
      "Set up price alerts for major moves"
    ],
    resources: [
      { title: "DeBank Portfolio Tracker", url: "https://debank.com/", type: "Portfolio" },
      { title: "Zapper.fi", url: "https://zapper.fi/", type: "DeFi Portfolio" },
      { title: "Apeboard", url: "https://apeboard.finance/", type: "Multi-Chain" },
      { title: "CoinTracker", url: "https://www.cointracker.io/", type: "Tax Tracking" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCustom: false,
    points: 40,
    journalEntries: [],
    currentCount: 0
  }
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    badges: [],
    weeklyStreak: 0,
    monthlyStreak: 0,
    completedHabits: 0,
    totalHabits: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    
    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits);
        setHabits(parsedHabits);
      } catch {
        // Fallback to default habits
        setHabits(getDefaultBTCfiHabits());
      }
    } else {
      // First time - load default BTCfi habits
      setHabits(getDefaultBTCfiHabits());
    }

    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch {}
    }

    setLoading(false);
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    }
  }, [habits, loading]);

  // Save progress to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(userProgress));
    }
  }, [userProgress, loading]);

  const toggleHabit = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const wasCompleted = habit.completed;
      const newCompleted = !wasCompleted;
      
      let newCompletedDates = [...habit.completedDates];
      let newStreak = habit.streak;
      let pointsEarned = 0;

      if (newCompleted) {
        // Completing habit
        if (!newCompletedDates.includes(today)) {
          newCompletedDates.push(today);
          newStreak = habit.streak + 1;
          pointsEarned = habit.points;
        }
      } else {
        // Uncompleting habit
        newCompletedDates = newCompletedDates.filter(date => date !== today);
        if (habit.completedDates.includes(today)) {
          newStreak = Math.max(0, habit.streak - 1);
          pointsEarned = -habit.points;
        }
      }

      // Update user progress
      if (pointsEarned !== 0) {
        setUserProgress(prevProgress => ({
          ...prevProgress,
          totalPoints: Math.max(0, prevProgress.totalPoints + pointsEarned),
          completedHabits: newCompleted ? prevProgress.completedHabits + 1 : Math.max(0, prevProgress.completedHabits - 1)
        }));

        toast({
          title: newCompleted ? "Habit Completed! 🎉" : "Habit Unchecked",
          description: `${pointsEarned > 0 ? '+' : ''}${pointsEarned} points`,
        });
      }

      return {
        ...habit,
        completed: newCompleted,
        completedDates: newCompletedDates,
        streak: newStreak,
        maxStreak: Math.max(habit.maxStreak, newStreak),
        updatedAt: new Date().toISOString()
      };
    }));
  }, [toast]);

  const addCustomHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'streak' | 'maxStreak' | 'completedDates' | 'journalEntries'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `custom-${Date.now()}`,
      completed: false,
      streak: 0,
      maxStreak: 0,
      completedDates: [],
      journalEntries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    setHabits(prev => [...prev, newHabit]);
    setUserProgress(prev => ({
      ...prev,
      totalHabits: prev.totalHabits + 1
    }));

    toast({
      title: "New Habit Created! ✨",
      description: `"${newHabit.title}" added to your routine`,
    });

    return newHabit.id;
  }, [toast]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, ...updates, updatedAt: new Date().toISOString() }
        : habit
    ));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setUserProgress(prev => ({
      ...prev,
      totalHabits: Math.max(0, prev.totalHabits - 1)
    }));

    toast({
      title: "Habit Deleted",
      description: "Habit removed from your routine",
    });
  }, [toast]);

  const addJournalEntry = useCallback((habitId: string, entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`
    };

    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            journalEntries: [...habit.journalEntries, newEntry],
            updatedAt: new Date().toISOString()
          }
        : habit
    ));
  }, []);

  const reorderHabits = useCallback((startIndex: number, endIndex: number) => {
    setHabits(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    habits,
    userProgress,
    loading,
    toggleHabit,
    addCustomHabit,
    updateHabit,
    deleteHabit,
    addJournalEntry,
    reorderHabits
  };
};