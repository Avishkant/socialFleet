import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import useMakeRequest from "../../hook/useFetch";
import { toast } from "react-toastify";
import Story from "./Story";
import CloseIcon from "@mui/icons-material/Close";
import { queryClient } from "../..";
import StoryCarousel from "./StoryCarousel";
const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const makeRequest = useMakeRequest();
  const [openStories, setOpenStories] = useState(false);
  const [intialStory, setIntialStory] = useState(0);
  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  const mutation = useMutation(
    (formData) => {
      return makeRequest.post("/stories", formData);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        toast.success("Story Uploaded");
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  const handleUpload = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    mutation.mutate(formData);
  };

  return (
    <div className="stories">
      <div className="slider">
        {error ? (
          "Something went wrong"
        ) : isLoading ? (
          "loading"
        ) : data.length == 0 ? (
          <div style={{ position: "relative" }}>
            <Story
              imgSrc={currentUser.profilePic}
              username={"Your Stories"}
              onClick={() => ""}
            />
            <label className="uploadIcon" htmlFor="media">
              +
            </label>
            <input
              type="file"
              style={{ display: "none" }}
              name="media"
              id="media"
              onChange={(e) => handleUpload(e)}
            />
          </div>
        ) : (
          data.map((story, index) =>
            data.length == 1 && story.username !== currentUser.username ? (
              <>
                <div key={"index"} style={{ position: "relative" }}>
                  <Story
                    imgSrc={currentUser.profilePic}
                    username={"Your Stories"}
                    onClick={() => ""}
                  />
                  <label className="uploadIcon" htmlFor="media">
                    +
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    name="media"
                    id="media"
                    onChange={(e) => handleUpload(e)}
                  />
                </div>
                <div>
                  <Story
                    key={"uniqe"}
                    imgSrc={story.profilePic}
                    username={story.username}
                    onClick={() => {
                      setIntialStory(index);
                      setOpenStories(true);
                    }}
                  />
                </div>
              </>
            ) : story.username == currentUser.username ? (
              <div key={index} style={{ position: "relative" }}>
                <Story
                  imgSrc={story.profilePic}
                  username={index == 0 ? "Your Stories" : story.username}
                  onClick={() => {
                    setIntialStory(index);
                    setOpenStories(true);
                  }}
                />
                <label className="uploadIcon" htmlFor="media">
                  +
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="media"
                  id="media"
                  onChange={(e) => handleUpload(e)}
                />
              </div>
            ) : (
              <div key={index}>
                <Story
                  imgSrc={story.profilePic}
                  username={story.username}
                  onClick={() => {
                    setIntialStory(index);
                    setOpenStories(true);
                  }}
                />
              </div>
            )
          )
        )}
      </div>
      {openStories && (
        <StoryCarousel
          setOpenStories={setOpenStories}
          users={data}
          initialIndex={intialStory}
        />
      )}
    </div>
  );
};

export default Stories;
