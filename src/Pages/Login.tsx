import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import StellarBackground from "../Component/StellarBackground";
import { EncryptToBase64 } from "../Code/Encrypt";
import { useSessionStorage } from '../Utils/useSessionStorage';
import { XCircleIcon, XIcon } from "@heroicons/react/solid";

export default function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useSessionStorage('userId', "");
  const [binusian, setBinusian] = useSessionStorage('binusianId', "");


  useEffect(() => {
    if (errorMessage == "") {
      document.getElementById("error-cont").style.display = "none";
    }
  });

  function fetchLecturer() {
    const lectData = {
      username: usernameRef.current.value.toLowerCase(),
      password: EncryptToBase64(
        usernameRef.current.value.toLowerCase(),
        passwordRef.current.value
      ),
    };

    axios
      .post("http://localhost:9000/login/lecturer", lectData)
      .then((response) => {
        let data = response.data.User;
        if (data == undefined) {
          setErrorMessage("Authentication Failed!");
          document.getElementById("error-cont").style.display = "block";
        } else { // lecturer found
          console.log(data);
          let obj = response.data.User;
          let binusianId = obj.BinusianId;
          setBinusian(binusianId)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    axios
      .post("http://localhost:9000/login", data)
      .then((response) => {
        let data = response.data.User 
        if (data == undefined) {
          fetchLecturer();
        } else { // student found
          console.log(response.data.User);
          let obj = response.data.User;
          let userId = obj.UserId;
          setUser(userId)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const dismissError = () => {
    document.getElementById("error-cont").style.display = "none";
  };

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
            <div className="rounded-md bg-red-50 p-4" id="error-cont">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p
                    className="text-sm font-medium text-red-700"
                    id="error-msg"
                  >
                    {errorMessage}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      id="dismiss-btn"
                      onClick={dismissError}
                      type="button"
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                  ref={usernameRef}
                  autoComplete="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  ref={passwordRef}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
