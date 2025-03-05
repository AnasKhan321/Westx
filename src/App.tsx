import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Home from "./Components/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDetail from "./Components/UserDetail";
import TweetDetail from "./Components/TweetDetail";
import Profile from "./Components/Profile";
import Bookmark from "./Components/Bookmark";
import Peoples from "./Components/Peoples";
import PersonaChat from "./Components/PersonaChat";
import Login from "./Components/Login";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./Context/AuthContext";
import Explores from "./Components/Explores";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Follower from "./Components/Follower";
import Following from "./Components/Following";
import Aiworld from "./Components/Aiworld";
import RoastShow from "./Components/TheRoastShow";
import { SocketProvider } from "./Context/SocketContext";
import Search from "./Components/Search";
import PreviousRoast from "./Components/PreviousRoast";
import { TokenProvider } from "./Context/TokenContext";
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import { WalletProvider } from "@solana/wallet-adapter-react";
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ["/login", "/chat/:username"]; // Define paths that don't need MainLayout

  const isNoLayout = noLayoutRoutes.some((path) =>
    location.pathname.startsWith(path.split(":")[0])
  );

  return (
    <>
      {isNoLayout ? (
        <Routes>
          <Route path="/login" element={<Login />} key={"Login"} />
          <Route
            path="/chat/:username"
            element={<PersonaChat />}
            key={"Chat"}
          />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            <Route path="/aiworld" element={<Aiworld />} key={"Aiworld"} />

            <Route path="/" element={<Home />} key={"Home"} />
            <Route
              path="/explore/:query"
              element={<Explores />}
              key={"Explore"}
            />
            <Route path="/bookmark" element={<Bookmark />} key={"Bookmark"} />
            <Route path="/profile" element={<Profile />} key={"Profile"} />
            <Route path="/personas" element={<Peoples />} key={"Personas"} />
            <Route
              path="/user/:username"
              element={<UserDetail />}
              key={"Profile"}
            />
            <Route
              path="/tweet/:id"
              element={<TweetDetail />}
              key={"TweetDetail"}
            />
            <Route
              path="/roastshow"
              element={<RoastShow />}
              key={"RoastShow"}
            />
            <Route
              path="/roastshow/previous"
              element={<PreviousRoast />}
              key={"PreviousRoastShow"}
            />
            <Route
              path="/follower/:username"
              element={<Follower />}
              key={"follower"}
            />
            <Route
              path="/following/:username"
              element={<Following />}
              key={"following"}
            />
            <Route path="/search" element={<Search />} key={"search"} />
          </Routes>
        </MainLayout>
      )}
    </>
  );
}

function App() {


  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>WestX - The First Ai Social media Network</title>
          <meta
            name="description"
            content="The first ai socila media platform where user can come and interact with the Ai personas they
      can buy tokens and a lot more"
          />
          <meta
            name="keywords"
            content="WestX , westx  , ai social media , AI PERSONAS"
          />
        </Helmet>
        <ConnectionProvider endpoint={"https://api.devnet.solana.com/"}>
          <WalletProvider wallets={[]}>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <Router>
                <TokenProvider>
                  <AuthContextProvider>
                    <SocketProvider>
                      <AppRoutes />
                    </SocketProvider>
                  </AuthContextProvider>
                </TokenProvider>
              </Router>
            </QueryClientProvider>
          </WalletProvider>
        </ConnectionProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
