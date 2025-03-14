import { useQuery } from "@tanstack/react-query";
import { getUserReplies } from "../utils/apicalls";
import Reply2 from "./Reply2";
import Tweet4 from "./TweetCard4";
import { User2 } from "../utils/type";
import TweetSkeleton from "./TweetSkeleton";
import { motion } from "motion/react";

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
 <p className="font-bold text-center mt-5">Internal Server Error Try Again</p>
        </div>
      )}
      {isLoading && 
         <TweetSkeleton/>
    }
      {data?.success && (
        <>
          {data.data.length == 0 && (
            <div className="text-center font-bold text-xl text-white p-4 py-12  ">
              {" "}
              He doesn't Have any Replies{" "}
            </div>
          )}

        </>
      )}
      {data?.data?.map((item  , index) => {
        return (
          <motion.div initial={{opacity : 0 , y:10  }} animate={{opacity : 1 , y:0  }} transition={{duration : 0.7}} className="border-b border-white/20  py-4  " key={index}>
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
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserReplies;
