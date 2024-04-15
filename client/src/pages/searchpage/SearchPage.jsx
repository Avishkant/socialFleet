import { useContext, useEffect, useState } from "react";
import LeftBar from "../../components/leftBar/LeftBar";
import { DarkModeContext } from "../../context/darkModeContext";
import "./SearchPage.scss";
import { AuthContext } from "../../context/authContext";
import useMakeRequest from "../../hook/useFetch";
import Spinner from "../../components/spinner/Spinner";
import { useQuery } from "@tanstack/react-query";
import profilePic from "../../assets/profilePic.png";
import FollowBtn from "../../components/follow/FollowBtn";
import { useLocation, useParams } from "react-router-dom";
import Posts from "../../components/posts/Posts";
const SearchPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { username } = useParams();
  const [searchName, setSearchName] = useState(username);
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seePostOf, setSeePostOf] = useState("");

  const makeRequest = useMakeRequest();

  const location = useLocation();

  const getSearchUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await makeRequest.get(
        `users/find?username=${searchName}`
      );
      setdata(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchName?.length > 0) {
      getSearchUser();
    }
  }, [searchName]);

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

  return (
    <div className="search-container">
      <div className="list-container">
        <div
          style={{ display: location.pathname == "/search" ? "flex" : "none" }}
          className="serach-in-follower"
        >
          <label htmlFor="serachF">Search Any User</label>
          <input
            type="text"
            id="serachF"
            name="serachF"
            placeholder="enter name"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        {!searchName ? (
          <h1>Search user now</h1>
        ) : isLoading || rIsLoading ? (
          <Spinner />
        ) : (
          <ul className="list">
            {data.map((user) => {
              return (
                <li key={user.username} className="list-item">
                  <div className="user">
                    <div className="userInfo">
                      <img
                        src={
                          user.profilePic
                            ? "/upload/" + user.profilePic
                            : profilePic
                        }
                        alt="Image"
                      />
                      <span className="name">{user.name}</span>
                      <span className="username">
                        &#40;{user.username}&#41;
                      </span>
                    </div>
                    <div className="buttons">
                      <FollowBtn
                        relationshipData={relationshipData}
                        username={user.username}
                      />
                      <button onClick={() => setSeePostOf(user.username)}>
                        Watch Post
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="big-post-container">
        <div className="box">{seePostOf && <Posts username={seePostOf} />}</div>
      </div>
    </div>
  );
};

export default SearchPage;
