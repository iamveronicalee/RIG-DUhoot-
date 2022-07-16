import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="flex flex-wrap content-center justify-center w-100 h-100 bg-blue">
      <div className="w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap">
        <ReactLoading type="balls" color="#88E0EF" />
      </div>
    </div>
  );
}
