import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios.js";
import moment from "moment";
import { AuthContext } from "../../context/authContext.js";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const postId = post.id;

  const { isLoading, error, data } = useQuery(["likes", postId], () =>
    makeRequest.get("/likes?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation(
    (liked) => {
      // check if liked or not
      if (liked) return makeRequest.delete("/likes?postId=" + postId);
      return makeRequest.post("/likes", { postId: postId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const handleLike = () => {
    // check if liked or not
    mutation.mutate(data?.includes(currentUser.id));
  };

  const deletePost = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleDelete = () => {
    // post.id from props
    deletePost.mutate(postId);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(true)} />
          {menuOpen && <button onClick={handleDelete}>delete</button>}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt={post.name} />
        </div>
        <div className="info">
          <div className="item">
            {error ? (
              "error loading "
            ) : isLoading ? (
              "Loading... "
            ) : data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post} key={post.id} />}
      </div>
    </div>
  );
};

export default Post;
