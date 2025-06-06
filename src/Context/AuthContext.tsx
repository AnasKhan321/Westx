import {
  onAuthStateChanged,
  signInWithPopup,
  TwitterAuthProvider,
} from "firebase/auth";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth, twitterProvider } from "../firebaseF/firebaseConfig";
import { User } from "../utils/type";
import toast from "react-hot-toast";
import WestXLoader from "../ReusableComponents/WestXLoader";

function removeSize(url: string): string {
  return url.replace(/_\w+\./g, ".");
}

// Define the shape of your AuthContext
interface AuthContextType {
  handleTwitterLogin: () => void;
  handleLogout: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  islogin: boolean 
  isAuthenticated: boolean
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [islogin, setislogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = currentUser
      if (currentUser) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await fetch(
          `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getUser/v2/${user.reloadUserInfo.screenName
          }`
        );
        const data = await res.json();
        if (data.success) {

          setUser(data.data);
          setIsLoading(false);
          setIsAuthenticated(true)
          if (isLoading == false) {
            navigate("/")
            setIsAuthenticated(true)

          }
        } else {
          setIsLoading(false);
          navigate("/login")
          setIsAuthenticated(false)
        }





      } else {
        setIsLoading(false);
        setIsAuthenticated(false)

      }
    });
    return () => unsubscribe();
  }, []);

  const handleTwitterLogin = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await signInWithPopup(auth, twitterProvider);
      const creds = TwitterAuthProvider.credentialFromResult(result);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const signedUser = JSON.parse(
        result?._tokenResponse?.rawUserInfo ?? "{}"
      );

      const userData = {
        interests: "",
        theme: "light",
        totalPhotos: 0,
        totalTweets: 0,
        pinnedTweet: "",
        accent: "purple",
        id: result?.user?.uid ?? "",
        name: signedUser?.name ?? "",
        bio: signedUser?.description ?? "",
        twitterId: signedUser?.id_str ?? "",
        location: signedUser?.location ?? "",
        geoLocation: {
          latitude: "",
          longitude: ""
        },
        oauthToken: creds?.accessToken ?? "",
        oauthTokenSecret: creds?.secret ?? "",
        username: signedUser?.screen_name ?? "",
        verified: signedUser?.verified ?? false,
        isActive: false,
        isPremium: false,
        coverPhotoURL: removeSize(signedUser?.profile_banner_url ?? ""),
        photoURL: removeSize(signedUser?.profile_image_url_https ?? ""),
        website: signedUser?.entities?.url?.urls?.[0]?.expanded_url ?? "",
      };
      setislogin(true)

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/createuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const d = await res.json();


      setUser(d.user);
      setislogin(false)
      setIsAuthenticated(true)
      if (islogin == false) {
        navigate("/")
      }
    } catch (error) {
      toast.error("Please try again "  , {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
        
      });
      console.error("Error during Twitter login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false)
      navigate("/")
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (

      <WestXLoader />
    );
  }

  return (
    <AuthContext.Provider
      value={{ handleTwitterLogin, handleLogout, user, setUser, islogin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};



