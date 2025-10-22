import { useEffect, useState } from "react";
import "../styles/GameRoomPage.css";

export default function GameRoomPage({ socket, user, onLeaveGame }) {

  const [players, setPlayers] = useState([]); 
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); 

  const [round, setRound] = useState({
    index: 0, 
    total: 10, 
    question: "", 
    options: [], 
  });

  const [timer, setTimer] = useState(30); 
  const [scoreboard, setScoreboard] = useState([]); 
  const [finalScoreboard, setFinalScoreboard] = useState(null); 
  const [selectedAnswer, setSelectedAnswer] = useState(""); 
  const [feedback, setFeedback] = useState(""); 
  const [quizReady, setQuizReady] = useState(false); 
  const [isGenerating, setIsGenerating] = useState(false); 
  const [selectedTheme, setSelectedTheme] = useState(""); 

 
  const themes = [
    { value: "OLAHRAGA", label: "⚽ Olahraga" },
    { value: "MATEMATIKA", label: "🔢 Matematika" },
    { value: "SEJARAH", label: "📜 Sejarah Umum" },
    { value: "IPA", label: "🔬 Ilmu Pengetahuan Alam" },
  ];

 
  useEffect(() => {
  
    const onPlayersState = ({
      players: p,
      gameStarted: gs,
      gameEnded: ge,
      quizReady: qr,
    }) => {
      setPlayers(p); 
      setGameStarted(gs); 
      setGameEnded(ge); 
      setQuizReady(qr || false); 

      
      if (!qr) {
        setSelectedTheme("");
        setFeedback("");
      }
    };

  
    const onThemeSet = ({ theme }) => {
      setFeedback(`Tema dipilih: ${theme}`);
    };

    const onGeneratingQuiz = () => {
      setIsGenerating(true);
      setFeedback("Generating quiz ...");
    };

   
    const onQuizReady = () => {
      setIsGenerating(false);
      setQuizReady(true);
      setFeedback("Quiz siap! Tekan Ready untuk mulai.");
    };

   
    const onGameStarting = () => {
      setFeedback("Game dimulai dalam 2 detik...");
    };

    const onRound = (data) => {
      setRound(data); 
      setFeedback(""); 
      setSelectedAnswer(""); 
      setFinalScoreboard(null); 
    };
  })
}