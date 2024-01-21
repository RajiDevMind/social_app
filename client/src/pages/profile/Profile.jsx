import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios.js";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";
import { useContext } from "react";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  // fetching followers from DB
  const { isLoading: loadFollowers, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation(
    (following) => {
      // check if following or not
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    // check if liked or not
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };
  return (
    <>
      {isLoading ? (
        "Loading din"
      ) : (
        <div className="profile">
          <div className="images">
            <img
              src={data?.coverPic}
              alt={data?.name + " cover picture here"}
              className="cover"
            />
            <img
              src={data?.profilePic}
              alt={data?.name}
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data?.website}</span>
                  </div>
                </div>
                {loadFollowers ? (
                  "Loading"
                ) : userId === currentUser.id ? (
                  <button>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "following"
                      : "follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
