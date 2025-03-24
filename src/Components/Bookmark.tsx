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
        <Authrequired/>
      )}
   
    </>

  )
}

export default Bookmark