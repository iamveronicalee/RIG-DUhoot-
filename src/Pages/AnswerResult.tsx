import React, { useEffect, useState } from "react";
import StellarBackground from "../Component/StellarBackground";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import { socket } from "../Code/socket";

const incorrects = ["Oops ", "Sorry ", "Oh no "];
const corrects = ["Yay ", "Congrats ", "Cool "];
const genrateRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function AnswerResult() {
  const { state } = useLocation();
  const location = state;

  const navigate = useNavigate();
  const [result, setResult] = useState(true);
  const [prefix, setPrefix] = useState("");

  useEffect(() => {


    if (location.isTrue == "true") {
      setResult(true)
      setPrefix(corrects[genrateRandomNumber(0, corrects.length - 1)]);
    } else {
      setResult(false)
      setPrefix(incorrects[genrateRandomNumber(0, incorrects.length - 1)]);
    }
    // console.log(location)
  }, [location]);

  useEffect(()=>{

    socket.on("start-question", (data)=>{
      navigate("/answer-quiz", {
        state: {quizId: data.quizId, questions: data.question },
      })
    })

  }, [socket])

  return (
    <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
      <StellarBackground />
      <div className="flex flex-wrap content-center justify-center w-9/12 h-auto">
        {result ? (
          <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ffff"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl text-center">
              {prefix} Correct Answer
            </h2>
          </div>
        ) : (
          <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ffff"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl text-center">
              {prefix} Incorrect Answer
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
