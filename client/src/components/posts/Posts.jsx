import useMakeRequest from "../../hook/useFetch";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const Posts = ({ username }) => {
  const makeRequest = useMakeRequest();
  const location = useLocation();
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest
      .get(
        location.pathname == "/user-post"
          ? `/posts/self?username=${username}`
          : location.pathname.includes("/search")
          ? `/posts/self/other?username=${username}`
          : `/posts?username=${username}`
      )
      .then((res) => {
        return res.data;
      })
  );
  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "loading"
      ) : data.length == 0 ? (
        <h2 style={{ textAlign: "center" }}>Not Uploaded Any Post</h2>
      ) : (
        data.map((post) => <Post post={post} key={post.Id} />)
      )}
    </div>
  );
};

export default Posts;
