import React, { Suspense } from "react";
import Loader from "../ReusableComponents/Loader";
const MyComponent = React.lazy(() => import("./infiniteScroller3"));

export default function Home() {

  return (
    <>


      <Suspense fallback={<Loader/> }>
      
        <MyComponent />
      </Suspense>
    </>
  );
}
