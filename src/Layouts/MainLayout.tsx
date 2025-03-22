import Sidebar from "../ReusableComponents/SideBar";
import RightSidebar from "../Components/Explore";
import HorizontalBar from "../ReusableComponents/HorizontalBar";
import {  useLocation } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
// import { BsFire } from "react-icons/bs";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { live } = useSocket();
  return (
    <div className="grid grid-cols-14  bg-primaryColor text-secondary min-h-screen font-roboto  ">
      <div className=" hidden tablet:block bg-primaryColor  md:col-span-3  bg text-white max-h-screen min-h-screen ">
        <Sidebar />
      </div>

      <div className=" col-span-14  md:col-span-14 tablet:col-span-7  bg-primaryColor  min-h-screen max-h-screen overflow-y-scroll scroll-smooth">
        {children}
        {/* <Link to={"/roastshow"}>
          <div className=" block md:hidden fixed  bg-white p-2  rounded-full top-[75vh] right-[30px]">
            <BsFire size={30} className="text-black" />
          </div>{" "}
        </Link> */}

        {!(location.pathname === "/roastshow" && live) ? (
          <div className="block h-[8vh]  tablet:hidden w-full  fixed bottom-0  ">
            <HorizontalBar />
          </div>
        ) : null}
      </div>
      <div className="   tablet:col-span-4    min-h-screen  hidden tablet:block max-h-screen overflow-y-scroll  bg-primaryColor  ">
        <RightSidebar />
      </div>
    </div>
  );
}
