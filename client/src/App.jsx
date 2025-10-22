/**
 * ============================================
 * APP.JSX - Main Application Component
 * ============================================
 * Root component yang mengelola:
 * - Socket.IO connection ke server
 * - Routing antara HomePage dan GameRoomPage
 * - User state management (id, nickname, roomCode, isCreator)
 */

import { useState } from "react";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";
import GameRoomPage from "./pages/GameRoomPage";
import "./App.css";

// ============================================
// SOCKET.IO CONNECTION
// ============================================
// Koneksi ke server menggunakan Socket.IO
// URL diambil dari env variable atau default ke localhost:3000
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
  transports: ["websocket"], // Force websocket transport
});

// ======== RAHMAD 1 ====================

export default function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  // State untuk track halaman saat ini ("home" atau "game")
  const [currentPage, setCurrentPage] = useState("home");

  // State untuk menyimpan data user (id socket, nickname, roomCode, isCreator)
  const [user, setUser] = useState({ id: null, nickname: "", roomCode: "" });

  // ============================================
  // HANDLER: JOIN ROOM
  // ============================================
  // Dipanggil setelah user berhasil join room
  // Menerima userData dari HomePage dan pindah ke GameRoomPage
  function handleJoin(userData) {
    setUser(userData); // Simpan data user (id, nickname, roomCode, isCreator)
    setCurrentPage("game"); // Pindah ke halaman game
  }

  // ==== RAHMAD 2 ====================

  // ============================================
  // HANDLER: LEAVE GAME
  // ============================================
  // Dipanggil saat user klik tombol "Selesai" di game over screen
  // Emit event "leaveRoom" ke server dan kembali ke home page
  function handleLeaveGame() {
    socket.emit("leaveRoom"); // Beritahu server user keluar dari room
    setUser({ id: null, nickname: "", roomCode: "" }); // Reset user state
    setCurrentPage("home"); // Kembali ke home page
  }

  // ==== AHMAD 1 ====================

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="app">
      {/* Tampilkan HomePage jika di halaman "home" */}
      {currentPage === "home" && (
        <HomePage socket={socket} onJoin={handleJoin} />
      )}

      {/* Tampilkan GameRoomPage jika di halaman "game" */}
      {currentPage === "game" && (
        <GameRoomPage
          socket={socket}
          user={user}
          onLeaveGame={handleLeaveGame}
        />
      )}
    </div>
  );
}