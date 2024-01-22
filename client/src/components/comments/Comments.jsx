import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios.js";
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState("");

  const postIde = JSON.stringify(postId.id);
  // sending request
  const { isLoading, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postIde).then((res) => {
      return res.data;
    })
  );

  // Create a client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: "comments" });
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    mutation.mutate({ desc, postId: postId.id });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "Loading..."
        : data?.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={comment.profilePic} alt={comment.name} />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
