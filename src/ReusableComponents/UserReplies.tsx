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

  console.log(data)


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
      {data?.data.map((item) => {
        return (
          <div className="border-b border-gray-700 py-4  ">
            {item.parentId && <Tweet4 createdAt={item.parent.tweet.createdAt} photoURL={item.parent.user.photoURL} tweetid={item.parent.tweet.id} content={item.parent.content} username={item.parent.user.username} date={""}  name={item.parent.user.name} />  }
            {item.tweetid && <Tweet4 createdAt={item.tweet.createdAt} photoURL={item.tweet.user.photoURL} tweetid={item.tweet.id} content={item.tweet.text as string} username={item.tweet.user.username} date={""}  name={item.tweet.user.name} />  }
            <Reply2
              content={item.content}
              replyid ={item.id}
              username={user.username}
              date=""
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
