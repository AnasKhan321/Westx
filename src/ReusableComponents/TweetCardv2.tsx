import { Tweet2 } from "../utils/type"
import { DynamicText } from "./DynamicText"
import { Link } from "react-router-dom"
import { timeSince } from "../utils/date"
import { useQuery } from "@tanstack/react-query"
import { getBookmarks, getReposts, getTweetLike } from "../utils/apicalls"
import { BiHeart, BiMessageRounded, BiRepost } from "react-icons/bi"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useAuth } from "../Context/AuthContext"
import { DeleteBookmark, DeleteLike, DeleteRepost } from "../utils/deletioncall"
import { addLike, CreateBookmark, CreateRepost } from "../utils/creationcall"
import toast from "react-hot-toast"
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import SmallLoader from "./SmallLoader"


const TweetCardv2 = ({tweet}  : {tweet : Tweet2}) => {

    const {user}  =useAuth() 
    const {data : bookmarkData    , isLoading: bookmarkloading}  = useQuery({queryKey : [`bookmark:${tweet.id}`]   , queryFn : ()=> getBookmarks(tweet.id)  , 


      staleTime: Infinity, 
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
     })
    const {data : likedata ,  isLoading:likeloading}  = useQuery({queryKey : [`likes:${tweet.id}`]   , queryFn : ()=> getTweetLike(tweet.id)  , 

      staleTime: Infinity, 
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
     })
    const {data : repostdata  , isLoading : repostloading}  = useQuery({queryKey : [`Repost:${tweet.id}`]  , queryFn : ()=> getReposts(tweet.id)  , 
      staleTime: Infinity, 
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
     } )



      const [reposts , setreposts]  = useState(repostdata?.data?.length)
      const [likes , setlikes ]  = useState(likedata?.data?.length)
      const [bookmarks , setbookmarks ]  = useState(bookmarkData?.data?.length)
    
      const [islike , setislike]  = useState(user?.likes.some((like) => like.tweetid === tweet.id))
      const [isBookmarked , setisBookmarked]  = useState(user?.bookmarks.some((bookmark) => bookmark.tweetid === tweet.id) )
      const [isreposted , setisreposted]  = useState(user?.Repost.some((repost)=> repost.tweetid === tweet.id) )



      const handleAddBookmark = async () => {
        setisBookmarked(true)
        console.log("this is here")
     
        if(bookmarks !== undefined){
          setbookmarks(bookmarks+1)

        }
       

       
        const response = await CreateBookmark({
          userid: user?.id as string,
          tweetid: tweet.id,
        });
        if (response?.success) {
          toast.success("BookMark added Successfully");

        }
      };
    
      const removeBookmark = async () => {
        setisBookmarked(false)
        if(bookmarks != undefined){
          setbookmarks(bookmarks-1)
          if(bookmarkData?.data?.length){
            bookmarkData.data.length-=1;
          }

        }
        const response = await  DeleteBookmark({userid : user?.id as string , tweetid : tweet.id})
        if(response?.success){
          toast.success("Removed Bookmark")

          
        }
      };
    
      const AddLike = async () => {
        setislike(true)
        if(likes != undefined){
          setlikes(likes+1)
          if(likedata?.data?.length){
            likedata.data.length+=1;
          }

        }
        const response = await addLike({
          tweetid: tweet.id,
          userid: user?.id as string,
        });
  
        if (response?.success) {
          toast.success("Liked!");
          setislike(true)
          if(likes){
            setlikes(likes+1)

          }
        }
      };
    
      const removeLike = async () => {
        setislike(false)
        if(likes != undefined){
          setlikes(likes-1)
          if(likedata?.data?.length){
            likedata.data.length-=1;
          }

        }
        const response = await DeleteLike({userid : user?.id as string , tweetid : tweet.id})
        setislike(false)
        if(response?.success){
          toast.success("Removed Like")
   
        }
      };
    
      const addRepost = async () => {
        setisreposted(true)
        if(reposts!= undefined){
          setreposts(reposts+1)

        }
        const response = await CreateRepost({
          tweetid: tweet.id,
          userid: user?.id as string,
        });

        if(reposts){
          setreposts(reposts+1)

        }
        if (response?.success) {

          toast.success("Reposted !");
        }
      };
    
    
      const removeRepost = async()=>{
        setisreposted(false)
        if(reposts != undefined){
          setreposts(reposts-1)

        }
        const response = await DeleteRepost({tweetid : tweet.id , userid : user?.id as string})
        
        if(reposts){
          setreposts(reposts-1)

        }
        if (response?.success) {

          toast.success("Remove Reposted")
        }
      }

      useEffect(()=>{
        if(bookmarkData?.data){
          setbookmarks(bookmarkData.data.length)
        }
      },[bookmarkData?.data])



      useEffect(()=>{
        if(likedata?.data){
          setlikes(likedata.data.length)
        }
      },[likedata?.data])



      useEffect(()=>{
        if(repostdata?.data){
          setreposts(repostdata.data.length)
        }
      },[repostdata?.data])





  return (
    <div className="bg-black text-white w-full  mx-auto p-4 rounded-lg border-b border-borderColor ">
      {/* Header */}

      <Link to={`/tweet/${tweet.id}`}>
        <div className="flex items-start space-x-3">

        <LazyLoadImage
      src={tweet.user.photoURL}
      alt="Lazy Loaded Image"
      effect="blur" // Other options: 'opacity', 'black-and-white'
      width={100}
      height={100}
      className="rounded-full"
             
    />

          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/user/${tweet.user.username}`}>
                {" "}
                <div className="flex items-center gap-x-2">
                  <span className=" text-sm md:text-base font-bold  hover:underline">
                    {tweet.user.name}
                  </span>{" "}
                  {tweet.user.isPremium && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#db12ff"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </Link>
              <Link to={`/user/${tweet.user.username}`}>
                {" "}
                <span className="text-sm  text-gray-400 md:text-base ">{tweet.user.username} · </span>
                <span className="text-sm text-gray-400  md:text-base ">
                  {" "}
                  {timeSince(tweet.createdAt)}{" "}
                </span>
              </Link>
            </div>
            <p><DynamicText text={tweet.text  as string}  postedBy="assistant"/></p>
          </div>
        </div>
      </Link>

   
      {tweet.image && (
        <div className="mt-4 flex items-center justify-center">
  
  <LazyLoadImage
      src={tweet.image}
      alt="Lazy Loaded Image"
      effect="blur" 
      width={500}
      height={350}
             
    />
        </div>
      )}




      <div className="flex items-center justify-between w-[90%] mx-auto   mt-8 text-xl text-gray-500">
        <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
          <BiMessageRounded className=" cursor-pointer  rounded-full p-2 group-hover:bg-blue-500/10   text-4xl " />
        </div>

      {repostloading?(<SmallLoader/>)  : (
        <> 
                {isreposted? (
          <div onClick={removeRepost}   className="flex gap-x-1 items-center" >
                       <span  className="text-sm">{reposts}</span>
            <BiRepost className="text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
          </div>
        ) : (
          <div  onClick={addRepost} className="flex gap-x-1 items-center">
            <span  className="text-sm">{reposts}</span>
                     
            <BiRepost className="hover:text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
          </div>
        )}
        </>
      )}


{likeloading? ( <SmallLoader/> )  : (
    <> 
            <div className="flex gap-x-1 group hover:text-red-500  transition-all  group items-center">
          {islike ? (
            <div onClick={removeLike}   className="flex gap-x-1 items-center" >
                       <span  className="text-sm">{likes}</span>
              <BiHeart className=" text-red-500 group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
            </div>
          ) : (
            <div onClick={AddLike}   className="flex gap-x-1 items-center" >
               <span  className="text-sm">{likes}</span>
              <BiHeart className="group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
            </div>
          )}
          {/* <span className="text-sm">27</span> */}
        </div>
    </>
) }

{bookmarkloading? (<SmallLoader/>)  : (
    <> 
        {isBookmarked ? (
            <div onClick={removeBookmark}   className="flex gap-x-1 items-center">
                  <span  className="text-sm">{bookmarks}</span>
              <FaBookmark className="text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
            </div>
          ) : (
            <div
              className="flex items-center gap-x-1  text-gray-500"
              onClick={handleAddBookmark}
            >
                  <span  className="text-sm">{bookmarks}</span>

              <FaRegBookmark className="hover:text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
            </div>
          )}
          </>
)}



  
      </div>





    </div>
  )
}

export default TweetCardv2