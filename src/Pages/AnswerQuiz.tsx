import React, { useEffect, useState } from "react";
import StellarBackground from "../Component/StellarBackground";

export default function AnswerQuiz() {
  const [option, setOption] = useState("");
  return (
    <>
      {/* <StellarBackground /> */}
      <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
        <StellarBackground />
        <div className="flex flex-wrap content-center justify-center w-11/12 h-auto">
          <main className="flex-1 relative z-0 overflow-y-auto mostly-customized-scrollbar focus:outline-none">
            <div className="py-6 h-full overflow-hidden">
              <div className=" mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="inline-flex items-center justify-center px-2.5 py-0.5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic bg-indigo-600 w-full h-full drop-shadow-md lg:text-5xl md:text-5xl text-2xl mt-8 ">
                  {option == ""
                    ? "Please Choose an Answer!"
                    : `Your Choice: ${option}`}
                </h1>
              </div>
              <div className="flex content-center mt-5 w-full h-full mx-auto px-4 sm:px-6 md:px-8 mt-2">
                {/* Replace with your content */}
                <div className="flex flex-col content-center sm:justify-center pt-2 overflow-y-scroll mostly-customized-scrollbar overflow-x-hidden rounded-lg shadow-xl bg-indigo-600 h-5/6 mt-4 w-full sm:pt-2 sm:pt-6">
                  <div className="px-0 h-auto sm:px-0 flex align-center justify-center content-center">
                    <span className="inline-flex justify-center items-center content-center h-14 w-14 rounded-full rounded-full text-xl font-medium bg-gray-100 text-gray-800">
                      10
                    </span>
                  </div>
                  <div className="px-4 pb-6 sm:py-6 sm:px-6 h-2/5">
                    <div className="h-full">
                      <label
                        htmlFor="question"
                        className="text-2xl font-extrabold text-white"
                      >
                        Question:
                      </label>
                      <div
                        id="question"
                        className="my-2.5 bg-blue-100 shadow-sm text-center block w-full sm:text-2xl font-bold border-gray-300 rounded-md h-full resize-none"
                      >
                        Who Is Bimbing ?
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-6 h-auto">
                    {/* Content goes here */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          A.
                        </label>
                        <button
                          onClick={() => setOption("A")}
                          type="button"
                          className="inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        >
                          MT NK
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          B.
                        </label>
                        <button
                          onClick={() => setOption("B")}
                          type="button"
                          className="inline-block px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-700 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-800 active:shadow-lg transition duration-150 ease-in-out shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        >
                          MT
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          C.
                        </label>
                        <button
                          onClick={() => setOption("C")}
                          type="button"
                          className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        >
                          NK
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          D.
                        </label>
                        <button
                          onClick={() => setOption("D")}
                          type="button"
                          className="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        >
                          MAV NIKO
                        </button>
                      </div>
                    </div>
                    {/* We use less vertical padding on card footers at all sizes than on headers or body sections*/}
                  </div>
                </div>

                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
