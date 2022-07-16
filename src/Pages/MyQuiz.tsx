import { Transition, Dialog, Menu } from "@headlessui/react";
import { XIcon, MenuIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import Layout from "../Component/Layout";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";
import { getSessionStorageOrDefault } from "../Utils/useSessionStorage";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const GET_PERSON_QUIZ_LIST = gql`
mutation GetPersonQuizList($userId: Float!) {
    getPersonQuizList(userId: $userId) {
      id
      quizName
      createdAt
      updatedAt
      creatorId
      isStart
    }
  }
`;

const GET_USER_BY_USERNAME = gql`
mutation getUserByUsername($username : String!){
    getUserByUsername(username : $username){
      id
      userName
      userId
    }
  }
`


export default function MyQuiz(){

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navigation, setNavigation] = useState<any[]>([]); 
    const [doneQuiz, setDoneQuiz] = useState<any[]>([]);                         
    const [userQuiz, userQuizRes] = useMutation(GET_PERSON_QUIZ_LIST);
    const [userMutate, userMutateRes] = useMutation(GET_USER_BY_USERNAME);
    const [userId, setUserId] = useState(0)
    const navigate = useNavigate()

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
                variables:{
                    username : response.data.username
                }
            })
          });
      };

    useEffect(()=>{
        if (userMutateRes.data != undefined){
            console.log(userMutateRes.data.getUserByUsername.id);
            setUserId(userMutateRes.data.getUserByUsername.id);
        }
    }, [userMutateRes.data])

    
    useEffect(()=>{

        if (userId != 0){
            userQuiz({
                variables:{
                    userId : userId
                }
            })
        }
    }, [userId])

    useEffect(()=>{
        if (userQuizRes.data != undefined){
            // console.log(userQuizRes.data.getPersonQuizList)
            for (let i = 0; i<userQuizRes.data.getPersonQuizList.length; i++){
                let quizName = userQuizRes.data.getPersonQuizList[i].quizName;
                console.log(quizName + " " + quizName.length)
                if (quizName.length >= 10){
                    quizName = quizName.substring(0,10);
                    quizName += "...";
                }  

                let isStart = userQuizRes.data.getPersonQuizList[i].isStart;
                // console.log(isStart)
                let nav = {
                    name : quizName,
                    href : "#",
                    current : false,
                    quizId : userQuizRes.data.getPersonQuizList[i].id
                }

                if (isStart == true){
                    setNavigation(navigation => [...navigation, nav]);
                }
                else {
                    setDoneQuiz(doneQuiz => [...doneQuiz, nav]);
                }
            }
        }
    }, [userQuizRes.data])


    return (
        <>
            <Layout key="" page={"My Quiz"}>
            <div className="h-screen flex overflow-hidden bg-white">
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
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
                            {navigation.map((item) => (
                                <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current
                                    ? 'bg-green-100 text-green-900'
                                    : 'text-green-600 hover:bg-green-50 hover:text-green-900',
                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                )}
                                >
                                {item.name}
                                </a>
                            ))}
                            </nav>
                            <nav className="mt-5 px-2 space-y-1">
                            {doneQuiz.map((item) => (
                                <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current
                                    ? 'bg-red-100 text-red-900'
                                    : 'text-red-600 hover:bg-red-50 hover:text-red-900',
                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                )}
                                >
                                {item.name}
                                </a>
                            ))}
                            </nav>
                        </div>
                        </div>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:flex-shrink-0 bg-indigo-800">
                    <div className="flex flex-col flex-center w-64 ">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col h-0 flex-1 border-r border-gray-200">
                        <div className="flex-1 flex flex-col pt-5 pb-4 mostly-customized-scrollbar overflow-y-auto bg-indigo-700">
                            <h1 className="text-center text-white font-bold text-xl">
                                Unfinished Quiz
                            </h1>
                        <nav className="mt-5 flex-1 justify-center px-2 space-y-1 text-center bg-indigo-800">
                            {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className = "flex justify-center"
                            >
                                <button
                                type="button"
                                className="flex items-center px-5 py-3 m-2 my-4 border border-transparent text-base font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ">
                                {item.name}
                                </button>
                            </a>
                            ))}
                        </nav>
                        </div>
                        <div className="flex-1 flex flex-col pt-5 pb-4 mostly-customized-scrollbar overflow-y-auto bg-indigo-700">
                            <h1 className="text-center text-white font-bold text-xl">
                                Finished Quiz
                            </h1>
                        <nav className="mt-5 flex-1 justify-center px-2 space-y-1 text-center bg-indigo-800">
                            {doneQuiz.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className = "flex justify-center"
                            >
                                <button
                                type="button"
                                className="flex items-center px-5 py-3 m-2 my-4 border border-transparent text-base font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full ">
                                {item.name}
                                </button>
                            </a>
                            ))}
                        </nav>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-full inline-flex items-center justify-center rounded-md text-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-indigo-600"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
                        <h1 className="w-full">
                            Select a Quiz
                        </h1>
                    </button>
                    </div>
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <h1 className="text-2xl font-semibold text-gray-900">No Quiz Selected Yet...</h1>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        {/* Replace with your content */}
                        <div className="py-4">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                        </div>
                        {/* /End replace */}
                        </div>
                    </div>
                    </main>
                </div>
            </div>

            </Layout>
        </>
    )
}