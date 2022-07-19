import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { socket } from "../Code/socket";
import HostAnswerQuiz from "../Component/HostAnswerQuiz";

export default function HostQuizPage() {
  // state: { roomId: roomId, quizId: quizId, questions: questions },
  const { state } = useLocation();
  const location = state;
  const [roomId, setRoomId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizId, setQuizId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);


  const navigate = useNavigate();

  //dapetin data yang dipassing dari page quizParticipant.
  useEffect(() => {
    if (location == null) {
      navigate("/");
    } else {
      setQuizId(location.quizId);
      setQuestions(location.questions);
      setRoomId(location.roomId);
      console.log("tes");

      //ini kirim ke participant qeustion ke 1. agar participan ke next page dan start timer.
      socket.emit("start_room", {
        roomId: location.roomId,
        question: location.questions[currentQuestion],
        hasEnded: false,
      });
      //   console.log(location.quizId);
      //   console.log(location.questions);
      //   console.log(location.roomId);
    }
  }, [location]);

  return (
    <>
      <HostAnswerQuiz question={questions[currentQuestion]}></HostAnswerQuiz>
    </>
  );
}
