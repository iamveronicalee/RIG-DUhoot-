import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:9000");

export default function TestSocket() {
  const handleClick = () => {
    socket.emit("send_message", { message: "hello" });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <>
      <h1>Hello</h1>
      <button onClick={handleClick}> click me </button>
    </>
  );
}
