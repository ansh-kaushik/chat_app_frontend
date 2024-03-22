import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";
import socket from "../socket";
import { Alert } from "@mui/material";
import { useState } from "react";

export default function SignIn() {
  const [userAva, setUserAva] = useState(true);
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    // check on socket for nameAva
    const URL = import.meta.env.PROD
      ? "https://chat-app-backend-w6zu.onrender.com/"
      : "http://localhost:3000/";
    // const sURL = "https://chat-app-backend-w6zu.onrender.com/";
    console.log(import.meta.env.PROD);
    const response = await fetch(`${URL}api/v1/get-user/${username}`);
    const userData = await response.json();
    if (!userData.check) {
      setUserAva(false);
      return;
    } else {
      await fetch(`${URL}api/v1/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
    }

    dispatch(authActions.register({ username }));
    socket.emit("user-connect", username);
  };
  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Whisper
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Enter
        </Button>
        {!userAva && <Alert severity="info">Username taken!</Alert>}
      </Box>
    </Box>
  );
}
