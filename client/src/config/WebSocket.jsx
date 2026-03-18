import { io } from "socket.io-client";

const socketAPI = io("http://localhost:4500", {
  withCredentials: true,
});


export default socketAPI;