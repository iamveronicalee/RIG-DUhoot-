import React from "react";
import ReactLoading from "react-loading";
import StellarBackground from "./StellarBackground";

export default function WaitingHost() {
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
