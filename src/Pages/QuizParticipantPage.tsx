import React from "react";
import StellarBackground from "../Component/StellarBackground";

const genrateRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function QuizParticipantPage() {
  const colors = ["red", "yellow", "green", "blue"];
  const users = [
    "mav",
    "niko",
    "sean",
    "therry",
    "ade",
    "wirya",
    "ditha",
    "dudu",
    "niel",
  ];
  return (
    <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
      <StellarBackground />
      <div className="flex flex-col content-center justify-center w-9/12 h-auto">
        <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
          <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl text-center">
            Quiz Participants
          </h2>
        </div>
        <div className="flex flex-col  r pt-2 overflow-y-scroll overflow-x-hidden rounded-lg shadow-xl bg-indigo-600 h-5/6 mt-4 w-full sm:pt-2 sm:pt-6">
          <div className="px-0 h-auto sm:px-0 flex flex-wrap justify-center">
            {users.map((user) => (
              <span
                key={user}
                className={`inline-flex items-center mx-1 my-1 px-3 py-0.5 rounded-full text-xl font-medium bg-${
                  colors[genrateRandomNumber(0, colors.length - 1)]
                }-500 text-white-800`}
              >
                {user}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
