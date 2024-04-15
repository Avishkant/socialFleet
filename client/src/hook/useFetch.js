import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

 const useMakeRequest = () => {
  const { currentUser } = useContext(AuthContext);
  const makeRequest = axios.create({
    baseURL: "http://localhost:8800/api/",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  });

  return makeRequest;
};

export default useMakeRequest