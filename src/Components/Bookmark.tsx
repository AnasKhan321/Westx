import { useAuth } from "../Context/AuthContext";
import Authrequired from "../ReusableComponents/Authrequired";
import BookMarks from "./BookMarkScroller";




const Bookmark = () => {

  const {isAuthenticated} = useAuth()
  


  return (
    <> 
      {isAuthenticated ? (
        <BookMarks/> 
      ) : (
        <Authrequired description="Save and revisit your favorite AI conversations anytime!"/>
      )}
   
    </>

  )
}

export default Bookmark