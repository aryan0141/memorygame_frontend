import "./App.css";
import Layout from "./Components/Layout";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Authentication/Login";
import SignUp from "./Components/Authentication/Signup";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFB400",
      light: "#FFB400",
      dark: "#FFB400",
    },
  },
  typography: {
    fontFamily: "Montserrat",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<SignUp/>} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
