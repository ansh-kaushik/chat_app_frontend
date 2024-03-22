import { Box, Button, Drawer, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { useSelector, useDispatch } from "react-redux";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { roomActions } from "../store/roomSlice";
const CHAT_ROOMS = [0, 1, 2];

export default function Lobby() {
  const [messages, setMessages] = useState([
    [{ username: "u1", message: "u1 chat" }],
    [{ username: "u2", message: "u2 chat" }],
    [{ username: "u3", message: "u3 chat" }],
  ]);
  const dispatch = useDispatch();
  const [activeRoom, setActiveRoom] = useState(0);
  const isDrawerOpen = useSelector((state) => state.room.isDrawerOpen);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const latestChat = useRef();
  const username = useSelector((state) => state.auth.username);
  socket.on("getChats", (roomChats) => {
    setMessages(roomChats);
  });
  useEffect(() => {
    // to make last message appear on screen

    if (latestChat) latestChat.current.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  useEffect(() => {
    socket.on("getChats", (roomChats) => {
      setMessages(roomChats);
    });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // console.log("FORM submitted");
    const data = new FormData(event.currentTarget);
    event.currentTarget.reset();
    const newMessage = data.get("message");
    if (newMessage === "") {
      return;
    }
    setMessages((prevMessageArray) => {
      const updatedMessagesArray = [...prevMessageArray];
      updatedMessagesArray[activeRoom] = [
        ...updatedMessagesArray[activeRoom],
        { username, message: newMessage },
      ];
      return updatedMessagesArray;
    });
    socket.emit("setChats", activeRoom, username, newMessage);
  }

  function handleEnterChatRoom(event, index) {
    event.preventDefault();
    setActiveRoom(index);
  }
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        bgcolor: "#dedede",
        height: isSmallScreen ? "100%" : "600px",
      }}
    >
      {
        <Drawer open={isDrawerOpen} onClose={() => dispatch(roomActions.setIsDrawerOpen(false))}>
          <Button onClick={() => dispatch(roomActions.setIsDrawerOpen(false))}>
            <ChevronLeftIcon />
          </Button>
          {CHAT_ROOMS.map((chatRoomNo, index) => (
            <Button
              onClick={(e) => handleEnterChatRoom(e, chatRoomNo)}
              sx={{ my: 2, mx: 1 }}
              color={activeRoom === chatRoomNo ? "secondary" : "primary"}
              variant="contained"
              key={index}
            >
              Chat Room {chatRoomNo + 1}
            </Button>
          ))}
        </Drawer>
      }
      {!isSmallScreen && (
        <Box
          component="section"
          sx={{
            px: 2,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "20%",
            bgcolor: "#c2c2c2",
          }}
        >
          {CHAT_ROOMS.map((chatRoomNo, index) => (
            <Button
              onClick={(e) => handleEnterChatRoom(e, chatRoomNo)}
              sx={{ my: 2 }}
              color={activeRoom === chatRoomNo ? "secondary" : "primary"}
              variant="contained"
              key={index}
            >
              Chat Room {chatRoomNo + 1}
            </Button>
          ))}
        </Box>
      )}
      <Box
        component="section"
        sx={{
          width: isSmallScreen ? "100%" : "80%",

          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          padding: 1,
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            scrollbarWidth: "thin",
            boxSizing: "border-box",
            paddingRight: 1,
            mb: 1,
          }}
        >
          {messages[activeRoom].map((message, index) => (
            <Paper
              ref={index === messages[activeRoom].length - 1 ? latestChat : undefined}
              sx={{
                listStyleType: "none",
                my: "5px",
                padding: 1,
                minWidth: "30px",
                width: "fit-content",
                wordBreak: "break-word",
                alignSelf: message.username === username ? "flex-end" : "flex-start",
                bgcolor: message.username === username ? "secondary.light" : "white",
              }}
              key={index}
            >
              <Typography
                variant="h4"
                component="h4"
                sx={{ fontSize: "15px", fontWeight: "700", color: "primary.main" }}
              >
                {message.username}
              </Typography>
              <Typography sx={{ fontWeight: "500" }}>{message.message}</Typography>
            </Paper>
          ))}
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
          onSubmit={handleSubmit}
        >
          <TextField name="message" sx={{ width: "85%" }} type="input" />
          <Button
            type="submit"
            sx={{
              ":hover": { bgcolor: "secondary.main" },
              color: "white",
              bgcolor: "primary.main",
            }}
            size={isSmallScreen ? "small" : "large"}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
