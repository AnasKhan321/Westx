import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Followings } from "../utils/apicalls";
import { IoCaretBack } from "react-icons/io5";
import React, { Suspense, useEffect, useRef } from "react";
import PersonaLoading from "../ReusableComponents/PersonaLoading";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";


const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));


const getUserFollowing = async ({ userid, pageparam }: { userid: string, pageparam: number }) => {
  const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/following/${userid}/${pageparam}`)
  const data = await res.json();
  console.log(data)
  console.log(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/following/${userid}/${pageparam}`)
  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageparam + 1 : undefined, // Stop pagination when no more data
  }
}

const Following = () => {
  const { username } = useParams();
  const navigate = useNavigate()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`USER:FOLLOWING:${username}`],
    queryFn: ({ pageParam }) => getUserFollowing({ pageparam: pageParam, userid: username as string }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Ensure no extra fetch
    initialPageParam: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {

        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {

          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.5 } // 👈 Trigger earlier
    );

    const currentRef = bottomRef.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleClick = () => {
    navigate(-1)
  }

  if (status === 'error') return <p className="text-center text-gray-200 my-4 font-bold text-xl  ">Internal Server Error</p>
  if (status == 'pending') return <div className="mt-4">
    <Loader2 fullScreen={true} />
  </div>

  return (
    <div className="md:min-h-[96vh]  md:max-h-[96vh]  md:my-[2vh] bg-primaryColor md:bg-secondaryColor overflow-y-scroll rounded-xl border border-white/10 ">
          <SEO title={ `Followers - ${username} `} description={"Followers page where you can see all your followers"} />
          <div className="flex   absolute p-4 items-center space-x-2   backdrop-blur-xl     bg-secondaryColor/20 w-full  md:w-[49.8%]  md:rounded-xl font-bold   ">
          <IoCaretBack
            className="text-xl cursor-pointer"
            onClick={handleClick}
        
          />
          <span>Following</span>
        </div>
      <>
      <div className="mt-12"></div>
        {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
          <p className="text-center text-gray-200 my-4 font-bold text-xl mt-16  ">No  Followings to show.</p>
        ) : (
          data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.length == 0 && <> <div className='py-8 text-center font-bold text-xl'>  No more Followings  </div>  </>}
              {group?.data?.map((user : Followings) => (
                <Suspense
                  key={user.id}  // ✅ Key should be on Suspense, not inside it
                  fallback={

                  <PersonaLoading/>

                  }
                >
                <UserCard user={user.following} />
                </Suspense>
              ))}
            </React.Fragment>
          ))
        )}

        {/* Invisible div to track scrolling and auto-load new data */}
        <div ref={bottomRef} className="h-[40px]" />

        {isFetchingNextPage && (

          <div className=" flex justify-center items-start h-[14vh] ">
            <Loader2 />
          </div>


        )}
      </>

    </div>
  )
};

export default Following;