import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import NotFound from "./Pages/NotFound";
import LoginPage from "./Pages/LoginPage";
import NewQuizPage from "./Pages/NewQuizPage";
import MyQuiz from "./Pages/MyQuiz";
import QuizHistory from "./Pages/QuizHistory";
import TestSocket from "./Pages/TestSocket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-socket" element={<TestSocket />}></Route>
        <Route path="/create-quiz" element={<NewQuizPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/my-quiz" element={<MyQuiz />}></Route>
        <Route path="/quiz-history" element={<QuizHistory />}></Route>
        <Route path="/auth/login" element={<LoginPage />}></Route>
        <Route path=""> </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
