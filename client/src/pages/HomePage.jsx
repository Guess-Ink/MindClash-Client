
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
}