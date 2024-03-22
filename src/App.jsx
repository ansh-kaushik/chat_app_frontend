import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import Lobby from "./components/Lobby";
import Header from "./components/Header";
import { useSelector, useDispatch } from "react-redux";
import Register from "./components/Register";
import socket from "./socket";
import { authActions } from "./store/authSlice";
function App() {
  const auth = useSelector((state) => state.auth.hasAuth);
  const dispatch = useDispatch();
  socket.on("disconnect", () => {
    dispatch(authActions.logout());
  });
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ display: "flex", flexDirection: "column", p: 0 }}>
        {auth && <Header />}
        {!auth && <Register />}
        {auth && <Lobby />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
