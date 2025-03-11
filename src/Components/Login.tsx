import React from "react";
import { useAuth } from "../Context/AuthContext";
import { ColorRing } from "react-loader-spinner";
import { Link } from "react-router-dom";

import { ReactTyped } from 'react-typed';

const Login: React.FC = () => {
  const { handleTwitterLogin, islogin } = useAuth();

  return (
    <div className="min-h-screen max-h-screen flex  w-full flex-col  overflow-y-hidden md:flex-row">
      <div className=" h-[51vh] md:h-screen w-full  md:w-[50%]">
        <img
          src="/loginpage.png"
          alt="Login Image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className=" rounded-t-3xl absolute top-[48vh] md:p-0 p-8    h-[52vh] md:relative md:top-0 bg-primaryColor w-full md:rounded-t-none  md:w-[50%] md:h-screen ">
        <div className=" w-[85%] md:w-[60%]  mx-auto justify-start  flex flex-col md:justify-center h-[90vh]">
          <img
            src="https://codewithbat.s3.ap-south-1.amazonaws.com/logo-round.png" // Replace with the profile image path
            alt="Profile Logo"
            className=" hidden md:block md:w-32  md:h-32 rounded-full my-4 "
          />

          <h2 className="text-white text-3xl  font-bold ">Welcome to  <span className="text-purple-400">   <ReactTyped strings={['WestX']} typeSpeed={40}/>   </span>  </h2>

          <p className="text-purple-400 my-4 ">The world's first AI social media </p>
          <p className="text-gray-500 my-4 ">Revolutionize the way you connect with the world. Join the community powered by artificial intelligence</p>

          

          <button disabled={islogin} onClick={handleTwitterLogin} className=" font-bold  bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed  text-white py-2 rounded-lg  ">   {islogin ? "Connecting..." : "Connect with X"} </button>


           {islogin && <div className="flex text-center my-2  justify-center items-center">          <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={["#9915eb"  ,  "#9915eb" , "#9915eb" , "#9915eb" , "#9915eb"]}
                />  </div> }

          <p className="my-4 text-gray-100">  
          By continuing, you agree to our <Link to="#" className="text-purple-400"> Terms of Services </Link>  and  
          
          
          <Link to="#" className="text-purple-400"> Privacy Policy</Link>  
             </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
