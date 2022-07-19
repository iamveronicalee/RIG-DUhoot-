import { useMutation } from "@apollo/client";
import axios from "axios";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../Code/socket";
import { getSessionStorageOrDefault } from "../Utils/useSessionStorage";
import StellarBackground from "./StellarBackground";

const GET_USER_BY_USERNAME = gql`
  mutation getUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      id
      userName
      userId
    }
  }
`;

export default function WaitingHost() {
  const [userMutate, userMutateRes] = useMutation(GET_USER_BY_USERNAME);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const { state } = useLocation();
  const { roomId } = state;
  const navigate = useNavigate();
  var location = "1";

  useEffect(() => {
    const token = getSessionStorageOrDefault("accessToken", "");
    if (token == "") {
      navigate("/auth/login");
    } else {
      fetchUser(token);
    }
  }, []);

  const fetchUser = (token) => {
    axios
      .get("http://localhost:9000/auth/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        userMutate({
          variables: {
            username: response.data.user.userName,
          },
        });
      });
  };

  useEffect(() => {
    if (userMutateRes.data != undefined) {
      console.log(userMutateRes.data.getUserByUsername);
      setUserId(userMutateRes.data.getUserByUsername.userName);
      setUserName(userMutateRes.data.getUserByUsername.userName);
    }
  }, [userMutateRes.data]);

  useEffect(() => {
    if (location == null) {
      navigate("/");
    }
  }, [location]);

  const leaveRoom = (userName) => {
    console.log(roomId);
    console.log(userName);
    socket.emit("leave_room", { roomId: roomId, participantId: userName });
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      leaveRoom(userName);
    });
  }, [userName]);

  //SOCKET

  useEffect(() => {
    socket.on("leave_room", (data) => {
      //emit ke socket untuk keluarin user ini dari ruangan
      if (data) {
        console.log("left room");
        leaveRoom();
      }
    });
  }, [socket]);
  //ENDSOCKET

  return (
    <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
      <StellarBackground />
      <div className="flex flex-wrap content-center justify-center w-9/12 h-auto">
        <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
          <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl">
            You are In!
          </h2>
          <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl">
            Waiting for Host
          </h2>
        </div>
        <div className="w-5/6 ma2 h4 mt-10 items-center justify-center flex flex-column flex-wrap">
          <ReactLoading type="spinningBubbles" color="#ffff" />
        </div>
      </div>
    </div>
  );
}
