import React from "react";
import ReactLoading from "react-loading";

export default function () {
  return (
    <div className="w-5/6 ma2 h4 mt-10 items-center justify-center flex flex-column flex-wrap">
      <ReactLoading type="spinningBubbles" color="#ffff" />
    </div>
  );
}
