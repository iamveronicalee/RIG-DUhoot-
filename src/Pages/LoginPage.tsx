import axios from "axios";
import React, { useEffect, useState } from "react";
import StellarBackground from "../Component/StellarBackground";
import { EncryptToBase64 } from "../Code/Encrypt";
import {
  getSessionStorageOrDefault,
  useSessionStorage,
} from "../Utils/useSessionStorage";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../Component/ErrorAlert";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";

const LOGIN_RESPONSE = gql`
  mutation Mutation($userName: String!) {
    login(userName: $userName) {
      accessToken
    }
  }
`;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [accessToken, setAccessToken] = useSessionStorage("accessToken", "");
  const [getLoginResponse, getLoginResponseRes] = useMutation(LOGIN_RESPONSE);
  const [cookies, setCookie, removeCookie] = useCookies(["jid"]);

  useEffect(() => {
    const token = getSessionStorageOrDefault("accessToken", "");
    if (
      token != "" ||
      (Object.keys(cookies).length != 0 && cookies.jid != "")
    ) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (getLoginResponseRes.data) {
      const token = getLoginResponseRes.data.login.accessToken;
      setAccessToken(token);
      setCookie("jid", token, {
        path: "/",
      });
      navigate("/");
    }
  }, [getLoginResponseRes.data]);

  function loginResponse() {
    getLoginResponse({
      variables: {
        userName: username,
      },
    });
  }

  function fetchLecturer() {
    const lectData = {
      username: username.toLowerCase(),
      password: EncryptToBase64(username.toLowerCase(), password),
    };

    axios
      .post("http://localhost:9000/auth/login/lecturer", lectData)
      .then((response) => {
        let data = response.data;
        if (data.accessToken == undefined) {
          setErrorMessage("Authentication Failed!");
        } else {
          // lecturer found
          loginResponse();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:9000/auth/login", data)
      .then((response) => {
        let data = response.data;
        if (data.accessToken == undefined) {
          fetchLecturer();
        } else {
          // student found
          loginResponse();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-blue-900 py-12 sm:px-6 lg:px-8">
      <StellarBackground />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white pb-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex mb-4">
            <img
              className="h-24 mr-2"
              src="https://bluejack.binus.ac.id/prk/assets/ribbon.png"
            ></img>
            <img
              className="h-20 pt-2 mt-2"
              src="https://bluejack.binus.ac.id/prk/assets/binus.png"
            ></img>
          </div>

          <form className="space-y-6 relative" onSubmit={handleLogin}>
            {errorMessage !== "" ? (
              <ErrorAlert
                key=""
                errorMsg={errorMessage}
                dismiss={(e) => setErrorMessage(e)}
              />
            ) : (
              <div></div>
            )}
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                NIM
              </label>
              <div className="mt-1">
                <input
                  id="text"
                  name="text"
                  type="text"
                  autoComplete="text"
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
