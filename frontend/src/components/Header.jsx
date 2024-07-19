import React, { useEffect } from "react";
import ButtonType2 from "./ButtonType2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import authService from "../backendRelated/authentication"
import { useNavigate } from "react-router-dom";
import { logout,login } from "../store/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Header() {
    const navigate=useNavigate()
    const dispach =useDispatch();
   

    
    
 
  const isAuthor = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
 
  const logoutBtn=()=>{
    authService.logout(userData.data.accessToken)
    navigate("/")
    dispach(logout())

  }
  useEffect(() => {
    
  
  }, [isAuthor])
  
    
  return (
    <div className="sticky top-0 z-10 bg-black inset-x-0 px-4 w-full border-b border-white">
      <div className="mx-auto flex max-w-7xl items-center py-2 justify-between">
        <Link to={"/"}>
        <img src="/image-removebg-preview.png" alt="" className="w-16 h-16" />
        </Link>
        <input
          type="text"
          className="w-96 h-10 bg-transparent border border-white px-3 hidden sm:block"
          placeholder="search"
        />{" "}
          <div className="text-2xl sm:hidden"> <FontAwesomeIcon icon={faBars}/></div>
        {/* put search icon*/}
        <div className="hidden sm:block"> 
          {!isAuthor && (
            <div className="flex gap-4 ">
                <Link to={"/login"}>
              <button
                className="text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-destructive-foreground shadow-sm h-12 rounded-md w-full bg-[#383737] px-3 py-2 hover:bg-[#474747] sm:w-auto sm:bg-transparent"
                
              >
                Log In
              </button>
              </Link>
              <Link to={"/signup"}>
                <ButtonType2 on>Sign Up</ButtonType2>
              </Link>
            </div>
          )}
          {isAuthor && (
            <div className="flex gap-4">
              <img
                src={userData.data.user.avatar}
                alt="avatar"
                className="h-12 w-12 rounded-full"
              />
              <ButtonType2 props={logoutBtn}>Sign Out</ButtonType2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
