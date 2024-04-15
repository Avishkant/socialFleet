import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import ProfilePic from "../../assets/profilePic.png";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import useMakeRequest from "../../hook/useFetch";
import FollowBtn from "../../components/follow/FollowBtn";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const makeRequest = useMakeRequest();

  const { username } = useParams();

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest
      .get("/users/find/" + username)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
      })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest
        .get(
          "/relationships/following/onlyusername?followerUsername=" +
            currentUser.username
        )
        .then((res) => {
          return res.data;
        })
  );
 console.log(username===currentUser.username)
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?username=" + username);
      return makeRequest.post("/relationships", { username });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.username));
  };
  const urlCoverPic = data?.coverPic ? data.coverPic : "";
  const urlProfilePic = data?.profilePic ? data.profilePic : "";

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img
              src={urlCoverPic ? "/upload/" + urlCoverPic : "/sf.png"}
              alt=""
              className="cover"
            />
            <img
              src={urlProfilePic ? "/upload/" + urlProfilePic : ProfilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com" target="_blank">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="https://www.instagram.com/" target="_blank">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="https://twitter.com/?lang=en" target="_blank">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="https://www.linkedin.com/" target="_blank">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="https://in.pinterest.com/" target="_blank">
                  <PinterestIcon fontSize="large" />
                </a>
                <a href="https://www.youtube.com/" target="_blank">
                  <YouTubeIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>
                      <a
                        target="_blank"
                        href={`https://www.google.com/maps/search/${data?.city}`}
                      >
                        {data?.city}
                      </a>
                    </span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>
                      <a target="_blank" href={"https://" + data?.website}>
                        {data?.website}
                      </a>
                    </span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : username == currentUser.username ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <FollowBtn
                    username={username}
                    relationshipData={relationshipData}
                  />
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts username={username} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
