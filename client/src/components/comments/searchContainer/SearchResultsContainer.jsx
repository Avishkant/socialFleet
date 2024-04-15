import React, { useContext } from "react";
import "./SearchResultsContainer.scss";
import { AuthContext } from "../../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import FollowBtn from "../../follow/FollowBtn";
import { useQuery } from "@tanstack/react-query";
import useMakeRequest from "../../../hook/useFetch";
const SearchResultsContainer = ({ data, setIsSearch }) => {
  const navigate = useNavigate();
  const makeRequest = useMakeRequest();
  const { currentUser } = useContext(AuthContext);
  const handleClick = (id) => {
    setIsSearch(false);
    // navigate(`/profile/${id}`);
  };
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest
        .get("/relationships?followedUsername=" + currentUser.username)
        .then((res) => {
          return res.data;
        })
  );

  return (
    <div className="search-container">
      <div className="item">
        {data.length === 0 && <h3>No user Found</h3>}
        {data.length > 0 &&
          data.map((user) =>
            currentUser.id === user.id ? (
              ""
            ) : (
              <a href={`/profile/${user.id}`} key={user.id}>
                <div
                  className="user"
                  // key={user.id}
                  onClick={() => handleClick(user.id)}
                >
                  <div className="userInfo">
                    <img
                      src={
                        user.profilePic
                          ? `/upload/${user.profilePic}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDnAV2195eKjdsIWb9qODnuYgxUnwJ0exESA&usqp=CAU"
                      }
                      alt=""
                    />
                    <div className="name">
                      <span className="username">{user.username}</span>
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div className="buttons">
                    {!rIsLoading && (
                      <FollowBtn
                        username={user.username}
                        relationshipData={relationshipData}
                        isSearch={true}
                      />
                    )}
                  </div>
                </div>
              </a>
            )
          )}
      </div>
    </div>
  );
};

export default SearchResultsContainer;
