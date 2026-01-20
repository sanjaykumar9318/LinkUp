import React, { useEffect } from "react";
import {Loader} from "lucide-react"
import { Routes, Route ,Navigate} from "react-router-dom";
import useAuthStore from "./store/useAuthStore"
import Navbar from "./components/Navbar";
import {Toaster} from "react-hot-toast"

import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Profilepage from "./pages/Profilepage";
import Settingspage from "./pages/Settingspage";


function App() {
  const {authUser,isCheckingAuth,checkAuth} = useAuthStore()
  useEffect(()=>{checkAuth()},[checkAuth])
  console.log(authUser)
  if(isCheckingAuth && !authUser) return(
    <>
    <Loader />
    </>
  )
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <Homepage />: <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <Loginpage />: <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <Signuppage />: <Navigate to="/"/>} />
        <Route path="/profile" element={authUser ? <Profilepage />:<Navigate to="/login"/>}/>
        <Route path="/settings" element={<Settingspage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
