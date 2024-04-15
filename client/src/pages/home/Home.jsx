import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import useMakeRequest from "../../hook/useFetch";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts username={currentUser.username} />
    </div>
  );
};

export default Home;
