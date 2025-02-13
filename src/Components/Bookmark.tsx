import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import { getUserBookmark } from "../utils/apicalls";
import Loader from "../ReusableComponents/Loader";
import TweetCardBookmark from "../ReusableComponents/TweetCardBookmark";





const Bookmark = () => {
  const {user} = useAuth()
  

  const {data , isLoading }  = useQuery({queryKey : [`${user?.username}:bookmarks`]  , 
    queryFn : ()=> getUserBookmark(user?.id as string)
  })

  return (
    <> 
    
    
        <ReuseableTitle title="Bookmarks" />
      <div className="mt-16 "></div>
    {isLoading && <Loader/> }

      {data?.data.length== 0 && <>       {data.data.length == 0  && <div className="text-2xl font-bold text-white mt-5 text-center "> 

You Don't Have any bookmark
</div> } </> }



      
      {data?.data && <> 
      
        {data.data.map((bookmark)=>{
          return(
            <TweetCardBookmark key={bookmark.id} tweet={bookmark.tweet}/> 
          )
        })}
      
      </> }
   
    </>

  )
}

export default Bookmark