/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  DAILY_QUIZ_QUESTIONS, 
  PP_IRREGULARS, 
  PP_REGULARS, 
  FUT_IRREGULARS, 
  FUT_REGULARS, 
  FUTURE_TRIVIA_QUESTIONS,
  QuizQuestion,
  FutureTriviaQuestion,
  IrregularVerb
} from "./data";
import { 
  Trophy, 
  Gamepad2, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  User, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Gift, 
  HelpCircle,
  Gem,
  Coins,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// AVATARS for 2-Player Setup
const AVATARS = [
  { char: "🔥", label: "Կրակ" },
  { char: "💧", label: "Ջուր" },
  { char: "⚡", label: "Կայծակ" },
  { char: "👑", label: "Թագավոր" },
  { char: "⭐", label: "Աստղ" },
  { char: "💖", label: "Սիրտ" },
  { char: "🥷", label: "Նինջա" },
  { char: "👻", label: "Ուրվական" }
];

const COLORS = [
  { name: "Կարմիր", hex: "#ef4444", bg: "bg-red-500", text: "text-red-500" },
  { name: "Կապույտ", hex: "#3b82f6", bg: "bg-blue-500", text: "text-blue-500" },
  { name: "Մանուշակագույն", hex: "#a855f7", bg: "bg-purple-500", text: "text-purple-500" },
  { name: "Նարնջագույն", hex: "#f97316", bg: "bg-orange-500", text: "text-orange-500" },
  { name: "Կանաչ", hex: "#22c55e", bg: "bg-green-500", text: "text-green-500" },
  { name: "Դեղին", hex: "#eab308", bg: "bg-yellow-500", text: "text-yellow-500" }
];

interface Player {
  name: string;
  avatar: string;
  color: typeof COLORS[0];
  score: number;
  frozenUntil: number; // for temporary lockouts on wrong answer
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"quiz" | "arena">("quiz");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // sound player
  const playSound = (type: "correct" | "wrong" | "victory" | "click" | "chest") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "victory") {
        const playFreq = (freq: number, start: number, duration: number) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, ctx.currentTime + start);
          g.connect(ctx.destination);
          o.connect(g);
          g.gain.setValueAtTime(0.08, ctx.currentTime + start);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
          o.start(ctx.currentTime + start);
          o.stop(ctx.currentTime + start + duration);
        };
        playFreq(261.63, 0, 0.15); // C4
        playFreq(329.63, 0.15, 0.15); // E4
        playFreq(392.00, 0.3, 0.15); // G4
        playFreq(523.25, 0.45, 0.5); // C5
      } else if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "chest") {
        for (let i = 0; i < 8; i++) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(500 + i * 140, ctx.currentTime + i * 0.07);
          g.connect(ctx.destination);
          o.connect(g);
          g.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.18);
          o.start(ctx.currentTime + i * 0.07);
          o.stop(ctx.currentTime + i * 0.07 + 0.18);
        }
      }
    } catch (e) {
      // Audio context blocked
    }
  };

  // ==========================================
  // STATE 1: DAILY SPANISH QUIZ (SINGLE PLAYER)
  // ==========================================
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizAns, setSelectedQuizAns] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<{questionIdx: number, selected: string, isCorrect: boolean}[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Shuffle options of questions once on load
    const prepared = DAILY_QUIZ_QUESTIONS.map(q => {
      // shuffle options but keep references intact
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options: shuffled };
    });
    setQuizQuestions(prepared);
  }, []);

  const handleQuizAnswer = (option: string) => {
    if (selectedQuizAns !== null) return; // already answered
    setSelectedQuizAns(option);
    
    const currentQ = quizQuestions[currentQuizIdx];
    const isCorrect = option === currentQ.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playSound("correct");
    } else {
      playSound("wrong");
    }

    setQuizHistory(prev => [...prev, {
      questionIdx: currentQuizIdx,
      selected: option,
      isCorrect
    }]);
  };

  const nextQuizQuestion = () => {
    playSound("click");
    if (currentQuizIdx + 1 < quizQuestions.length) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedQuizAns(null);
    } else {
      setQuizCompleted(true);
      playSound("victory");
    }
  };

  const restartQuiz = () => {
    playSound("click");
    // Reshuffle questions
    const prepared = [...DAILY_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).map(q => {
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options: shuffled };
    });
    setQuizQuestions(prepared);
    setCurrentQuizIdx(0);
    setSelectedQuizAns(null);
    setQuizScore(0);
    setQuizHistory([]);
    setQuizCompleted(false);
  };


  // ==========================================
  // STATE 2: 2-PLAYER DUEL ARENA
  // ==========================================
  const [setupPhase, setSetupPhase] = useState(true);
  const [arenaGameMode, setArenaGameMode] = useState<"setup" | "menu" | "futuro" | "pp_hunt" | "fut_hunt" | "finished">("setup");
  
  const [player1, setPlayer1] = useState<Player>({
    name: "Խաղացող 1",
    avatar: "🔥",
    color: COLORS[0],
    score: 0,
    frozenUntil: 0
  });

  const [player2, setPlayer2] = useState<Player>({
    name: "Խաղացող 2",
    avatar: "💧",
    color: COLORS[1],
    score: 0,
    frozenUntil: 0
  });

  // Duel State variables
  const [currentDuelQIdx, setCurrentDuelQIdx] = useState(0);
  const [duelQuestions, setDuelQuestions] = useState<FutureTriviaQuestion[]>([]);
  const [duelWinner, setDuelWinner] = useState<"p1" | "p2" | null>(null);
  
  // Hunt State variables
  interface GridWord {
    id: number;
    word: string;
    origInfinitive: string;
    isIrregular: boolean;
    clickedByP1: boolean;
    clickedByP2: boolean;
    meaning: string;
    participioForm?: string;
  }
  const [p1Grid, setP1Grid] = useState<GridWord[]>([]);
  const [p2Grid, setP2Grid] = useState<GridWord[]>([]);
  
  // Chest State variables
  const [prizeUnlocked, setPrizeUnlocked] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [chestBurst, setChestBurst] = useState<string[]>([]);
  const [showPrizeCard, setShowPrizeCard] = useState(false);

  // Init the Future Speed Trivia
  const startFutureTriviaDuel = () => {
    playSound("click");
    // select 10 random questions
    const shuffled = [...FUTURE_TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setDuelQuestions(shuffled.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    })));
    setCurrentDuelQIdx(0);
    setPlayer1(prev => ({ ...prev, score: 0, frozenUntil: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0, frozenUntil: 0 }));
    setArenaGameMode("futuro");
  };

  // Click handler for Future Trivia duel
  const handleFutureDuelAnswer = (playerKey: "p1" | "p2", selectedOption: string) => {
    const p = playerKey === "p1" ? player1 : player2;
    const now = Date.now();
    if (now < p.frozenUntil) return; // frozen

    const currentQ = duelQuestions[currentDuelQIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      playSound("correct");
      // Give point to correct player
      if (playerKey === "p1") {
        setPlayer1(prev => {
          const nextScore = prev.score + 1;
          if (nextScore >= 5) triggerDuelEnd("p1");
          return { ...prev, score: nextScore };
        });
      } else {
        setPlayer2(prev => {
          const nextScore = prev.score + 1;
          if (nextScore >= 5) triggerDuelEnd("p2");
          return { ...prev, score: nextScore };
        });
      }

      // Automatically transition to next question after a brief celebration delay
      setTimeout(() => {
        if (currentDuelQIdx + 1 < duelQuestions.length) {
          setCurrentDuelQIdx(prev => prev + 1);
        } else {
          // If questions run out, the one with higher score wins
          const p1Final = player1.score + (playerKey === "p1" ? 1 : 0);
          const p2Final = player2.score + (playerKey === "p2" ? 1 : 0);
          triggerDuelEnd(p1Final >= p2Final ? "p1" : "p2");
        }
      }, 1000);

    } else {
      playSound("wrong");
      // Deduct 1 point (min 0) and freeze player for 1.5 seconds
      if (playerKey === "p1") {
        setPlayer1(prev => ({ 
          ...prev, 
          score: Math.max(0, prev.score - 1), 
          frozenUntil: Date.now() + 1500 
        }));
      } else {
        setPlayer2(prev => ({ 
          ...prev, 
          score: Math.max(0, prev.score - 1), 
          frozenUntil: Date.now() + 1500 
        }));
      }
    }
  };

  const triggerDuelEnd = (winner: "p1" | "p2") => {
    setDuelWinner(winner);
    setArenaGameMode("finished");
    setPrizeUnlocked(true);
    setChestOpened(false);
    setShowPrizeCard(false);
    playSound("victory");
  };

  // Init exception hunt (Pretérito Perfecto or Futuro Simple)
  const startExceptionHunt = (mode: "pp" | "fut") => {
    playSound("click");
    
    // Create random layout of words
    // We want 6 irregulars and 10 regulars randomly placed
    const buildGrid = (): GridWord[] => {
      const irregularsPool = mode === "pp" ? PP_IRREGULARS : FUT_IRREGULARS;
      const regularsPool = mode === "pp" ? PP_REGULARS : FUT_REGULARS;
      
      const selectedIrr = [...irregularsPool].sort(() => Math.random() - 0.5).slice(0, 6);
      const selectedReg = [...regularsPool].sort(() => Math.random() - 0.5).slice(0, 8);

      const combined = [
        ...selectedIrr.map((item, idx) => ({
          id: idx,
          word: mode === "pp" ? item.infinitivo : item.irregularForm,
          origInfinitive: item.infinitivo,
          isIrregular: true,
          clickedByP1: false,
          clickedByP2: false,
          meaning: item.description,
          participioForm: item.irregularForm
        })),
        ...selectedReg.map((item, idx) => ({
          id: idx + 100,
          word: mode === "pp" ? item.infinitivo : item.regularForm,
          origInfinitive: item.infinitivo,
          isIrregular: false,
          clickedByP1: false,
          clickedByP2: false,
          meaning: mode === "pp" ? "Կանոնավոր ձև (regular)" : "Կանոնավոր ձև (regular)",
          participioForm: item.regularForm
        }))
      ];

      return combined.sort(() => Math.random() - 0.5);
    };

    setP1Grid(buildGrid());
    setP2Grid(buildGrid());
    setPlayer1(prev => ({ ...prev, score: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0 }));
    
    setArenaGameMode(mode === "pp" ? "pp_hunt" : "fut_hunt");
  };

  const handleHuntWordClick = (playerKey: "p1" | "p2", wordId: number) => {
    if (playerKey === "p1") {
      const target = p1Grid.find(w => w.id === wordId);
      if (!target || target.clickedByP1) return;

      setP1Grid(prev => prev.map(w => w.id === wordId ? { ...w, clickedByP1: true } : w));
      
      if (target.isIrregular) {
        playSound("correct");
        setPlayer1(prev => ({ ...prev, score: prev.score + 10 }));
        
        // Check if player 1 got all irregulars
        // remaining irregulars on P1 grid
        const updatedGrid = p1Grid.map(w => w.id === wordId ? { ...w, clickedByP1: true } : w);
        const remainingIrr = updatedGrid.filter(w => w.isIrregular && !w.clickedByP1).length;
        if (remainingIrr === 0) {
          setTimeout(() => triggerDuelEnd("p1"), 600);
        }
      } else {
        playSound("wrong");
        setPlayer1(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
      }
    } else {
      const target = p2Grid.find(w => w.id === wordId);
      if (!target || target.clickedByP2) return;

      setP2Grid(prev => prev.map(w => w.id === wordId ? { ...w, clickedByP2: true } : w));
      
      if (target.isIrregular) {
        playSound("correct");
        setPlayer2(prev => ({ ...prev, score: prev.score + 10 }));
        
        // Check if player 2 got all irregulars
        const updatedGrid = p2Grid.map(w => w.id === wordId ? { ...w, clickedByP2: true } : w);
        const remainingIrr = updatedGrid.filter(w => w.isIrregular && !w.clickedByP2).length;
        if (remainingIrr === 0) {
          setTimeout(() => triggerDuelEnd("p2"), 600);
        }
      } else {
        playSound("wrong");
        setPlayer2(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
      }
    }
  };

  const openTreasureChest = () => {
    if (chestOpened) return;
    playSound("chest");
    setChestOpened(true);
    
    // Generate beautiful coin burst emitters
    const emojis = ["🪙", "✨", "💎", "👑", "💰", "🌈", "🔥", "⚡"];
    const burst: string[] = [];
    for (let i = 0; i < 40; i++) {
      burst.push(emojis[Math.floor(Math.random() * emojis.length)]);
    }
    setChestBurst(burst);

    setTimeout(() => {
      setShowPrizeCard(true);
    }, 1200);
  };

  const getWinnerInfo = () => {
    return duelWinner === "p1" ? player1 : player2;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] flex flex-col font-sans selection:bg-[#DE212C] selection:text-white">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-250 sticky top-0 z-50 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇪🇸</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-[#DE212C] flex items-center gap-2">
                Español <span className="shimmer-text">Ինտերակտիվ</span>
              </h1>
              <p className="text-xs text-gray-500 font-semibold">Իսպաներենի վիկտորինա և 2-խաղացողների մենամարտեր</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Primary tabs */}
            <div className="bg-gray-100 p-1 rounded-xl border border-gray-200 flex w-full sm:w-auto shadow-inner">
              <button 
                id="tab-quiz-btn"
                onClick={() => { playSound("click"); setActiveTab("quiz"); }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "quiz" 
                    ? "bg-[#DE212C] text-white shadow-md shadow-red-900/25" 
                    : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Վիկտորինա
              </button>
              
              <button 
                id="tab-arena-btn"
                onClick={() => { playSound("click"); setActiveTab("arena"); }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "arena" 
                    ? "bg-[#DE212C] text-white shadow-md shadow-red-900/25" 
                    : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                Արենա (2-Player)
              </button>
            </div>

            {/* Sound Toggler */}
            <button
              id="sound-toggle-btn"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                // Trigger quick click to demonstrate new state
                if(!soundEnabled) {
                  setTimeout(() => playSound("click"), 50);
                }
              }}
              title={soundEnabled ? "Անջատել ձայնը" : "Միացնել ձայնը"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? "bg-white border-gray-300 text-[#DE212C] hover:bg-gray-50 shadow-xs" 
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        
        {/* TAB 1: DAILY SPANISH QUIZ */}
        {activeTab === "quiz" && (
          <div className="w-full max-w-2xl mx-auto">
            
            {!quizCompleted && quizQuestions.length > 0 && (
              <div className="space-y-6">
                
                {/* Score & Progress Tracker */}
                <div className="bg-white border border-gray-250 rounded-[20px] p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#DE212C] font-extrabold bg-[#DE212C]/10 px-2.5 py-1 rounded-lg text-sm">
                      Հարց {currentQuizIdx + 1} / {quizQuestions.length}
                    </span>
                  </div>
                  
                  {/* Visual Progress bar */}
                  <div className="flex-1 mx-4 bg-gray-100 h-2.5 rounded-full overflow-hidden hidden sm:block border border-gray-200/50">
                    <div 
                      className="bg-[#DE212C] h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-gray-700 font-semibold text-sm">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Միավոր՝ <span className="text-gray-900 font-extrabold text-lg">{quizScore}</span></span>
                  </div>
                </div>

                {/* Animated Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuizIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white border border-gray-250 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden"
                  >
                    {/* Background light glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#DE212C]/5 blur-3xl rounded-full" />

                    <div className="relative space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold tracking-wider text-[#DE212C] bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase">
                          Español cotidiano
                        </span>
                        <div className="text-2xl">
                          {quizQuestions[currentQuizIdx].questionArm.includes("🌊") ? "🏖️" : "💬"}
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-gray-900 leading-relaxed">
                        {quizQuestions[currentQuizIdx].questionArm}
                      </h3>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3 relative">
                      {quizQuestions[currentQuizIdx].options.map((option, idx) => {
                        const isSelected = selectedQuizAns === option;
                        const isCorrect = option === quizQuestions[currentQuizIdx].correctAnswer;
                        const hasAnswered = selectedQuizAns !== null;
                        
                        let btnStyle = "bg-[#F9FAFB] hover:bg-white border-gray-250 hover:border-gray-350 text-gray-800 shadow-2xs";
                        if (hasAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 border-[#10B981] text-emerald-950 font-bold shadow-xs";
                          } else if (isSelected) {
                            btnStyle = "bg-red-50 border-[#DE212C] text-red-950 font-bold shadow-xs";
                          } else {
                            btnStyle = "bg-gray-50 opacity-45 border-gray-200 text-gray-400 pointer-events-none";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            id={`option-${idx}`}
                            onClick={() => handleQuizAnswer(option)}
                            disabled={hasAnswered}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm sm:text-base transition-all duration-200 cursor-pointer ${btnStyle}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                                hasAnswered && isCorrect ? "bg-[#10B981] text-white" : hasAnswered && isSelected ? "bg-[#DE212C] text-white" : "bg-gray-100 border border-gray-200 text-gray-500"
                              }`}>
                                {idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                              </span>
                              {option}
                            </span>

                            {hasAnswered && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                            )}
                            {hasAnswered && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-[#DE212C] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanative block */}
                    {selectedQuizAns !== null && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-sm space-y-2"
                      >
                        <div className="flex items-center gap-2 text-amber-700 font-bold">
                          <Info className="w-4 h-4 text-amber-600" />
                          <span>Բացատրություն (Explicación)</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">
                          {quizQuestions[currentQuizIdx].explanation}
                        </p>
                      </motion.div>
                    )}

                    {/* Next Button */}
                    {selectedQuizAns !== null && (
                      <div className="flex justify-end pt-2">
                        <button
                          id="next-quiz-btn"
                          onClick={nextQuizQuestion}
                          className="flex items-center gap-2 bg-[#DE212C] hover:bg-[#DE212C]/90 text-white font-extrabold px-6 py-3 rounded-xl shadow-xs transition-all duration-200 group cursor-pointer"
                        >
                          {currentQuizIdx + 1 === quizQuestions.length ? "Ավարտել Վիկտորինան" : "Հաջորդ հարցը"}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>

              </div>
            )}

            {/* QUIZ COMPLETED VIEW */}
            {quizCompleted && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-gray-250 rounded-[20px] p-6 sm:p-8 text-center space-y-6 shadow-xs relative overflow-hidden"
              >
                {/* Background light glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#DE212C]/5 blur-3xl rounded-full" />

                <div className="relative space-y-4">
                  <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
                    <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900">
                    Վիկտորինան ավարտվե՛ց:
                  </h2>
                  
                  <p className="text-gray-500 text-sm max-w-md mx-auto font-medium">
                    Շնորհավորում ենք սովորելու և վիկտորինան ավարտելու առթիվ: Ահա ձեր արդյունքը.
                  </p>
                </div>

                {/* Score badge */}
                <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-6 max-w-xs mx-auto space-y-2">
                  <div className="text-gray-400 text-xs uppercase tracking-widest font-bold font-mono">
                    Ճիշտ արդյունքներ
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-gray-900">
                    {quizScore} <span className="text-gray-400 text-2xl font-normal">/ {quizQuestions.length}</span>
                  </div>
                  <div className="text-[#DE212C] font-extrabold text-sm">
                    {quizScore === 20 ? "🏅 Իսպաներենի Փորձագետ! 👑" : 
                     quizScore >= 15 ? "🥈 Հիանալի է! 🌟" : 
                     quizScore >= 10 ? "🥉 Լավ է, բայց կարող ես ավելին!" : 
                     "📖 Շարունակիր սովորել և կհաջողես:"}
                  </div>
                </div>

                {/* Question review accordion / list */}
                <div className="text-left max-h-60 overflow-y-auto space-y-2 bg-gray-50 p-4 rounded-[16px] border border-gray-200 scrollbar-thin">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Հարցերի վերլուծություն</h4>
                  {quizQuestions.map((q, idx) => {
                    const h = quizHistory[idx];
                    const isCorrect = h ? h.isCorrect : false;
                    return (
                      <div key={idx} className="flex gap-2 text-xs border-b border-gray-150 pb-2 last:border-b-0 last:pb-0">
                        {isCorrect ? (
                          <div className="text-emerald-500 shrink-0 font-bold text-sm">✔</div>
                        ) : (
                          <div className="text-red-500 shrink-0 font-bold text-sm">✘</div>
                        )}
                        <div>
                          <p className="text-gray-800 font-semibold">{q.questionArm}</p>
                          <p className="text-gray-400 mt-0.5">
                            Ճիշտ պատասխանը՝ <span className="text-emerald-600 font-bold">{q.correctAnswer}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom interactive row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    id="restart-quiz-btn"
                    onClick={restartQuiz}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-xl border border-gray-300 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Կրկնել Վիկտորինան
                  </button>
                  <button
                    id="goto-arena-btn"
                    onClick={() => { playSound("click"); setActiveTab("arena"); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#DE212C] hover:bg-[#DE212C]/90 text-white font-extrabold px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Խաղալ 2-Խաղացողով
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* TAB 2: 2-PLAYER DUEL ARENA */}
        {activeTab === "arena" && (
          <div className="w-full">
            
            {/* STAGE 1: SETUP PLAYERS */}
            {arenaGameMode === "setup" && (
              <div className="max-w-2xl mx-auto bg-white border border-gray-250 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#DE212C]/5 blur-3xl rounded-full" />
                
                <div className="text-center space-y-2 relative">
                  <div className="inline-flex p-3 bg-red-50 border border-red-150 rounded-2xl text-[#DE212C] shadow-3xs">
                    <Users className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900">2-Խաղացողների Արենա (Duel)</h2>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto font-medium">
                    Մրցե՛ք ձեր ընկերների հետ: Հաղթողը կբացի մեծ ՕԳՄՈՒԹՅԱՆ ոսկե սունդուկը և կստանա մրցանակ: 🗝️📦
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  
                  {/* Player 1 Card config */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 shadow-3xs">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-3xs" />
                      <span className="font-extrabold text-xs text-gray-400 tracking-wider">ԽԱՂԱՑՈՂ 1</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Անուն</label>
                        <input
                          id="p1-name-input"
                          type="text"
                          maxLength={12}
                          value={player1.name}
                          onChange={(e) => setPlayer1({ ...player1, name: e.target.value || "Խաղացող 1" })}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#DE212C] focus:ring-1 focus:ring-[#DE212C] font-semibold transition"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Ավատար</label>
                        <div className="grid grid-cols-4 gap-2">
                          {AVATARS.map((av, idx) => (
                            <button
                              key={idx}
                              id={`p1-av-${idx}`}
                              onClick={() => { playSound("click"); setPlayer1({ ...player1, avatar: av.char }); }}
                              className={`text-xl p-2 rounded-xl transition cursor-pointer ${
                                player1.avatar === av.char 
                                  ? "bg-red-50 border-2 border-[#DE212C] shadow-xs scale-105" 
                                  : "bg-white border border-gray-200 hover:bg-gray-100 shadow-3xs"
                              }`}
                            >
                              {av.char}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Գույն</label>
                        <div className="flex flex-wrap gap-1.5">
                          {COLORS.map((c, idx) => (
                            <button
                              key={idx}
                              id={`p1-col-${idx}`}
                              onClick={() => { playSound("click"); setPlayer1({ ...player1, color: c }); }}
                              className={`w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition ${c.bg} ${
                                player1.color.name === c.name ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-white scale-110" : "opacity-60"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Card config */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 shadow-3xs">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-3xs" />
                      <span className="font-extrabold text-xs text-gray-400 tracking-wider">ԽԱՂԱՑՈՂ 2</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Անուն</label>
                        <input
                          id="p2-name-input"
                          type="text"
                          maxLength={12}
                          value={player2.name}
                          onChange={(e) => setPlayer2({ ...player2, name: e.target.value || "Խաղացող 2" })}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold transition"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Ավատար</label>
                        <div className="grid grid-cols-4 gap-2">
                          {AVATARS.map((av, idx) => (
                            <button
                              key={idx}
                              id={`p2-av-${idx}`}
                              onClick={() => { playSound("click"); setPlayer2({ ...player2, avatar: av.char }); }}
                              className={`text-xl p-2 rounded-xl transition cursor-pointer ${
                                player2.avatar === av.char 
                                  ? "bg-blue-50 border-2 border-blue-500 shadow-xs scale-105" 
                                  : "bg-white border border-gray-200 hover:bg-gray-100 shadow-3xs"
                              }`}
                            >
                              {av.char}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Գույն</label>
                        <div className="flex flex-wrap gap-1.5">
                          {COLORS.map((c, idx) => (
                            <button
                              key={idx}
                              id={`p2-col-${idx}`}
                              onClick={() => { playSound("click"); setPlayer2({ ...player2, color: c }); }}
                              className={`w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition ${c.bg} ${
                                player2.color.name === c.name ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-white scale-110" : "opacity-60"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    id="start-arena-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("menu"); }}
                    className="flex items-center gap-2 bg-[#DE212C] hover:bg-[#DE212C]/90 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-sm transition cursor-pointer text-sm sm:text-base"
                  >
                    Շարունակել դեպի խաղի ընտրություն
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: ARENA GAMES SELECTION */}
            {arenaGameMode === "menu" && (
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Lobby header */}
                <div className="bg-white border border-gray-250 p-5 rounded-[20px] flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 text-2xl bg-gray-50 p-2.5 rounded-xl border border-gray-200 shadow-3xs">
                      <span>{player1.avatar}</span>
                      <span>{player2.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                        <span style={{ color: player1.color.hex }}>{player1.name}</span>
                        <span className="text-gray-400 font-bold">VS</span>
                        <span style={{ color: player2.color.hex }}>{player2.name}</span>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">Պատրաստվե՛ք լարված մենամարտի</p>
                    </div>
                  </div>
                  <button
                    id="back-to-setup-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("setup"); }}
                    className="text-xs font-bold text-[#DE212C] bg-red-50 px-3 py-1.5 rounded-lg border border-red-150 hover:bg-red-100/80 transition cursor-pointer animate-fade-in"
                  >
                    Փոխել անունները / Ավատարները
                  </button>
                </div>

                {/* Game mode selection cards */}
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-2">Մենամարտի Տեսակները</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* GAME 1: FUTURE TRIVIA */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-250 p-6 rounded-[20px] flex flex-col justify-between space-y-4 hover:border-gray-350 transition duration-200 relative overflow-hidden shadow-3xs"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#DE212C]/5 rotate-45 transform translate-x-6 -translate-y-6 rounded-full" />
                    
                    <div className="space-y-2">
                      <div className="text-2xl">⚡</div>
                      <h4 className="text-lg font-bold font-display text-gray-900">Ապառնի Ժամանակի Մարտ</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Արագության և գիտելիքի դուել: Թեմաներն են՝ <span className="text-[#DE212C] font-semibold">Futuro Simple</span> և <span className="text-indigo-600 font-semibold">Futuro Perfecto</span>:
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-6xs space-y-1 text-gray-700">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-gray-500">🏁 Նպատակը՝</span>
                        <span className="text-gray-900 font-extrabold">5 Միավոր</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">Առաջինը ճիշտ պատասխանողը ստանում է +1 միավոր: Սխալ պատասխանը սառեցնում է դուելը:</p>
                    </div>

                    <button
                      id="play-game1-btn"
                      onClick={startFutureTriviaDuel}
                      className="w-full bg-[#DE212C] hover:bg-[#DE212C]/90 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer"
                    >
                      Խաղալ հիմա
                    </button>
                  </motion.div>

                  {/* GAME 2: PP HUNT */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-250 p-6 rounded-[20px] flex flex-col justify-between space-y-4 hover:border-gray-350 transition duration-200 relative overflow-hidden shadow-3xs"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rotate-45 transform translate-x-6 -translate-y-6 rounded-full" />
                    
                    <div className="space-y-2">
                      <div className="text-2xl">🔍</div>
                      <h4 className="text-lg font-bold font-display text-gray-900">Անկանոն Մասնիկների Դաշտ</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Ընտրե՛ք այն բայերը, որոնք <span className="text-emerald-600 font-semibold">Pretérito Perfecto</span>-ում ունեն անկանոն մասնիկներ (Participio irregular):
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-6xs space-y-1 text-gray-700">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-gray-500">🏁 Նպատակը՝</span>
                        <span className="text-gray-900 font-extrabold">Գտնել բոլորը</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">Ճիշտ անկանոն բայն ընտրելիս ստանում եք +10 միավոր: Սխալ (կանոնավոր) բայի դեպքում տուգանվում եք -5 միավորով:</p>
                    </div>

                    <button
                      id="play-game2-btn"
                      onClick={() => startExceptionHunt("pp")}
                      className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer"
                    >
                      Խաղալ հիմա
                    </button>
                  </motion.div>

                  {/* GAME 3: FUT HUNT */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-250 p-6 rounded-[20px] flex flex-col justify-between space-y-4 hover:border-gray-350 transition duration-200 relative overflow-hidden shadow-3xs"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rotate-45 transform translate-x-6 -translate-y-6 rounded-full" />
                    
                    <div className="space-y-2">
                      <div className="text-2xl">🏹</div>
                      <h4 className="text-lg font-bold font-display text-gray-900">Ապառնիի Անկանոն Հիմքեր</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Արագ գտեք <span className="text-blue-600 font-semibold">Futuro Simple-ի</span> անկանոն հիմքերը (Futuro stem: dir-, har-, querr- ...) տրված բոլոր տարբերակներից:
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-6xs space-y-1 text-gray-700">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-gray-500">🏁 Նպատակը՝</span>
                        <span className="text-gray-900 font-extrabold">Գտնել բոլորը</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">Անկանոն հիմք ընտրելիս ստանում եք +10 միավոր, կանոնավոր ձևերի դեպքում տուգանվում եք -5-ով:</p>
                    </div>

                    <button
                      id="play-game3-btn"
                      onClick={() => startExceptionHunt("fut")}
                      className="w-full bg-blue-600 hover:bg-blue-550 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer"
                    >
                      Խաղալ հիմա
                    </button>
                  </motion.div>

                </div>
              </div>
            )}

            {/* GAMEPLAY 1: FUTURE SPEED DUEL */}
            {arenaGameMode === "futuro" && duelQuestions.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-6 text-gray-900">
                
                {/* Score panel split view */}
                <div className="grid grid-cols-2 gap-4">
                  {/* P1 Score board */}
                  <div 
                    className="p-4 rounded-[20px] border text-center relative transition shadow-3xs bg-white"
                    style={{ 
                      borderColor: player1.color.hex, 
                      backgroundColor: `${player1.color.hex}08` 
                    }}
                  >
                    <div className="text-2xl mb-1">{player1.avatar}</div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-gray-500 truncate" style={{ color: player1.color.hex }}>{player1.name}</h5>
                    <div className="text-3xl font-black text-gray-900 mt-1">{player1.score}</div>
                    {Date.now() < player1.frozenUntil && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center">
                        <span className="text-xs text-[#DE212C] font-extrabold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Սառեցված է
                        </span>
                      </div>
                    )}
                  </div>

                  {/* P2 Score board */}
                  <div 
                    className="p-4 rounded-[20px] border text-center relative transition shadow-3xs bg-white"
                    style={{ 
                      borderColor: player2.color.hex, 
                      backgroundColor: `${player2.color.hex}08` 
                    }}
                  >
                    <div className="text-2xl mb-1">{player2.avatar}</div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-gray-500 truncate" style={{ color: player2.color.hex }}>{player2.name}</h5>
                    <div className="text-3xl font-black text-gray-900 mt-1">{player2.score}</div>
                    {Date.now() < player2.frozenUntil && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center">
                        <span className="text-xs text-[#DE212C] font-extrabold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Սառեցված է
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Context question bar */}
                <div className="bg-white border border-gray-250 p-6 rounded-[20px] text-center space-y-4 shadow-3xs">
                  <span className="bg-red-50 border border-red-150 text-chip text-[#DE212C] text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">
                    {duelQuestions[currentDuelQIdx].context}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
                    {duelQuestions[currentDuelQIdx].questionEsp}
                  </h3>
                  
                  <p className="text-xs text-gray-500 font-medium">Ով առաջինը սեղմի ճիշտ տարբերակը, կստանա +1 միավոր: Սխալ պատասխանը սառեցնում է ձեզ:</p>
                </div>

                {/* Twin controllers - Player 1 vs Player 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Player 1 Choice Pad */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 shadow-3xs">
                    <span className="text-[11px] font-black tracking-wider uppercase block pb-1 border-b border-gray-200" style={{ color: player1.color.hex }}>
                      {player1.name} -ի Վահանակ
                    </span>
                    <div className="space-y-2">
                      {duelQuestions[currentDuelQIdx].options.map((opt, i) => (
                        <button
                          key={i}
                          id={`p1-duel-opt-${i}`}
                          onClick={() => handleFutureDuelAnswer("p1", opt)}
                          disabled={Date.now() < player1.frozenUntil}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-250 py-3 rounded-xl text-sm font-bold text-gray-850 shadow-3xs transition active:scale-[0.98] cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Player 2 Choice Pad */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 shadow-3xs">
                    <span className="text-[11px] font-black tracking-wider uppercase block pb-1 border-b border-gray-200" style={{ color: player2.color.hex }}>
                      {player2.name} -ի Վահանակ
                    </span>
                    <div className="space-y-2">
                      {duelQuestions[currentDuelQIdx].options.map((opt, i) => (
                        <button
                          key={i}
                          id={`p2-duel-opt-${i}`}
                          onClick={() => handleFutureDuelAnswer("p2", opt)}
                          disabled={Date.now() < player2.frozenUntil}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-250 py-3 rounded-xl text-sm font-bold text-gray-855 shadow-3xs transition active:scale-[0.98] cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Cancel Game Button */}
                <div className="flex justify-center">
                  <button
                    id="cancel-duel-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("menu"); }}
                    className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-4 py-2 rounded-lg border border-gray-250 transition cursor-pointer font-bold"
                  >
                    Դադարեցնել խաղը
                  </button>
                </div>

              </div>
            )}

            {/* GAMEPLAY 2 & 3: EXCEPTION HUNT */}
            {(arenaGameMode === "pp_hunt" || arenaGameMode === "fut_hunt") && (
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Mode description header */}
                <div className="bg-white border border-gray-250 p-4 rounded-[20px] text-center space-y-1">
                  <span className="text-xs uppercase font-extrabold text-[#DE212C]">
                    {arenaGameMode === "pp_hunt" ? "Անկանոն Մասնիկների Որս" : "Ապառնիի Անկանոն Հիմքերի Որս"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {arenaGameMode === "pp_hunt" 
                      ? "Ընտրե՛ք այն բայերը (Infinitive), որոնք Pretérito Perfecto-ում ունեն անկանոն մասնիկներ:" 
                      : "Գտե՛ք Futuro Simple-ի անկանոն հիմքերը (Futuro stems):"}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    Ճիշտ արժեքը՝ <span className="text-emerald-600 font-bold">+10 միավոր</span>, սխալը (կանոնավորը)՝ <span className="text-[#DE212C] font-bold">-5 միավոր</span>
                  </p>
                </div>

                {/* Side-by-side Race Grids */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* PLAYER 1 GAME BOARD */}
                  <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-gray-250 space-y-4 shadow-3xs">
                    <div className="flex items-center justify-between border-b border-gray-250 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{player1.avatar}</span>
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-gray-900">{player1.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">
                            Մնացել է` <span className="text-gray-900 font-mono font-extrabold">
                              {p1Grid.filter(w => w.isIrregular && !w.clickedByP1).length}
                            </span> անկանոն
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 font-bold uppercase">Միավոր</span>
                        <div className="text-2xl font-black text-gray-900 font-mono">{player1.score}</div>
                      </div>
                    </div>

                    {/* Matrix Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {p1Grid.map((item) => {
                        let cellStyle = "bg-gray-50 hover:bg-white border-gray-200 text-gray-800 hover:border-gray-300 shadow-3xs cursor-pointer";
                        if (item.clickedByP1) {
                          cellStyle = item.isIrregular 
                            ? "bg-emerald-50 border-2 border-[#10B981] text-emerald-950 font-bold cursor-not-allowed scale-[0.97]" 
                            : "bg-red-50 border border-red-300 text-red-950 opacity-55 cursor-not-allowed scale-[0.97]";
                        }

                        return (
                          <button
                            key={item.id}
                            id={`p1-hunt-word-${item.id}`}
                            onClick={() => handleHuntWordClick("p1", item.id)}
                            disabled={item.clickedByP1}
                            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[75px] ${cellStyle} capitalize`}
                          >
                            <span className="text-sm font-mono font-extrabold">{item.word}</span>
                            {item.clickedByP1 && item.isIrregular && (
                              <>
                                {item.participioForm && (
                                  <span className="text-[11px] text-emerald-700 font-extrabold leading-tight mt-0.5">
                                    ➜ {item.participioForm}
                                  </span>
                                )}
                                <span className="text-[9px] text-emerald-600 font-bold leading-tight mt-0.5">{item.meaning}</span>
                              </>
                            )}
                            {item.clickedByP1 && !item.isIrregular && item.participioForm && (
                              <span className="text-[9.5px] text-red-500 font-bold leading-tight mt-0.5">
                                {item.participioForm} (կանոնավոր)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PLAYER 2 GAME BOARD */}
                  <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-gray-250 space-y-4 shadow-3xs">
                    <div className="flex items-center justify-between border-b border-gray-250 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{player2.avatar}</span>
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-gray-900">{player2.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">
                            Մնացել է` <span className="text-gray-900 font-mono font-extrabold">
                              {p2Grid.filter(w => w.isIrregular && !w.clickedByP2).length}
                            </span> անկանոն
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 font-bold uppercase">Միավոր</span>
                        <div className="text-2xl font-black text-gray-900 font-mono">{player2.score}</div>
                      </div>
                    </div>

                    {/* Matrix Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {p2Grid.map((item) => {
                        let cellStyle = "bg-gray-50 hover:bg-white border-gray-200 text-gray-800 hover:border-gray-300 shadow-3xs cursor-pointer";
                        if (item.clickedByP2) {
                          cellStyle = item.isIrregular 
                            ? "bg-emerald-50 border-2 border-[#10B981] text-emerald-950 font-bold cursor-not-allowed scale-[0.97]" 
                            : "bg-red-50 border border-red-300 text-red-950 opacity-55 cursor-not-allowed scale-[0.97]";
                        }

                        return (
                          <button
                            key={item.id}
                            id={`p2-hunt-word-${item.id}`}
                            onClick={() => handleHuntWordClick("p2", item.id)}
                            disabled={item.clickedByP2}
                            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[75px] ${cellStyle} capitalize`}
                          >
                            <span className="text-sm font-mono font-extrabold">{item.word}</span>
                            {item.clickedByP2 && item.isIrregular && (
                              <>
                                {item.participioForm && (
                                  <span className="text-[11px] text-emerald-700 font-extrabold leading-tight mt-0.5">
                                    ➜ {item.participioForm}
                                  </span>
                                )}
                                <span className="text-[9px] text-emerald-600 font-bold leading-tight mt-0.5">{item.meaning}</span>
                              </>
                            )}
                            {item.clickedByP2 && !item.isIrregular && item.participioForm && (
                              <span className="text-[9.5px] text-red-500 font-bold leading-tight mt-0.5">
                                {item.participioForm} (կանոնավոր)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Cancel Game Button */}
                <div className="flex justify-center">
                  <button
                    id="cancel-hunt-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("menu"); }}
                    className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-4 py-2 rounded-lg border border-gray-250 transition cursor-pointer font-bold"
                  >
                    Դադարեցնել խաղը
                  </button>
                </div>

              </div>
            )}

            {/* STAGE 3: FINISHED - THE TREASURE CHEST OPENING PRIZE */}
            {arenaGameMode === "finished" && (
              <div className="max-w-2xl mx-auto text-center space-y-6 text-gray-950">
                
                {/* Celebration header */}
                <div className="space-y-2">
                  <div className="inline-flex text-3xl p-3 bg-amber-50 border border-amber-205 rounded-2xl animate-pulse shadow-3xs">
                    🏆
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900">Մարտն ավարտվե՛ց:</h2>
                  <p className="text-gray-500 text-xs sm:text-sm font-semibold">
                    Իսկական չեմպիոնի մենամարտ էր! Հաղթողը ստանում է իրավունք բացելու Իսպաներենի Ոսկե Սունդուկը:
                  </p>
                </div>

                {/* Duel Winner Announce board */}
                <div className="bg-white border border-gray-250 rounded-[20px] p-6 sm:p-8 space-y-8 shadow-xs relative overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Background magic glow */}
                  <div className={`absolute top-0 w-64 h-64 bg-amber-400/5 blur-3xl rounded-full transition-opacity ${chestOpened ? 'opacity-100' : 'opacity-40'}`} />

                  {/* Player display */}
                  <div className="relative z-10 text-center space-y-2">
                    <div className="text-4xl animate-bounce">{getWinnerInfo().avatar}</div>
                    <h3 className="text-xl sm:text-2xl font-black" style={{ color: getWinnerInfo().color.hex }}>
                      {getWinnerInfo().name} -ը ՀԱՂԹԵՑ: 🎉
                    </h3>
                    <p className="text-gray-500 text-xs uppercase tracking-widest font-mono font-bold">
                      Ստացիր քո ոսկե բանալին 🔑
                    </p>
                  </div>

                  {/* INTERACTIVE 3D CHEST EMBLEM WITH MOTION */}
                  <div className="relative z-25 flex items-center justify-center my-4">
                    
                    {/* Floating particle burst when chest opens */}
                    {chestOpened && (
                      <div className="absolute inset-0 pointer-events-none z-30 transition-all flex items-center justify-center">
                        {chestBurst.map((emoji, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{ 
                              scale: [0.8, 1.2, 0.8], 
                              x: (Math.random() - 0.5) * 320, 
                              y: -120 - Math.random() * 150,
                              rotate: (Math.random() - 0.5) * 360,
                              opacity: [1, 1, 0] 
                            }}
                            transition={{ duration: 1.25, cubicBezier: [0.1, 0.8, 0.3, 1] }}
                            className="absolute text-2xl"
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Chest item */}
                    <button
                      id="treasure-chest-btn"
                      onClick={openTreasureChest}
                      disabled={chestOpened}
                      className={`relative focus:outline-none transition-all duration-300 ${
                        !chestOpened ? 'hover:scale-110 active:scale-95 cursor-pointer' : ''
                      }`}
                    >
                      <div className="absolute -inset-4 bg-yellow-500/10 blur-xl rounded-full animate-pulse pointer-events-none" />

                      {/* Cute vector representation of interactive chest using HTML CSS */}
                      <div className="w-40 h-40 flex flex-col justify-end items-center relative z-20">
                        
                        {/* Upper cap lid of chest */}
                        <div 
                          className={`w-32 h-14 bg-gradient-to-r from-amber-600 to-amber-700 border-2 border-amber-900 rounded-t-2xl shadow-xl transition-all duration-500 relative flex items-center justify-center ${
                            chestOpened ? '-translate-y-8 rotate-[-120deg] opacity-70 scale-90' : ''
                          }`}
                        >
                          {/* golden bars decoration */}
                          <div className="absolute left-4 top-0 bottom-0 w-3 bg-amber-400 border-x border-amber-900" />
                          <div className="absolute right-4 top-0 bottom-0 w-3 bg-amber-400 border-x border-amber-900" />
                          
                          {/* lock latch */}
                          <div className="absolute bottom-0 w-6 h-5 bg-yellow-500 border border-amber-950 rounded-b flex items-center justify-center z-10">
                            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                          </div>
                        </div>

                        {/* Chest bottom box */}
                        <div className="w-34 h-18 bg-gradient-to-r from-amber-700 to-amber-800 border-2 border-amber-950 rounded-b-xl relative shadow-2xl">
                          <div className="absolute left-5 top-0 bottom-0 w-3 bg-amber-500 border-x border-amber-950" />
                          <div className="absolute right-5 top-0 bottom-0 w-3 bg-amber-500 border-x border-amber-950" />
                          
                          {/* key lock slot */}
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-950 rounded-full border border-yellow-500 flex items-center justify-center">
                            <div className="w-2.5 h-4 bg-slate-950 border border-yellow-500/40 rounded-full flex flex-col items-center">
                              <span className="w-1 h-1 bg-yellow-400 rounded-full mt-0.5" />
                            </div>
                          </div>

                          {/* sparkling indicator */}
                          {!chestOpened && (
                            <div className="absolute -top-3 left-4 animate-bounce text-yellow-300 font-black text-xl">
                              ✨
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Hint label */}
                      {!chestOpened && (
                        <div className="text-amber-600 text-xs font-extrabold uppercase tracking-wider animate-pulse pt-2">
                          Սեղմիր սունդուկի վրա՝ բացելու համար! 🗳️
                        </div>
                      )}

                    </button>
                  </div>

                  {/* LOOT REVEAL CARD */}
                  <AnimatePresence>
                    {showPrizeCard && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border-2 border-amber-300 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-sm relative z-30"
                      >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-955 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-amber-500 shadow-3xs">
                          Մեծ Մրցանակ (Premios)
                        </div>

                        <div className="text-4xl text-center">🏆🌌👑</div>

                        <div className="space-y-1 text-center">
                          <h4 className="text-gray-900 font-extrabold text-base">Իսպաներենի Թագավորական Գավաթ</h4>
                          <p className="text-xs text-gray-500 font-medium">
                            Հանձնվում է <span className="text-amber-600 font-extrabold">{getWinnerInfo().name}-ին</span>` կատարյալ հնարամտության, արագագործության և իսպաներենի անկանոն ձևերի տիրապետման համար:
                          </p>
                        </div>

                        {/* Gold status counters */}
                        <div className="grid grid-cols-2 gap-2 text-left bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block">Ստացված Ոսկի</span>
                            <span className="text-xs text-amber-600 font-black font-mono">🪙 +500 Ոսկեդրամ</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block">Վարկանիշ</span>
                            <span className="text-xs text-[#DE212C] font-black font-mono">⭐ +150 LP</span>
                          </div>
                        </div>

                        {/* Armenian translation quote */}
                        <div className="text-[11px] text-gray-500 italic bg-red-50/50 p-2 rounded-lg border border-red-100 font-medium text-center">
                          «¡Enhorabuena, campeón! Has demostrado un conocimiento extraordinario.»
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Lobby Back row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    id="play-again-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("menu"); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#DE212C] hover:bg-[#DE212C]/90 text-white font-extrabold px-8 py-3 rounded-xl transition shadow-3xs cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Խաղալ կրկին
                  </button>
                  <button
                    id="lobby-exit-btn"
                    onClick={() => { playSound("click"); setArenaGameMode("setup"); }}
                    className="w-full sm:w-auto text-gray-750 hover:text-gray-900 bg-gray-100 px-6 py-3 rounded-xl border border-gray-300 transition cursor-pointer font-bold hover:bg-gray-200"
                  >
                    Վերադառնալ սկիզբ
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 font-semibold">
          <p>© 2026 Իսպաներենի Ինտերակտիվ Վիկտորինա: Պատրաստված է սիրով հայ ուսանողների համար:</p>
          <div className="flex gap-4 text-gray-400 font-bold">
            <span>Futuro Simple & Perfecto</span>
            <span>Pretérito Perfecto Irregulares</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

