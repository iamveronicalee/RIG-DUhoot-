import axios from "axios";
import React, {useEffect, useRef, useState} from "react"
import ReactSession from 'react-client-session';
import Homepage from "./Homepage";
import StellarBackground from "../Component/StellarBackground";
import { EncryptToBase64 } from "../Code/Encrypt";

export default function Login() {


  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  function fetchLecture(){
          // coba fetch dari si dosen

          const lectData = {
            username : usernameRef.current.value.toLowerCase(),
            password : EncryptToBase64(usernameRef.current.value.toLowerCase(),passwordRef.current.value)
          }

          axios.post('http://localhost:9000/login/lecturer', lectData).then((response) =>{

              let data = response.data.User;
              if (data == undefined){
                window.alert('user not found')
              }

          }).catch((error) =>{
            console.log(error)
          })
  }


  function handleLogin(e){
    e.preventDefault();

    const data = {
      username : usernameRef.current.value,
      password : passwordRef.current.value
    }    

    axios.post('http://localhost:9000/login', data )
    .then((response)=>{
        if (response.data.User == undefined){
          // usernya ga ketemu
          fetchLecture() 
        }
        else{
          // user ketemu
          console.log(response.data.User)

          ReactSession.setStoreType("localStorage");
          let obj = response.data.User;
          let email = obj.Emails[0] 
          let name = obj.Name;
          let role = obj.Role;
          let nim = obj.UserName;
          let userId = obj.UserId 
          ReactSession.set("email", email);
          ReactSession.set("name", name);
          ReactSession.set("role", role);
          ReactSession.set("nim", nim);
          ReactSession.set("userId", userId);
        }
    }).catch((error) =>{
      console.log(error)
    })
    
    
  }



    return (
      <div className="min-h-screen flex flex-col justify-center bg-blue-900 py-12 sm:px-6 lg:px-8">
        <StellarBackground/>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white pb-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex mb-4">
                <img className="h-24 mr-2" src="https://bluejack.binus.ac.id/prk/assets/ribbon.png"></img>
                <img className="h-20 pt-2 mt-2" src="https://bluejack.binus.ac.id/prk/assets/binus.png"></img>
            </div>

            <form className="space-y-6 relative" onSubmit={handleLogin}>
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
  