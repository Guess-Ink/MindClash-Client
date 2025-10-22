import { useState, useEffect } from "react";
import "../styles/HomePage.css";

export default function HomePage({ socket, onJoin }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [nickname, setNickname] = useState(""); // Input nickname user
  const [roomCode, setRoomCode] = useState(""); // Input room code (opsional)
  const [joinError, setJoinError] = useState(""); // Error message saat join gagal
  const [isConnected, setIsConnected] = useState(false); // Status koneksi socket

//   ===== FAWWAZ 1 ==========================

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

//   ===== FAWWAZ 2 ==========================

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
}
