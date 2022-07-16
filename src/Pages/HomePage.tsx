import { LinkIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import Layout from "../Component/Layout";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionStorageOrDefault } from "../Utils/useSessionStorage";
const GET_USER_BY_USERNAME = gql`
  mutation getUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      id
      userName
      userId
    }
  }
`;
const JOIN_QUIZ = gql`
  mutation CreateQuizParticipant($participantId: Float!, $quizId: Float!) {
    createQuizParticipant(participantId: $participantId, quizId: $quizId)
  }
`;

export default function HomePage() {
  const [userMutate, userMutateRes] = useMutation(GET_USER_BY_USERNAME);
  const [joinQuizQuery, joinQuizRes] = useMutation(JOIN_QUIZ);
  const [userId, setUserId] = useState(0);
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState(0);

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
          variables: {
            username: response.data.username,
          },
        });
      });
  };

  useEffect(() => {
    if (userMutateRes.data != undefined) {
      console.log(userMutateRes.data.getUserByUsername.id);
      setUserId(userMutateRes.data.getUserByUsername.id);
    }
  }, [userMutateRes.data]);

  const joinQuiz = (e) => {
    e.preventDefault();
    joinQuizQuery({
      variables: {
        participantId: userId,
        quizId: quizId,
      },
    });

    // console.log("successfully added new")
  };

  useEffect(() => {
    if (joinQuizRes.data != undefined) {
      if (joinQuizRes.data.createQuizParticipant == false) {
        console.log("eror gabisa join");
      }
    }
  }, [joinQuizRes.data]);

  return (
    <>
      <Layout key="" page={"Join a Quiz"}>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto ">
            {/* Replace with your content */}
            <div className="min-h-screen flex items-center justify-center bg-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Join Quiz
                  </h2>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="quiz-code" className="sr-only">
                        Quiz Code
                      </label>
                      <input
                        id="quiz-code"
                        name="quiz-code"
                        type="number"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md font-bold text-center"
                        placeholder="Enter Quiz Code"
                        onChange={(e) => setQuizId(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => joinQuiz(event)}
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LinkIcon
                          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                          aria-hidden="true"
                        />
                      </span>
                      Join
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </Layout>
    </>
  );
}
