import React, { useEffect, useRef, useState } from "react";
import { useSessionStorage, getSessionStorageOrDefault } from "../Utils/useSessionStorage";
import {useNavigate} from "react-router-dom"
export default function HomePage() {
  const navigate = useNavigate();
  const [userSession, setUserSesison] = useState(getSessionStorageOrDefault("userId", "") ?? "")

  useEffect(() => {
    if(userSession === "") {
      navigate('/auth/login')
    }
  }, []);
  
  return <div>lalala</div>;
}
