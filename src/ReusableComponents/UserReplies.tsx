import { useQuery } from "@tanstack/react-query";
import { getUserReplies } from "../utils/apicalls";
import Loader from "./Loader";

import Reply2 from "./Reply2";
import Tweet4 from "./TweetCard4";
import { User2 } from "../utils/type";

const UserReplies = ({ user }: { user : User2 }) => {
  const { isLoading, data, isError } = useQuery({
    queryKey: [`user:replies:${user.id}`],
    queryFn: () => getUserReplies(user.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });



  return (
    <div>
      {isError && (
        <div className="p-4 text-xl font-bold text-center">
          {" "}
          Something Went Wrong !{" "}
        </div>
      )}
      {isLoading && <Loader />}
      {data?.success && (
        <>
          {data.data.length == 0 && (
            <div className="text-center font-bold text-xl text-white p-4 ">
              {" "}
              He doesn't Have any Replies{" "}
            </div>
          )}

        </>
      )}
      {data?.data.map((item  , index) => {
        return (
          <div className="border-b border-gray-700 py-4  " key={index}>
            {item.parentTweetId && <Tweet4 createdAt={item.parentTweet?.createdAt as Date} photoURL={item.parentTweet?.user.photoURL as string } tweetid={item.parentTweet?.id as string} content={item.parentTweet?.text as string} username={item.parentTweet?.user.username as string} date={""}  name={item.parentTweet?.user.name as string} />  }
        
            <Reply2
              content={item.text as string}
              replyid ={item.id}
              username={user.username}
              date={item.createdAt}
              name={user.name}
              photoURL={user.photoURL}
              createdAt={item.createdAt}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UserReplies;
