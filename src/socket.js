import { io } from "socket.io-client";

// const URL = "https://chat-app-backend-w6zu.onrender.com";
const URL = import.meta.env.PROD
  ? "https://chat-app-backend-w6zu.onrender.com/"
  : "http://localhost:3000/";
// const sURL = "https://chat-app-backend-w6zu.onrender.com/";
const socket = io(URL, { transports: ["websocket"] });
export default socket;
