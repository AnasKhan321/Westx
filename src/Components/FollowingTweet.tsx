import React, { Suspense } from "react";
import Loader2 from "../ReusableComponents/Loader2";


const MyComponent = React.lazy(() => import("./infiniteScroller4"));
const FollowingTweet = () => {
  return (
    <div>
            <Suspense fallback={<Loader2 fullScreen={true}/> }>
            <MyComponent/> 
            
            
            </Suspense>
    </div>
  )
}

export default FollowingTweet
