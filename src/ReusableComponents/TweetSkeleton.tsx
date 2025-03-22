const TweetSkeleton = () => {
  return (
    <div className=" text-white p-4   md:w-[96%] w-full mx-auto">

      {[...Array(10)].map((_, index) => (
       <TwitterSkeletonComponent key={index}/>
      ))}
    </div>
  );
};


export const TwitterSkeletonComponent = ()=>{
    return(
        <div
       
        className="border-b w-full grid grid-cols-18 border-gray-800 py-4 animate-pulse"
      >
        <div className="flex gap-3 col-span-3   tablet:col-span-3 md:col-span-2  xl:col-span-2 3xl:col-span-1">
          <div className="w-12 h-12 mt-4 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex  justify-between  tablet:col-span-15 md:col-span-16 col-span-15  xl:col-span-16 3xl:col-span-17 items-center mt-4 w-5/5">
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mt-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mt-2"></div>
            <div className="flex w-full md:w-[60%]  mt-5 justify-between">
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
}


export default TweetSkeleton;
