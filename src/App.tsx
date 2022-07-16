import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import NotFound from "./Pages/NotFound";
import LoginPage from "./Pages/LoginPage";
import NewQuizPage from "./Pages/NewQuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/create-quiz" element = {<NewQuizPage/>}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/auth/login" element={<LoginPage />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
