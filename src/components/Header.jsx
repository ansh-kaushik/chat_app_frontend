import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { Logout } from "@mui/icons-material";
import { authActions } from "../store/authSlice";
import { roomActions } from "../store/roomSlice";
import MenuIcon from "@mui/icons-material/Menu";

import socket from "../socket";
export default function Header() {
  const auth = useSelector((state) => state.auth.hasAuth);
  const username = useSelector((state) => state.auth.username);

  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  function handleLogout() {
    socket.emit("user-disconnect", username);
    dispatch(authActions.logout());
  }
  return (
    <Box
      component="header"
      maxWidth
      sx={{
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ ml: 1 }}>
        {isSmallScreen && (
          <Button onClick={() => dispatch(roomActions.setIsDrawerOpen(true))}>
            <MenuIcon />
          </Button>
        )}
        Whisper
      </Typography>
      {auth && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mx: 2 }}>
            {username}
          </Typography>
          <Button onClick={handleLogout} variant="contained">
            <Logout />
          </Button>
        </Box>
      )}
    </Box>
  );
}
