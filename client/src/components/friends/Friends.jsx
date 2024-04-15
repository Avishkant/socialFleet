import React from "react";
import "./Friends.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMakeRequest from "../../hook/useFetch";
const Friends = () => {
  const queryClient = useQueryClient();
  const makeRequest = useMakeRequest();
  const { isLoading, error, data } = useQuery(["relationship"], () =>
    makeRequest
      .get("/friends/find/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
      })
  );

  const mutation = useMutation(
    () => {
      return makeRequest.delete("/friends/find/" + username);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleUnFollow = () => {
    mutation.mutate();
  };
  return (
    <div className="container">
      <div className="item">
        <span>Following Friends</span>
        {!isLoading &&
          data.map((friend) => (
            <a href={`/profile/${friend.id}`} key={friend.id}>
              <div className="user">
                <div className="userInfo">
                  <img
                    src={
                      friend?.profile
                        ? friend.profile
                        : "https://w7.pngwing.com/pngs/522/620/png-transparent-photo-image-person-icon-images.png"
                    }
                    alt=""
                  />
                  <span>{friend.name + `  (${friend.username})`}</span>
                </div>
                <div className="buttons">
                  <button disabled>following</button>
                  <button disabled>dismiss</button>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default Friends;
