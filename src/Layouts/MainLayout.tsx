import Sidebar from "../ReusableComponents/SideBar";
import RightSidebar from "../Components/Explore";
import HorizontalBar from "../ReusableComponents/HorizontalBar";
import { Link, useLocation } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import { BsFire } from "react-icons/bs";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { live } = useSocket();
  return (
    <div className="grid grid-cols-14  bg-primaryColor text-secondary min-h-screen font-roboto  ">
      <div className=" hidden md:block bg-primaryColor  md:col-span-3  bg text-white max-h-screen min-h-screen ">
        <Sidebar />
      </div>

      <div className=" col-span-14  md:col-span-7  bg-primaryColor  min-h-screen max-h-screen overflow-y-scroll scroll-smooth">
        {children}
        <Link to={"/roastshow"}>
          <div className=" block md:hidden absolute  bg-white p-2  rounded-full top-[70vh] right-[30px]">
            <BsFire size={30} className="text-black" />
          </div>{" "}
        </Link>

        {!(location.pathname === "/roastshow" && live) ? (
          <div className="block h-[7vh]  md:hidden w-full  absolute bottom-[10px]  ">
            <HorizontalBar />
          </div>
        ) : null}
      </div>
      <div className="col-span-4  min-h-screen  hidden md:block max-h-screen overflow-y-scroll  bg-primaryColor  ">
        <RightSidebar />
      </div>
    </div>
  );
}
