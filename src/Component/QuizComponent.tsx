import { useMutation } from "@apollo/react-hooks";
import { Transition, Dialog, Menu } from "@headlessui/react";
import {
  XIcon,
  MenuAlt2Icon,
  SearchIcon,
  BellIcon,
  LinkIcon,
  MenuIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  QrcodeIcon,
} from "@heroicons/react/outline";
import { gql } from "apollo-boost";
import axios from "axios";
import { create } from "domain";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../Code/socket";
import Layout from "../Component/Layout";
import {
  getSessionStorageOrDefault,
  useSessionStorage,
} from "../Utils/useSessionStorage";

const CREATE_QUIZ_DETAIL = gql`
  mutation CreateQuizDetail(
    $createQuizDetailData: CreateQuestionInput!
    $quizId: Float!
  ) {
    createQuizDetail(data: $createQuizDetailData, quizId: $quizId) {
      quizId
      questionId
      question {
        optionConnection {
          id
          optionDescription
          isAnswer
        }
      }
    }
  }
`;

const GET_QUIZ_DATA = gql`
  mutation GetAllQuizDetailById($quizId: Float!) {
    getAllQuizDetailById(quizId: $quizId) {
      question {
        id
        questionDescription
        optionConnection {
          id
          optionDescription
          isAnswer
        }
      }
    }
  }
`;
const DELETE_QUIZ_QUESTION = gql`
  mutation DeleteQuestion($questionId: Float!) {
    deleteQuestion(questionId: $questionId)
  }
`;

const UPDATE_QUIZ_QUESTION = gql`
  mutation UpdateQuizDetail($data: UpdateQuestionInput!) {
    updateQuizDetail(data: $data)
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function QuizComponent({ quizId, quizName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");

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
        // console.log(response.data)
        // console.log(response.data.realname)
        setUsername(response.data.user.realName);
        setUser(response.data.user.userName);
      });
  };

  // Data yang di pass

  const [createQuizDetail, createQuizDetailRes] =
    useMutation(CREATE_QUIZ_DETAIL);
  const [deleteQuizQuestion, deleteQuizQuestionRes] =
    useMutation(DELETE_QUIZ_QUESTION);
  const [updateQuizDetail, updateQuizDetailRes] =
    useMutation(UPDATE_QUIZ_QUESTION);
  const [getQuizData, getQuizDataRes] = useMutation(GET_QUIZ_DATA);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const newOpt1 = {
    questionId: 0,
    isNew: true,
    question: "",
    answers: [{}],
  };
  const [options, setOptions] = useState<any[]>([newOpt1]);

  //untuk question and answer

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [question, setQuestion] = useState("");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    if (getQuizDataRes.data) {
      const quizDatas = getQuizDataRes.data.getAllQuizDetailById;
      // masukin data kedalam array of quizData
      var arr = [{}];
      arr.pop();
      quizDatas.map((item) => {
        const i = item.question;
        //nanti kita tinggal buat quizData baru append ke options
        const quizData = {
          questionId: i.id, // ambil dari mapping question id
          isNew: false, // sset false
          question: i.questionDescription, // ambil dari mapping
          answers: i.optionConnection, // ambil dari mapping
        };
        arr = [...arr, quizData];
      });
      console.log(arr.length);
      if (arr.length == 1) setOptions([newOpt1]);
      else {
        arr = [...arr, newOpt1];
        setOptions(arr);
      }
      setCurrentQuestion(quizDatas.length);
    }
  }, [getQuizDataRes.data]);

  const reloadData = () => {
    getQuizData({
      variables: {
        quizId: quizId,
      },
    });
  };

  useEffect(() => {
    //pake mutationnya getQuiz.id
    resetData();
    reloadData();
  }, []);

  useEffect(() => {
    if (deleteQuizQuestionRes.data) {
      setOptions([newOpt1]);
      reloadData();
    }
  }, [deleteQuizQuestionRes.data]);

  useEffect(() => {
    if (updateQuizDetailRes.data) {
      //disini palingan keluarin something like update success
      // window.location.reload()
      setOptions([newOpt1]);
      reloadData();
    }
  }, [updateQuizDetailRes.data]);

  const updateQuiz = (q) => {
    //panggil mutation update quiz based on questionId.
    console.log(q);
    updateQuizDetail({
      variables: {
        data: {
          questionId: q.questionId,
          questionDescription: question,
          options: [
            {
              optionId: q.answers[0].id,
              optionDescription: answerA,
              isAnswer: selectedAnswer == "A" ? true : false,
            },
            {
              optionId: q.answers[1].id,
              optionDescription: answerB,
              isAnswer: selectedAnswer == "B" ? true : false,
            },
            {
              optionId: q.answers[2].id,
              optionDescription: answerC,
              isAnswer: selectedAnswer == "C" ? true : false,
            },
            {
              optionId: q.answers[3].id,
              optionDescription: answerD,
              isAnswer: selectedAnswer == "D" ? true : false,
            },
          ],
        },
      },
    });
  };

  const deleteItem = (questionId) => {
    // panggil mutation untuk delete
    deleteQuizQuestion({
      variables: {
        questionId: questionId,
      },
    });
  };

  const resetData = () => {
    setQuestion("");
    setAnswerA("");
    setAnswerB("");
    setAnswerC("");
    setAnswerD("");
    setSelectedAnswer("");
  };

  const updateUI = (i) => {
    console.log(i);
    resetData();
    if (!i.isNew) {
      setCurrentQuestion(options.indexOf(i));
      setQuestion(i.question);
      setAnswerA(i.answers[0].optionDescription);
      setAnswerB(i.answers[1].optionDescription);
      setAnswerC(i.answers[2].optionDescription);
      setAnswerD(i.answers[3].optionDescription);

      if (i.answers[0].isAnswer == true) {
        setSelectedAnswer("A");
      } else if (i.answers[1].isAnswer == true) {
        setSelectedAnswer("B");
      } else if (i.answers[2].isAnswer == true) {
        setSelectedAnswer("C");
      } else if (i.answers[3].isAnswer == true) {
        setSelectedAnswer("D");
      }
    } else {
      setCurrentQuestion(options.indexOf(i));
      resetData();
    }
  };

  useEffect(() => {
    if (createQuizDetailRes.data) {
      //disini palingan keluarin something like insert success

      const quizData = createQuizDetailRes.data.createQuizDetail;
      console.log(quizData);
      const answers = [
        {
          id: quizData.question.optionConnection[0].id,
          optionDescription: answerA,
          isAnswer: false,
        },
        {
          id: quizData.question.optionConnection[1].id,
          optionDescription: answerB,
          isAnswer: false,
        },
        {
          id: quizData.question.optionConnection[2].id,
          optionDescription: answerC,
          isAnswer: false,
        },
        {
          id: quizData.question.optionConnection[3].id,
          optionDescription: answerD,
          isAnswer: false,
        },
      ];

      if (selectedAnswer == "A") {
        answers[0].isAnswer = true;
      } else if (selectedAnswer == "B") {
        answers[1].isAnswer = true;
      } else if (selectedAnswer == "C") {
        answers[2].isAnswer = true;
      } else if (selectedAnswer == "D") {
        answers[3].isAnswer = true;
      }

      options[currentQuestion].questionId = quizData.questionId;
      options[currentQuestion].isNew = false;
      options[currentQuestion].question = question;
      options[currentQuestion].answers = answers;

      console.log(createQuizDetailRes.data.createQuizDetail);

      resetData();
      const newOpt1 = {
        questionId: 0,
        isNew: true,
        question: "",
        answers: [{}],
      };
      setCurrentQuestion(options.length);
      setOptions((options) => [...options, newOpt1]);
    }
  }, [createQuizDetailRes.data]);

  const insertQuestion = () => {
    //validasi

    //ambil data

    const answers = [
      {
        optionDescription: answerA,
        isAnswer: false,
      },
      {
        optionDescription: answerB,
        isAnswer: false,
      },
      {
        optionDescription: answerC,
        isAnswer: false,
      },
      {
        optionDescription: answerD,
        isAnswer: false,
      },
    ];

    if (selectedAnswer == "A") {
      answers[0].isAnswer = true;
    } else if (selectedAnswer == "B") {
      answers[1].isAnswer = true;
    } else if (selectedAnswer == "C") {
      answers[2].isAnswer = true;
    } else if (selectedAnswer == "D") {
      answers[3].isAnswer = true;
    }

    const createQuizDetailData = {
      questionDescription: question,
      options: answers,
    };
    createQuizDetail({
      variables: {
        createQuizDetailData: createQuizDetailData,
        quizId: quizId,
      },
    });
  };

  const updateAnswer = (str) => {
    setSelectedAnswer(str);
  };

  useEffect(() => {
    setOptions([newOpt1]);
    reloadData();
  }, [quizId]);
  //SOCKET

  const generateRoomId = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  };

  const createRoom = () => {
    //generate RoomId
    const ROOM_ID = generateRoomId();
    socket.emit("create_room", {
      roomId: ROOM_ID,
      hostId: user,
      isStarted: false,
      quizId : quizId
    });
  };

  useEffect(() => {
    socket.on("create_room_feedback", (data) => {
      if (data) {
        let quizFinalName = getSessionStorageOrDefault("quizName", "");
        //kalau room dah dibuat host bakal kemana
        console.log("CREATE ROOM SUCCESS");
        navigate("/quiz-participants", {
          state: {
            quizName: quizFinalName,
            roomId: data.roomId,
            quizId: quizId,
          },
        });
      } else {
        //kalau gagal buat room.
        console.log("CREATE ROOM ERROR");
      }
    });

    socket.on("room_exist", (data) => {
      if (data) {
        console.log("ROOM ID USED...");
        console.log("GENERATING NEW ROOM...");
        createRoom();
      }
    });
  }, [socket]);
  //ENDSOCKET
  return (
    <div className="h-screen flex overflow-hidden bg-indigo-900">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {options.map((item) => (
                    <button
                      type="button"
                      key={item.isNew ? null : item.questionID}
                      onClick={() => {
                        updateUI(item);
                      }}
                      className="flex content-center justify-center w-3/4 py-5 my-3 border border-transparent text-2xl font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
                    >
                      {options.indexOf(item) + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar htmlFor desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col flex-center content-center justify-center w-32">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white shadow-md">
            <div className="flex-1 content-center justify-center overflow-y-auto bg-indigo-900 mostly-customized-scrollbar">
              <nav className="flex flex-col content-center items-center justify-center bg-indigo-900">
                {options.map((item) => (
                  <button
                    type="button"
                    key={item.isNew ? null : item.questionID}
                    onClick={() => {
                      updateUI(item);
                    }}
                    className="flex content-center justify-center w-3/4 py-5 my-3 border border-transparent text-2xl font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
                  >
                    {options.indexOf(item) + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden w-full">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-indigo-800 w-full">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-full inline-flex items-center justify-center rounded-md text-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-indigo-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
            <h1 className="w-full">Select a Question</h1>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 h-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex">
              <h1 className="inline-flex items-center justify-center px-2.5 py-3 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic bg-indigo-600 w-full h-full drop-shadow-md lg:text-5xl md:text-5xl text-2xl">
                {quizName} Quiz
              </h1>
              <button
                type="button"
                className="justify-end items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-4"
                onClick={() => createRoom()}
              >
                Start
              </button>
            </div>
            <div className="flex content-center mt-6 w-full h-full mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}

              <div className="flex flex-col content-center sm:justify-center pt-4 overflow-y-scroll overflow-x-hidden rounded-lg shadow-xl bg-indigo-600 h-5/6 w-full sm:pt-2 sm:pt-10">
                <div className="px-4 pt-5 sm:px-6 flex-col sm:flex sm:flex-row justify-between content-center">
                  <div>
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Answer
                    </h3>
                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-xl  flex dark:bg-gray-700 dark:text-white shadow-lg">
                      <li className="w-full bg-indigo-700 ">
                        <div className="flex items-center pl-3">
                          <input
                            id="horizontal-list-radio-license"
                            type="radio"
                            value="A"
                            checked={selectedAnswer == "A"}
                            onChange={() => {
                              updateAnswer("A");
                            }}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-license"
                            className="py-3 px-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            A{" "}
                          </label>
                        </div>
                      </li>
                      <li className="w-full bg-indigo-700 ">
                        <div className="flex items-center pl-3">
                          <input
                            id="horizontal-list-radio-id"
                            type="radio"
                            value="B"
                            checked={selectedAnswer == "B"}
                            onChange={() => {
                              updateAnswer("B");
                            }}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-id"
                            className="py-3 px-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            B
                          </label>
                        </div>
                      </li>
                      <li className="w-full bg-indigo-700 ">
                        <div className="flex items-center pl-3">
                          <input
                            id="horizontal-list-radio-millitary"
                            type="radio"
                            value="C"
                            checked={selectedAnswer == "C"}
                            onChange={() => {
                              updateAnswer("C");
                            }}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-millitary"
                            className="py-3 px-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            C
                          </label>
                        </div>
                      </li>
                      <li className="w-full bg-indigo-700 ">
                        <div className="flex items-center pl-3">
                          <input
                            id="horizontal-list-radio-passport"
                            type="radio"
                            value="D"
                            checked={selectedAnswer == "D"}
                            onChange={() => {
                              updateAnswer("D");
                            }}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-passport"
                            className="py-3 px-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            D
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="px-0 h-auto pt-5 sm:px-0 flex justify-between content-center">
                    {options[currentQuestion] === undefined ||
                    options[currentQuestion].isNew ? (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => {
                          insertQuestion();
                        }}
                      >
                        Add
                        <PlusIcon
                          className="ml-3 -mr-1 h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 mr-5 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          onClick={() => {
                            updateQuiz(options[currentQuestion]);
                          }}
                        >
                          Update
                          <SaveIcon
                            className="ml-3 -mr-1 h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            deleteItem(options[currentQuestion].questionId);
                          }}
                        >
                          Delete
                          <TrashIcon
                            className="ml-3 -mr-1 h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-6 sm:py-6 sm:px-6 h-2/5">
                  <div className="h-full">
                    <label
                      htmlFor="question"
                      className=" text-2xl font-extrabold text-white"
                    >
                      Question:
                    </label>
                    <textarea
                      name="question"
                      id="question"
                      className="shadow-sm text-center block w-full sm:text-xl font-bold border-gray-300 rounded-md h-full resize-none"
                      placeholder="Input your question here"
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                    />
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
                      <textarea
                        name="question"
                        id="question"
                        className="shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        placeholder="Input your Answer here"
                        value={answerA}
                        onChange={(e) => {
                          setAnswerA(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="question"
                        className=" text-2xl font-extrabold text-white pr-2"
                      >
                        B.
                      </label>
                      <textarea
                        name="question"
                        id="question"
                        className="shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md  resize-none"
                        placeholder="Input your Answer here"
                        value={answerB}
                        onChange={(e) => {
                          setAnswerB(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="question"
                        className=" text-2xl font-extrabold text-white pr-2"
                      >
                        C.
                      </label>
                      <textarea
                        name="question"
                        id="question"
                        className="shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        placeholder="Input your Answer here"
                        value={answerC}
                        onChange={(e) => {
                          setAnswerC(e.target.value);
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="question"
                        className=" text-2xl font-extrabold text-white pr-2"
                      >
                        D.
                      </label>

                      <textarea
                        name="question"
                        id="question"
                        className="shadow-sm text-center block w-full h-24 sm:text-xl font-bold  border-gray-300 rounded-md resize-none"
                        placeholder="Input your Answer here"
                        value={answerD}
                        onChange={(e) => {
                          setAnswerD(e.target.value);
                        }}
                      />
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
  );
}
