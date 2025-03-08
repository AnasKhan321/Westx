
const PersonaLoading = () => {
    return (
        <div className=" items-center grid grid-cols-12   p-4   text-white  rounded-lg w-full  font-roboto animate-pulse">
            {/* Avatar */}
            <div className="md:col-span-1 col-span-3 w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-4">

                <div className='h-10 w-10 bg-gray-700 rounded-full'></div>


            </div>
            {/* User Info */}
            <div className="md:col-span-10 col-span-9 flex-grow flex flex-col gap-y-2">
                <div className="font-bold flex gap-x-2 h-3 items-center bg-gray-700 w-[20%] ">         <span >

                </span>  </div>
                <div className="text-gray-400 text-sm bg-gray-700  h-3 w-[30%]  ">  </div>




            </div>

            <button className=" bg-gray-700  md:col-span-1  w-15 h-15 rounded-2xl">

            </button>




            <button className=" md:hidden  block  bg-primaryColor/50  transition-all    text-white  rounded-full font-bold text-sm hover:bg-white hover:text-black">

            </button>
        </div>
    )
}

export default PersonaLoading
