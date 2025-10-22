/**
 * ============================================
 * HOMEPAGE.JSX - Landing Page Component
 * ============================================
 * Halaman awal untuk user input nickname dan room code
 * Fitur:
 * - Form input nickname (required)
 * - Form input room code (optional, default "DEFAULT")
 * - Connection status indicator
 * - Error handling untuk join room
 */

import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/HomePage.css";

export default function HomePage({ socket, onJoin }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [nickname, setNickname] = useState(""); // Input nickname user
  const [roomCode, setRoomCode] = useState(""); // Input room code (opsional)
  const [joinError, setJoinError] = useState(""); // Error message saat join gagal
  const [isConnected, setIsConnected] = useState(false); // Status koneksi socket


  // ============================================
  // SOCKET EVENT LISTENERS
  // ============================================
  // Setup listener untuk connection status dan join error
  useEffect(() => {
    // Handler saat socket connected ke server
    const onConnect = () => setIsConnected(true);

    // Handler saat socket disconnected dari server
    const onDisconnect = () => setIsConnected(false);

    // Handler saat join room gagal (room penuh, dll)
    const onJoinError = ({ message }) => setJoinError(message);

    // Register event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joinError", onJoinError);

    // Check koneksi awal saat component mount
    if (socket.connected) setIsConnected(true);

    // Cleanup: remove listeners saat component unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinError", onJoinError);
    };
  }, [socket]);

  // ============================================
  // HANDLER: JOIN ROOM
  // ============================================
  // Fungsi dipanggil saat user submit form join
  function handleJoin(e) {
    e.preventDefault();
    if (!nickname.trim()) return; // Nickname wajib diisi

    // Room code opsional, default ke "DEFAULT"
    const code = roomCode.trim() || "DEFAULT";

    // Emit event "join" ke server
    socket.emit("join", { nickname: nickname.trim(), roomCode: code });

    // Setup listener untuk event "joined" dari server
    // Event ini dikirim server saat join berhasil dengan info isCreator
    const onJoined = ({ id, roomCode: code, isCreator }) => {
      // Panggil callback onJoin dari parent (App.jsx) untuk pindah halaman
      onJoin({
        id,
        nickname: nickname.trim(),
        roomCode: code,
        isCreator, // true jika user adalah pembuat room (pertama join)
      });
      // Remove listener setelah digunakan
      socket.off("joined", onJoined);
    };
    socket.on("joined", onJoined);
  }


  return (
    <div className="home-page">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <div className="home-container">
        <div className="home-header">
          <div className="logo-container">
            <img src="/game-ink.svg" alt="Game Ink Logo" className="logo" />
          </div>
          <h1>MindClash</h1>
          <p className="tagline">Game quiz multiplayer dengan AI!</p>
        </div>

        <form className="join-form" onSubmit={handleJoin}>
          <div className="form-group">
            <label>Nama Kamu</label>
            <input
              type="text"
              placeholder="Masukkan nickname..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Kode Room (opsional)</label>
            <input
              type="text"
              placeholder="DEFAULT"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              autoComplete="off"
            />
          </div>

          {joinError && <div className="error-message">{joinError}</div>}

          <button type="submit" disabled={!isConnected || !nickname.trim()}>
            {isConnected ? "Gabung ke Room" : "Menghubungkan..."}
          </button>

          <div className="info-box">
            <p>
              💡 <strong>Tips:</strong>
            </p>
            <ul>
              <li>Maksimal 10 pemain per room</li>
              <li>Kosongkan kode room untuk join "DEFAULT"</li>
              <li>Pembuat room akan memilih tema quiz</li>
              <li>Share kode room untuk main bareng teman!</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

