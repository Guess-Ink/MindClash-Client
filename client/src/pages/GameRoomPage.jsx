/**
 * ============================================
 * GAMEROOMPAGE.JSX - Main Game Component
 * ============================================
 * Component utama untuk game room yang menampilkan 3 state berbeda:
 * 1. Waiting Room - Sebelum game mulai (theme selection + ready status)
 * 2. Playing Game - Saat game berjalan (soal, timer, jawaban)
 * 3. Game Over - Setelah game selesai (final leaderboard)
 *
 * Fitur:
 * - Theme selection (hanya creator)
 * - Ready system (semua player harus ready)
 * - Real-time quiz dengan timer
 * - Scoring berdasarkan kecepatan jawab
 * - Live scoreboard
 * - Auto-advance saat semua player jawab
 * - Play again dan exit functionality
 */

import { useEffect, useState } from "react";
import "../styles/GameRoomPage.css";

export default function GameRoomPage({ socket, user, onLeaveGame }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [players, setPlayers] = useState([]); // List semua player di room
  const [gameStarted, setGameStarted] = useState(false); // Apakah game sudah mulai
  const [gameEnded, setGameEnded] = useState(false); // Apakah game sudah selesai

  // State untuk soal saat ini
  const [round, setRound] = useState({
    index: 0, // Nomor soal (1-10)
    total: 10, // Total soal
    question: "", // Text pertanyaan
    options: [], // Array pilihan A, B, C, D
  });

  const [timer, setTimer] = useState(30); // Countdown timer (detik)
  const [scoreboard, setScoreboard] = useState([]); // Scoreboard real-time
  const [finalScoreboard, setFinalScoreboard] = useState(null); // Final scoreboard game over
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Jawaban yang dipilih user
  const [feedback, setFeedback] = useState(""); // Feedback message (benar/salah/info)
  const [quizReady, setQuizReady] = useState(false); // Apakah quiz sudah di-generate
  const [isGenerating, setIsGenerating] = useState(false); // Apakah sedang generate quiz
  const [selectedTheme, setSelectedTheme] = useState(""); // Tema yang dipilih creator

  // ============================================
  // AVAILABLE THEMES
  // ============================================
  // List tema quiz yang tersedia untuk dipilih
  const themes = [
    { value: "OLAHRAGA", label: "⚽ Olahraga" },
    { value: "MATEMATIKA", label: "🔢 Matematika" },
    { value: "SEJARAH", label: "📜 Sejarah Umum" },
    { value: "IPA", label: "🔬 Ilmu Pengetahuan Alam" },
  ];

  // ============================================
  // SOCKET EVENT LISTENERS
  // ============================================
  // Setup semua event listener dari server
  useEffect(() => {
    // Handler untuk update state players dan game status
    const onPlayersState = ({
      players: p,
      gameStarted: gs,
      gameEnded: ge,
      quizReady: qr,
    }) => {
      setPlayers(p); // Update list players
      setGameStarted(gs); // Update status game started
      setGameEnded(ge); // Update status game ended
      setQuizReady(qr || false); // Update status quiz ready

      // Reset selectedTheme jika quizReady false (saat restart game)
      if (!qr) {
        setSelectedTheme("");
        setFeedback("");
      }
    };

    // Handler saat tema dipilih oleh creator
    const onThemeSet = ({ theme }) => {
      setFeedback(`Tema dipilih: ${theme}`);
    };

    // Handler saat quiz sedang di-generate oleh AI
    const onGeneratingQuiz = () => {
      setIsGenerating(true);
      setFeedback("Generating quiz ...");
    };

    // Handler saat quiz sudah siap (selesai di-generate)
    const onQuizReady = () => {
      setIsGenerating(false);
      setQuizReady(true);
      setFeedback("Quiz siap! Tekan Ready untuk mulai.");
    };

    // Handler saat game akan dimulai (semua player ready)
    const onGameStarting = () => {
      setFeedback("Game dimulai dalam 2 detik...");
    };

    // Handler saat round/soal baru dimulai
    const onRound = (data) => {
      setRound(data); // Update data soal (index, total, question, options)
      setFeedback(""); // Clear feedback
      setSelectedAnswer(""); // Reset selected answer
      setFinalScoreboard(null); // Clear final scoreboard
    };

    // Handler untuk update countdown timer
    const onTimer = (sec) => setTimer(sec);

    // Handler untuk update scoreboard real-time
    const onScoreboard = (board) => setScoreboard(board);

    // Handler untuk hasil jawaban (benar/salah + poin)
    const onGuessResult = ({ correct, already, points, elapsedSeconds }) => {
      if (already) {
        setFeedback("Sudah benar di ronde ini "); // Sudah jawab benar sebelumnya
      } else if (correct) {
        setFeedback(`Benar! +${points} poin (${elapsedSeconds}s) `); // Jawaban benar
      } else {
        setFeedback("Salah! Jawabanmu tidak tepat "); // Jawaban salah
      }
    };

    // Handler saat game over (semua soal selesai)
    const onGameOver = ({ finalScoreboard: finalBoard }) => {
      setFinalScoreboard(finalBoard); // Set final leaderboard
      setGameEnded(true);
      setGameStarted(false);
    };

    // Register semua event listeners ke socket
    socket.on("playersState", onPlayersState);
    socket.on("themeSet", onThemeSet);
    socket.on("generatingQuiz", onGeneratingQuiz);
    socket.on("quizReady", onQuizReady);
    socket.on("gameStarting", onGameStarting);
    socket.on("round", onRound);
    socket.on("timer", onTimer);
    socket.on("scoreboard", onScoreboard);
    socket.on("guessResult", onGuessResult);
    socket.on("gameOver", onGameOver);

    // RAHMAD 1  ====================


    // Request state update dari server saat component mounted
    // Ini memastikan client mendapat state terbaru (fix race condition)
    socket.emit("requestState");

    // Cleanup: remove semua listeners saat component unmount
    return () => {
      socket.off("playersState", onPlayersState);
      socket.off("themeSet", onThemeSet);
      socket.off("generatingQuiz", onGeneratingQuiz);
      socket.off("quizReady", onQuizReady);
      socket.off("gameStarting", onGameStarting);
      socket.off("round", onRound);
      socket.off("timer", onTimer);
      socket.off("scoreboard", onScoreboard);
      socket.off("guessResult", onGuessResult);
      socket.off("gameOver", onGameOver);
    };
  }, [socket]);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  // Cari data player sendiri dari list players
  const myPlayer = players.find((p) => p.id === user.id);
  // Cari score player sendiri dari scoreboard
  const myScore = scoreboard.find((s) => s.id === user.id)?.score || 0;

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================

  // Handler saat creator pilih tema quiz
  function handleSetTheme(theme) {
    if (!user.isCreator) return; // Hanya creator yang bisa set tema
    setSelectedTheme(theme); // Update local state
    socket.emit("setTheme", { theme }); // Kirim ke server untuk generate quiz
  }

  // Handler saat player klik tombol "SIAP"
  function handleReady() {
    socket.emit("ready"); // Toggle ready status
  }

  // Handler saat player klik "Main Lagi" di game over screen
  function handlePlayAgain() {
    socket.emit("playAgain"); // Request restart game
  }

  // Handler saat player memilih jawaban
  function handleAnswerSelect(answer) {
    if (!selectedAnswer) {
      // Hanya bisa jawab sekali per soal
      setSelectedAnswer(answer); // Simpan jawaban yang dipilih (untuk UI)
      socket.emit("guess", { answer }); // Kirim jawaban ke server
    }
  }

  // ============================================
  // RENDER: WAITING ROOM
  // ============================================
  // Tampilan sebelum game mulai (theme selection + ready system)
  if (!gameStarted && !gameEnded) {
    return (
      <div className="game-room-page">
        <header className="room-header">
          <div className="room-info">
            <span className="room-label">Room:</span>
            <span className="room-code">{user.roomCode}</span>
          </div>
          <div className="user-info">
            <span>{user.nickname}</span>
          </div>
        </header>

        <div className="waiting-room">
          <h2>Waiting Room</h2>

          {user.isCreator && !selectedTheme && !isGenerating && !quizReady && (
            <div className="theme-selection">
              <h3>Pilih Tema Quiz</h3>
              <div className="theme-grid">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    className="theme-button"
                    onClick={() => handleSetTheme(theme.value)}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!user.isCreator && !quizReady && !isGenerating && (
            <p className="waiting-desc">
              Menunggu pembuat room memilih tema...
            </p>
          )}

          {isGenerating && (
            <div className="generating-status">
              <div className="spinner"></div>
              <p>⏳ AI sedang membuat soal quiz...</p>
            </div>
          )}

          {quizReady && (
            <p className="waiting-desc">
              Quiz siap! Tekan tombol <strong>SIAP</strong> untuk mulai bermain!
            </p>
          )}
          <p className="waiting-note">
            Game akan dimulai otomatis ketika semua pemain siap.
          </p>

          <div className="players-list">
            <h3>Pemain di Room ({players.length}/10)</h3>
            <ul>
              {players.map((p) => (
                <li key={p.id} className={p.id === user.id ? "me" : ""}>
                  <span className="player-name">{p.nickname}</span>
                  <span className={`status ${p.ready ? "ready" : "not-ready"}`}>
                    {p.ready ? "✓ Siap" : "Belum Siap"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            className={`ready-btn ${myPlayer?.ready ? "active" : ""}`}
            onClick={handleReady}
            disabled={!quizReady}
          >
            {myPlayer?.ready ? "✓ SIAP" : "SIAP"}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: GAME OVER
  // ============================================
  // Tampilan setelah game selesai (final leaderboard + options)
  if (gameEnded && finalScoreboard) {
    return (
      <div className="game-room-page">
        <header className="room-header">
          <div className="room-info">
            <span className="room-label">Room:</span>
            <span className="room-code">{user.roomCode}</span>
          </div>
          <div className="user-info">
            <span>{user.nickname}</span>
            <span className="score">Skor: {myScore}</span>
          </div>
        </header>

        <div className="game-over-screen">
          <h2>🏆 Hasil Akhir</h2>

          <div className="final-leaderboard">
            <ul>
              {finalScoreboard.map((p, idx) => (
                <li
                  key={p.id}
                  className={`rank-${idx + 1} ${p.id === user.id ? "me" : ""}`}
                >
                  <span className="rank">#{idx + 1}</span>
                  <span className="name">{p.nickname}</span>
                  <span className="points">{p.score} poin</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="game-over-buttons">
            <button className="play-again-btn" onClick={handlePlayAgain}>
              Main Lagi
            </button>
            <button className="leave-game-btn" onClick={onLeaveGame}>
              Selesai
            </button>
          </div>

          <p className="play-again-note">
            Semua pemain akan kembali ke waiting room setelah klik "Main Lagi".
          </p>
        </div>
      </div>
    );
  }
  // ============================================
  // RENDER: PLAYING GAME
  // ============================================
  // Tampilan saat game sedang berjalan (soal + timer + options)
  return (
    <div className="game-room-page">
      <header className="room-header">
        <div className="room-info">
          <span className="room-label">Room:</span>
          <span className="room-code">{user.roomCode}</span>
        </div>
        <div className="user-info">
          <span>{user.nickname}</span>
          <span className="score">Skor: {myScore}</span>
        </div>
      </header>

      <main className="game-play">
        <div className="question-area">
          <div className="round-info">
            Soal {round.index}/{round.total}
          </div>
          <div className="question-display">
            <p className="question-text">{round.question}</p>
          </div>
          <div className="timer-display">⏱️ {timer}s</div>
        </div>

        <div className="options-grid">
          {round.options &&
            round.options.map((option, idx) => {
              const letter = option.charAt(0); // A, B, C, atau D
              return (
                <button
                  key={idx}
                  className={`option-btn ${
                    selectedAnswer === letter ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(letter)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              );
            })}
        </div>

        <div className="feedback-area">{feedback}</div>

        <section className="scoreboard-section">
          <h3>Papan Skor Sementara</h3>
          <ul>
            {scoreboard.map((p) => (
              <li key={p.id} className={p.id === user.id ? "me" : ""}>
                <span className="name">{p.nickname}</span>
                <span className="pts">{p.score}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}