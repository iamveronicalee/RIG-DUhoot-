import React from "react";
import StellarBackground from "./StellarBackground";
import ReactLoading from "react-loading";

export default function NoQuiz() {
  return (
    <div>
      <StellarBackground />
      <div className="flex justify-center items-center my-64">
        <div className="flex flex-col justify-center items-center">
          <ReactLoading type="bubbles" color="#fff" width={'20%'} className="mb-16" />
          <h1 className="text-white text-center text-5xl font-bold">No Quiz Selected Yet....</h1>
        </div>
      </div>
    </div>
  );
}
