import { useAuth } from "../Context/AuthContext";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import TweetCard from "../ReusableComponents/TweetCard";





const Bookmark = () => {
  const {user} = useAuth()
  

  

  return (
    <> 
    
    
        <ReuseableTitle title="Bookmarks" />
      <div className="mt-16 "></div>


      {user?.bookmarks.length == 0 && <>       {user?.bookmarks.length == 0  && <div className="text-2xl font-bold text-white mt-5 text-center "> 

You Don't Have any bookmark
</div> } </> }



      
      {user?.bookmarks && <> 
      
        {user?.bookmarks.map((bookmark)=>{
          return(
            <TweetCard tweet={bookmark.tweet} isBookmark={true} key={bookmark.id}/>
          )
        })}
      
      </> }
   
    </>

  )
}

export default Bookmark