import Sidebar from "../ReusableComponents/SideBar";
import RightSidebar from "../Components/Explore";
import HorizontalBar from "../ReusableComponents/HorizontalBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 bg-primary text-secondary min-h-screen">
      <div className=" hidden md:block  md:col-span-3 bg text-white max-h-screen min-h-screen border-r border-borderColor">
        <Sidebar />
      </div>
      <div className=" col-span-12  md:col-span-5 max-h-screen min-h-screen overflow-y-scroll scroll-smooth">
        {children}

        <div className="block h-[7vh]  md:hidden w-full  absolute bottom-0 bg-black  border-t border-borderColor">
          <HorizontalBar />
        </div>
      </div>
      <div className="col-span-4  hidden md:block max-h-screen min-h-screen border-l border-borderColor">
        <RightSidebar />
      </div>
    </div>
  );
}
