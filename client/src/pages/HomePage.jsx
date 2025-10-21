
import { useState, useEffect } from "react";
import "../styles/HomePage.css";

export default function HomePage({ socket, onJoin }) {
 
  const [nickname, setNickname] = useState(""); 
  const [roomCode, setRoomCode] = useState(""); 
  const [joinError, setJoinError] = useState("");
  const [isConnected, setIsConnected] = useState(false); 


  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onJoinError = ({ message }) => setJoinError(message);


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joinError", onJoinError);


    if (socket.connected) setIsConnected(true);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinError", onJoinError);
    };
  }, [socket]);


  function handleJoin(e) {
    e.preventDefault();
    if (!nickname.trim()) return; 

  
    const code = roomCode.trim() || "DEFAULT";
    socket.emit("join", { nickname: nickname.trim(), roomCode: code });
    const onJoined = ({ id, roomCode: code, isCreator }) => {
      onJoin({
        id,
        nickname: nickname.trim(),
        roomCode: code,
        isCreator, 
      });
     
      socket.off("joined", onJoined);
    };
    socket.on("joined", onJoined);
  }
return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Quiz Game</h1>
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