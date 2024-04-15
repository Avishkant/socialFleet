import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import useMakeRequest from "../../hook/useFetch";

const FollowBtn = ({ relationshipData, username }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const makeRequest = useMakeRequest();
  const [action, setAction] = useState(false);
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
        setAction(false);
      },
    }
  );

  const handleFollow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    mutation.mutate(relationshipData.includes(username));
    setAction(true);
  };

  return (
    <button
      onClick={handleFollow}
      disabled={action}
      style={{
        cursor: action ? "not-allowed" : "pointer",
        backgroundColor: "#5271ff",
      }}
    >
      {relationshipData.includes(username) ? "Following" : "Follow"}
    </button>
  );
};

export default FollowBtn;
