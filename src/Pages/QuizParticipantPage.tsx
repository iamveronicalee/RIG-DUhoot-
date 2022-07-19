import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import { Server } from "http";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../Code/socket";
import StellarBackground from "../Component/StellarBackground";
import {
  getSessionStorageOrDefault,
  useSessionStorage,
} from "../Utils/useSessionStorage";

const genrateRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function QuizParticipantPage() {
  // Data yang di pass
  const { state } = useLocation();
  const location = state;
  const [quizName, setQuizName] = useState("");
  const [roomId, setRoomId] = useState("");
  const colors = ["red", "yellow", "green", "blue"];
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [participantSession, setParticipantSession] = useSessionStorage(
    "participants",
    []
  );

  const hostExitRoom = (thisRoomId) => {
    socket.emit("close_room", {
      roomId: thisRoomId,
    });
    window.history.replaceState({}, document.title);
    navigate("/");
  };

  useEffect(() => {
    if (location == null) {
      navigate("/");
    } else {
      setQuizName(location.quizName);
      setRoomId(location.roomId);
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      hostExitRoom(roomId);
    });
  }, [roomId]);
  //SOCKET

  useEffect(() => {
    socket.on("new_participant_join", (data) => {
      if (data) {
        console.log(data);
        setUsers((users) => [...users, data.participantId]);
        setParticipantSession((participantSession) => [
          ...participantSession,
          data.participantId,
        ]);
        console.log(getSessionStorageOrDefault("participants", []));
      }
    });
    socket.on("new_participant_leave", (data) => {
      console.log(data);
      if (data.participanId != "") {
        const participantId = data.participantId;
        let participantArr = getSessionStorageOrDefault("participants", []);

        let arr = [""];
        arr.pop();
        for (let i = 0; i < participantArr.length; i++) {
          console.log(participantArr[i], participantId);
          if (participantArr[i] != participantId) {
            arr = [...arr, participantArr[i]];
          }
        }
        console.log("arr = ", arr);
        setParticipantSession(arr);
        setUsers(arr);
      }
    });
  }, [socket]);
  //ENDSOCKET


  const quizStarted = ()=>{
    let data = {

    }
    socket.emit("start_room", {

    })
  }

  return (
    <>
      <StellarBackground />
      <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
        <div className="relative flex flex-col content-center items-center justify-center w-9/12 h-5/6 space-y-5">
          <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
            <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent font-medium rounded  font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-5xl md:text-9xl text-3xl text-center">
              {quizName} Quiz Participants
              <br />
              {roomId}
            </h2>
          </div>
          <div className="flex flex-col  r pt-2 overflow-y-auto overflow-x-hidden rounded-lg shadow-xl bg-indigo-600 h-5/6 mt-4 w-full sm:pt-2 sm:pt-6">
            <div className="px-0 h-auto sm:px-0 flex flex-wrap justify-center">
              {users.length < 1 ? (
                <p className="flex align-center justify-center content-center text-2xl sm:text-5xl w-full h-full text-center text-white font-extrabold">
                  You're alone 😢
                </p>
              ) : (
                users.map((user) => (
                  <span
                    key={user}
                    className={`inline-flex items-center mx-1 my-1 px-3 py-0.5 rounded-full text-xl font-medium bg-${
                      colors[genrateRandomNumber(0, colors.length - 1)]
                    }-500 text-white-800`}
                  >
                    {user}
                  </span>
                ))
              )}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex w-full sm:w-32 content-center justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={quizStarted()}
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
}
