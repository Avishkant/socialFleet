import { useContext, useEffect, useState } from "react";
import useMakeRequest from "../../hook/useFetch";
import "./rightBar.scss";
import profilePic from "../../assets/profilePic.png";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner/Spinner";
import FollowBtn from "../follow/FollowBtn";
const RightBar = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const makeRequest = useMakeRequest();
  const [userdata, setUserdata] = useState([]);
  const getSuggestion = async () => {
    const { data } = await makeRequest.get("/suggestions");
    setUserdata(data);
    setLoading(false);
  };

  useEffect(() => {
    getSuggestion();
  }, []);

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
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {loading || rIsLoading ? (
            <Spinner />
          ) : (
            <ul className="list">
              {userdata.map((friend, index) => {
                if (friend.username === currentUser.username) {
                  return "";
                }
                return (
                  <li key={index} className="list-item">
                    <div className="user">
                      <div className="userInfo">
                        <img
                          src={
                            friend.profilePic
                              ? "/upload/" + friend.profilePic
                              : profilePic
                          }
                          alt="Image"
                        />
                        <span className="name">{friend.name}</span>
                        <span className="username">
                          &#40;{friend.username}&#41;
                        </span>
                      </div>
                      <div className="buttons">
                        <FollowBtn
                          relationshipData={relationshipData}
                          username={friend.username}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/*----------------------latest activity check-------------------------------- */}
        {/* <div className="item">
          <span>Latest Activities</span>
        <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div> */}
        
        
        {/* --------------------Online user check------------------------------------- */}
       
        {/* <div className="item">
          <span>Online Friends</span>
           <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
        </div> */}
      
      
      </div>
    </div>
  );
};

export default RightBar;
