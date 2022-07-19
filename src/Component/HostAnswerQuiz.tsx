import React, { useEffect, useState } from "react";
import StellarBackground from "./StellarBackground";

export default function HostAnswerQuiz({ question }) {
  const [answer, setAnswer] = useState("");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const isAnswer = (str) => {
    if (str != answer) {
      return "inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight uppercase rounded transition duration-150 ease-in-out text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none";
    } else {
      return "inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md shadow-lg outline-none ring-0 transition duration-150 ease-in-out text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none";
    }
  };
  useEffect(() => {
    if (question != undefined) {
      const answers = question.answers;
      setQuestionDescription(question.question);
      setAnswerA(answers[0].optionDescription);
      setAnswerB(answers[1].optionDescription);
      setAnswerC(answers[2].optionDescription);
      setAnswerD(answers[3].optionDescription);
      if (answers[0].isAnswer == true) {
        setAnswer("A");
      } else if (answers[1].isAnswer == true) {
        setAnswer("B");
      } else if (answers[2].isAnswer == true) {
        setAnswer("C");
      } else if (answers[3].isAnswer == true) {
        setAnswer("D");
      }
    }
  }, [question]);

  return (
    <>
      {/* <StellarBackground /> */}
      <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
        <StellarBackground />

        <div className="flex flex-wrap content-center justify-center w-11/12 h-auto">
          <main className="flex-1 relative z-0 overflow-y-auto mostly-customized-scrollbar focus:outline-none">
            <div className="py-6 h-full overflow-hidden ">
              <div className=" mx-auto px-4 sm:px-6 md:px-8 flex">
                <h1 className="inline-flex items-center text-center justify-center px-6 py-3 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic bg-indigo-600 w-full h-full drop-shadow-md lg:text-5xl md:text-5xl text-2xl">
                  The Answer Is {answer}
                </h1>
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-xl font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-5"
                >
                  Next
                </button>
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
                        {questionDescription}
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
                        <button type="button" className={isAnswer("A")}>
                          {answerA}
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          B.
                        </label>
                        <button type="button" className={isAnswer("B")}>
                          {answerB}
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          C.
                        </label>
                        <button type="button" className={isAnswer("C")}>
                          {answerC}
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="question"
                          className=" text-2xl font-extrabold text-white pr-2"
                        >
                          D.
                        </label>
                        <button type="button" className={isAnswer("D")}>
                          {answerD}
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
