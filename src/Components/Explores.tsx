import { useParams } from "react-router-dom";
import { searchUser } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ReusableComponents/Loader";
import UserCard from "../ReusableComponents/UserCard";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";

const Explores = () => {
  const { query } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["query", query],
    queryFn: () => searchUser(query as string),
  });
  return (
    <div>
      {isLoading && <Loader />}
      {error && (
        <div className="font-bold text-center text-2xl  mt-8">
          {" "}
          Something Went Wrong!{" "}
        </div>
      )}
      {data?.success && (
        <>
          {data?.data && (
            <>
              <ReuseableTitle title={`Query : ${query}`} />
              <div className="mt-16"></div>

              {data.data.length == 0 && <div>Not found any user!</div>}
              {data.data.map((user  , index) => {
                return <UserCard user={user}  key={index} />;
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Explores;
