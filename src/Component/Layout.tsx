/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  LinkIcon,
  FolderAddIcon,
  MenuIcon,
  XIcon,
  CollectionIcon,
  ClockIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";
import { getSessionStorageOrDefault } from "../Utils/useSessionStorage";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CREATE_QUIZ = gql`
  mutation createQuiz($data: CreateQuizInput!) {
    createQuiz(data: $data) {
      id,
      quizName
    }
  }
`;

const navigation = [
  { name: "Join a Quiz", href: "#", icon: LinkIcon, current: true},
  { name: "Create New Quiz", href: "#", icon: FolderAddIcon, current: false },
  { name: "My Quiz", href: "", icon: CollectionIcon, current: false },
  { name: "Quiz History", href: "#", icon: ClockIcon, current: false },
  { name: "Sign Out", href: "#", icon: LogoutIcon, current: false },
];

const path = window.location.href;
var pathName = "";

if (path == "http://localhost:3000/quiz-history#" || path == "http://localhost:3000/quiz-history"){
  pathName = "Quiz History";
}
else if (path == "http://localhost:3000/my-quiz#" || path == "http://localhost:3000/my-quiz"){
  pathName = "My Quiz"
}
else if (path == "http://localhost:3000/#" || path == "http://localhost:3000/"){
  pathName = "Join a Quiz"
}
else if (path == "http://localhost:3000/create-quiz#" || path == "http://localhost:3000/create-quiz"){
  pathName = "Create New Quiz"
}

const refreshCurrent = (pageName)=>{
  for (let i = 0; i < navigation.length; i++) {
    if (navigation[i].name == pageName) {
      navigation[i].current = true;
    }
    else{
      navigation[i].current = false;
    }
  }
}

refreshCurrent(pathName)

export default function Layout(props, { children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newQuizModalOpen, setNewQuizModalOpen] = useState(false);
  const [newQuizName, setNewQuizName] = useState("");
  const [createQuiz, createQuizRes] = useMutation(CREATE_QUIZ);
  const [disableCreateQuiz, setDisableCreateQuiz] = useState(true);

  const [user, setUser] = useState("");
  
  const navigate = useNavigate();

  const createNewQuizButtonRef = useRef();


  useEffect(()=>{
   refreshCurrent(props.page)
  },[])


  useEffect(() => {
    const token = getSessionStorageOrDefault("accessToken", "");
    if (token == "") {
      navigate("/auth/login");
    } else {
      fetchUser(token);
    }
  }, []);


  useEffect(() => {

    if (createQuizRes.data) {
      navigate("/create-quiz", {state : createQuizRes.data})
    }
  }, [createQuizRes.data]);

  const fetchUser = (token) => {
    axios
      .get("http://localhost:9000/auth/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setUser(response.data.username);
      });
  };

  const clickMenu = (name) => {
    if (name == "Create New Quiz") {
      setNewQuizModalOpen(true);
      setSidebarOpen(false);
    }
    else if (name == "Join a Quiz"){
      navigate("/")
    }
    else if (name == "My Quiz"){
      myQuiz();
    }
    else if (name == "Quiz History"){
      quizHistory();
    }
    else if (name == "Sign Out"){
      signOut();
    }
  };

  const createNewQuiz = () => {
    setNewQuizModalOpen(false);
    const input = {
      quizName: newQuizName,
      creatorUserName: user,
    };
    createQuiz({
      variables: {
        data: input,
      },
    });
  };


  const myQuiz = ()=>{
    // console.log("Tes")
    navigate("/my-quiz")
  }

  const quizHistory = () =>{
    navigate("/quiz-history")
  }

  const signOut = () =>{

  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-700">
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
                <div className="flex-shrink-0 flex items-center px-4 font-duhoot font-black text-5xl text-white italic">
                  DUhoot!
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    let handleClick = () => {
                      if(item.name == "Create New Quiz" && pathName == "Create New Quiz"){return}
                      clickMenu(item.name);
                    };
                    return (
                      <a
                        key={item.name}
                        // href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-blue-800 text-white"
                            : "text-white hover:bg-blue-600 hover:bg-opacity-75",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                        onClick={handleClick}
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 text-blue-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
                <a href="#" className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">
                        Tom Cook
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* New Quiz Modal */}
      <Transition.Root show={newQuizModalOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={createNewQuizButtonRef}
          open={newQuizModalOpen}
          onClose={setNewQuizModalOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Create New Quiz
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please Enter Quiz Name
                      </p>
                    </div>

                    <div className="mt-3">
                      <input
                        id="quiz-name"
                        name="quiz-name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Quiz Name"
                        onChange={(e) => {
                          setNewQuizName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={createNewQuiz}
                    ref={createNewQuizButtonRef}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setNewQuizModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-blue-700 md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 font-duhoot font-black text-5xl text-white italic">
                DUhoot!
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  let handleClick = () => {
                    clickMenu(item.name);
                  };
                  return (
                    <a
                      key={item.name}
                      // href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-blue-800 text-white"
                          : "text-white hover:bg-blue-600 hover:bg-opacity-75",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                      onClick={handleClick}
                    >
                      <item.icon
                        className="mr-3 h-6 w-6 text-blue-300"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <a href="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Tom Cook</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* Page Content */}
        {props.children}
      </div>
    </div>
  );
}
