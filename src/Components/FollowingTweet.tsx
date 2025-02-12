import React, { Suspense } from "react";
import Loader from "../ReusableComponents/Loader";


const MyComponent = React.lazy(() => import("./infiniteScroller4"));
const FollowingTweet = () => {
  return (
    <div>
            <Suspense fallback={<Loader/> }>
            <MyComponent/> 
            
            
            </Suspense>
    </div>
  )
}

export default FollowingTweet
