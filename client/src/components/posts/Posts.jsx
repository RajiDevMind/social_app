import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios.js";
import { Navigate } from "react-router-dom";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery("posts", () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error ? (
        <Navigate to={"/login"} />
      ) : isLoading ? (
        "Loading..."
      ) : (
        data?.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
