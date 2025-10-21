import { useState } from "react";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";
import GameRoomPage from "./pages/GameRoomPage";
import "./App.css";

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
  transports: ["websocket"],
});