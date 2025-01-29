import React from "react";
import { useAuth } from "../Context/AuthContext";
import { ColorRing } from "react-loader-spinner";

const Login: React.FC = () => {
  const { handleTwitterLogin  , islogin } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-territary to-black text-secondary">
      <div className="bg-secondary shadow-2xl rounded-lg max-w-[22rem]  p-5  md:p-10  md:max-w-lg w-full text-center border border-borderColor">
        <div className="flex flex-col items-center">
          <img
            src="https://codewithbat.s3.ap-south-1.amazonaws.com/logo-round.png"
            alt="WestX Logo"
            className=" w-[75px]  h-[75px] md:w-[150px] md:h-[150px] mb-6"
          />
          <h1 className=" text-xl  md:text-4xl font-bold text-primary mb-2">
            Welcome to WestX
          </h1>
          <p className=" text-base md:text-lg text-territary font-medium mb-8">
            The world's first AI social media
          </p>
        </div>
        <p className="text-gray-600 text-sm mb-10">
          Revolutionize the way you connect with the world. Join the community
          powered by artificial intelligence.
        </p>
        <button
          onClick={handleTwitterLogin}
          className="flex items-center justify-center w-full py-3 px-6 bg-territary hover:bg-purple-800 text-white font-medium rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.46 6.11c-.83.37-1.73.62-2.67.73a4.65 4.65 0 0 0 2.04-2.57 9.31 9.31 0 0 1-2.94 1.13 4.65 4.65 0 0 0-7.92 4.24 13.2 13.2 0 0 1-9.58-4.85 4.66 4.66 0 0 0 1.44 6.2c-.73-.02-1.43-.22-2.03-.56v.05c0 2.22 1.58 4.08 3.68 4.51-.38.1-.78.15-1.19.15-.29 0-.57-.03-.84-.08a4.65 4.65 0 0 0 4.34 3.22A9.34 9.34 0 0 1 2 19.47a13.17 13.17 0 0 0 7.13 2.09c8.56 0 13.24-7.09 13.24-13.24v-.6a9.46 9.46 0 0 0 2.33-2.41c-.86.38-1.8.64-2.79.76z" />
          </svg>
          Continue with X
        </button>

        {islogin && <div className="flex text-center mt-2  justify-center items-center">          <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={["#9915eb"  ,  "#9915eb" , "#9915eb" , "#9915eb" , "#9915eb"]}
                />  </div> }
        <p className="text-sm text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-territary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-territary hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
   
    </div>
  );
};

export default Login;
